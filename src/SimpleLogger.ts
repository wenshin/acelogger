import {
  Logger,
  LoggerEvent,
  LoggerEventExporter,
  AlertLevel,
  EventType,
  LoggerTimmingEvent,
  LoggerCountEvent,
  LoggerStoreEvent,
  ExportResult,
  SpanLogger,
  CanonicalCode,
  LoggerAttributes,
  SpanStruct,
  Manager,
  SpanOptions
} from './api';
import { getMillisecondsTime } from './utils';

export default class SimpleLogger implements Logger {
  public manager: Manager;
  public span?: SpanStruct;
  private attributes: LoggerAttributes = {
    app: '',
    appVersion: '',
    lib: 'acelogger@0.1.1',
    name: '',
    version: ''
  };
  private bufferSize: number = 10;
  private bufferCount: number = 0;
  private eventBuffer: Map<AlertLevel, LoggerEvent[]> = new Map();
  private exporterMap: Map<AlertLevel, LoggerEventExporter[]> = new Map();

  public setAttributes(attrs: LoggerAttributes): void {
    Object.assign(this.attributes, attrs);
    if (attrs.app && !this.attributes.name) {
      this.attributes.name = attrs.app;
      this.attributes.version = attrs.appVersion;
    }
  }

  public getAttributes(): LoggerAttributes {
    return this.attributes;
  }

  public debug(message: string, evt?: LoggerEvent): void {
    this.innerLog(AlertLevel.Debug, message, { ...evt });
  }

  public info(message: string, evt?: LoggerEvent): void {
    this.innerLog(AlertLevel.Info, message, { ...evt });
  }

  public warn(message: string, evt?: LoggerEvent): void {
    this.innerLog(AlertLevel.Warn, message, { ...evt });
  }

  public error(error: Error, evt?: LoggerEvent): void {
    this.innerLog(AlertLevel.Error, error, { ...evt });
  }

  public store(evt: LoggerStoreEvent): void {
    evt.type = EventType.Store;
    this.innerLog(AlertLevel.Info, `store ${Object.keys(evt.data)} metrics`, {
      ...evt
    });
  }

  public count(name: string, evt?: LoggerCountEvent): void {
    const e = { ...evt };
    e.name = name;
    e.data = e.data || 1;
    e.type = EventType.Count;
    this.innerLog(AlertLevel.Info, `count ${name} ${e.data} times`, e);
  }

  /**
   *
   * @param name the name of timing event
   * @param duration ms
   * @param evt other event info
   */
  public timing(
    name: string,
    duration: number,
    evt?: LoggerTimmingEvent
  ): void {
    const e = { ...evt };
    e.name = name;
    e.data = duration;
    e.type = EventType.Timing;
    this.innerLog(AlertLevel.Info, `timing ${name} ${duration}ms`, e);
  }

  public startSpan(name: string, options?: SpanOptions): SpanLogger {
    const opts = this.span
      ? {
          ...options,
          parent: this.span.context
        }
      : options;

    const span = this.manager.tracer.createSpan(name, opts);
    const tracer = this.manager.tracer.toJSON();
    const logger = new SimpleLogger();
    logger.span = span;
    logger.manager = this.manager;
    logger.exporterMap = this.exporterMap;
    logger.bufferSize = this.bufferSize;
    logger.setAttributes({
      ...this.attributes,
      ...span.attributes,
      spanId: span.context.spanId,
      spanKind: span.kind,
      spanName: span.name,
      traceId: span.context.traceId,
      tracerLib: tracer.lib
    });
    logger.count(`${span.name}.start`);
    return logger as SpanLogger;
  }

  public endSpan(evt?: LoggerTimmingEvent): void {
    if (!this.span) {
      this.error(new Error('logger.endSpan must call after logger.startSpan'));
      return;
    }

    this.span.endTime =
      getMillisecondsTime(evt && evt.time) || this.manager.timer.now();

    if (evt && evt.status) {
      this.error(
        new Error(`${this.span.name} failed with status ${evt.status}`),
        evt
      );
    }
    this.timing(
      `${this.span.name}.end`,
      this.span.endTime - this.span.startTime,
      evt
    );
    this.count(`${this.span.name}.end`, evt);
  }

  public setExporter(level: AlertLevel, exportor: LoggerEventExporter): this {
    Object.keys(AlertLevel).forEach(l => {
      const levelValue = AlertLevel[l];
      // set AlertLevel.Info exporter, will alse set all levels which greater than AlertLevel.Info;
      if (typeof levelValue === 'number' && levelValue >= level) {
        const arr = this.exporterMap.get(levelValue) || [];
        arr.push(exportor);
        this.exporterMap.set(levelValue, arr);
      }
    });
    return this;
  }

  public setBufferSize(size: number): this {
    this.bufferSize = size;
    return this;
  }

  public flush(): void {
    // 1. if exporters exist, export all events
    this.eventBuffer.forEach((evts, key) => {
      this.export(key, evts);
    });
    // 2. reset eventBuffer anyway
    this.eventBuffer = new Map();
    this.bufferCount = 0;
    return;
  }

  private innerLog(
    level: AlertLevel,
    message: string | Error,
    evt: LoggerEvent
  ): void {
    evt.level = level;
    evt.attributes = {
      ...this.attributes,
      ...evt.attributes
    };

    if (typeof message === 'string' && message) {
      evt.message = message;
    } else if (message instanceof Error) {
      evt.stack = message.stack;
      evt.message = message.message;
    }

    if (!evt.status) {
      evt.status = CanonicalCode.OK;
    }

    if (!evt.time) {
      evt.time = this.manager.timer.now();
    }

    try {
      if (this.bufferSize <= 1) {
        this.export(evt.level, [evt]);
      } else {
        const evts = this.eventBuffer.get(evt.level) || [];
        evts.push(evt);
        this.bufferCount++;
        this.eventBuffer.set(evt.level, evts);

        if (this.bufferCount >= this.bufferSize) {
          this.flush();
        }
      }
    } catch (err) {
      // TODO: report error to some exporter
      /* tslint:disable no-console */
      console.error('Failed export events with error', err);
    }
  }

  private export(level: AlertLevel, evts: LoggerEvent[]): void {
    try {
      const exporters = this.exporterMap.get(level);
      if (exporters) {
        exporters.forEach(exporter => {
          exporter.export(evts, result => {
            if (result !== ExportResult.SUCCESS) {
              // TODO: report error to some exporter
              /* tslint:disable no-console */
              console.error(
                `Failed export event with ${
                  result === ExportResult.FAILED_NOT_RETRYABLE ? 'no' : ''
                } retry`
              );
            }
          });
        });
      }
    } catch (err) {
      // TODO: report error to some exporter
      /* tslint:disable no-console */
      console.error('Failed export events with error', err);
    }
  }
}
