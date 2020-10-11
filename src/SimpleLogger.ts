import {
  Logger,
  LoggerEvent,
  LoggerEventExporter,
  AlertLevel,
  EventType,
  LoggerTimmingEvent,
  LoggerCountEvent,
  ExportResult,
  SpanLogger,
  CanonicalCode,
  LoggerAttributes,
  SpanStruct,
  Manager,
  SpanOptions
} from './api';
import { getAlertLevelByStatus, getMillisecondsTime } from './utils';

/**
 * 1. Start event
 *   1. have a count event
 *   2. level：Info
 * 2. End event
 *   1. have Timing & Count events
 *   2. level：level || Info
 * 3. Log Event
 *   1. level：level
 * 4. Store Event
 *   1. level：level || Debug
 * 5. Timing Event
 *   1. level：level || Debug
 * 6. Count Event
 *   1. level：level || Debug
 */
export default class SimpleLogger implements Logger {
  public manager: Manager;
  public span?: SpanStruct;
  private attributes: LoggerAttributes = {
    app: '',
    appVersion: '',
    lib: 'acelogger@0.2.2',
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

  public store(evt: LoggerEvent): void {
    evt.type = EventType.Store;
    const msg = evt.message ? `, ${evt.message}` : '';
    this.innerLog(
      evt.level || AlertLevel.Debug,
      `store ${JSON.stringify(evt.data)} metrics${msg}`,
      {
        ...evt
      }
    );
  }

  public count(name: string, evt?: LoggerCountEvent): void {
    const e = { ...evt };
    e.name = name;
    e.data = e.data || { count: 1 };
    e.type = EventType.Count;

    const msg = e.message ? `, ${e.message}` : '';
    this.innerLog(
      e.level || AlertLevel.Debug,
      `count ${name} ${e.data.count} times${msg}`,
      e
    );
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
    e.data = { duration };
    e.type = EventType.Timing;

    const msg = e.message ? `, ${e.message}` : '';
    this.innerLog(
      e.level || AlertLevel.Debug,
      `timing ${name} ${duration}ms${msg}`,
      e
    );
  }

  // startSpan, throw start event
  // endSpan, throw end event with duration
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
    logger.info(`${span.name}.start`, {
      name: `${span.name}.start`,
      type: EventType.Start
    });
    return logger as SpanLogger;
  }

  public endSpan(evt?: LoggerEvent): void {
    if (!this.span) {
      this.error(new Error('logger.endSpan must call after logger.startSpan'));
      return;
    }

    const e = {
      name: `${this.span.name}.end`,
      type: EventType.End,
      ...evt
    };

    this.span.endTime = getMillisecondsTime(e.time) || this.manager.timer.now();

    e.level = e.level || AlertLevel.Info;
    e.data = {
      duration: this.span.endTime - this.span.startTime,
      ...e.data
    };

    const msg = e.message ? `, ${e.message}` : '';
    this.innerLog(
      e.level,
      `${this.span.name} end with ${e.data.duration}ms${msg}`,
      e
    );
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
    if (this.span) {
      evt.traceFlags =
        evt.traceFlags === undefined || evt.traceFlags === null
          ? this.span.context.traceFlags
          : evt.traceFlags;
    }

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

    evt.level = Math.max(getAlertLevelByStatus(evt.status), level);

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
