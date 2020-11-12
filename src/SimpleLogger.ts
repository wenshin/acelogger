import {
  Logger,
  LoggerEvent,
  LoggerEventExporter,
  LogLevel,
  EventType,
  ExportResult,
  SpanLogger,
  CanonicalCode,
  LoggerAttributes,
  SpanStruct,
  Manager,
  SpanOptions
} from './api';
import { getLogLevelByStatus, getMillisecondsTime } from './utils';

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
    lib: 'acelogger@0.4.0',
    logger: 'acelogger'
  };
  private bufferSize: number = 10;
  private bufferCount: number = 0;
  private eventBuffer: Map<LogLevel, LoggerEvent[]> = new Map();
  private exporterMap: Map<LogLevel, LoggerEventExporter[]> = new Map();

  public setAttributes(attrs: LoggerAttributes): void {
    Object.assign(this.attributes, attrs);
  }

  public getAttributes(): LoggerAttributes {
    return this.attributes;
  }

  public debug(message: string, evt?: LoggerEvent): void {
    this.innerLog({
      ...evt,
      level: LogLevel.Debug,
      message,
      name: 'log.debug'
    });
  }

  public info(message: string, evt?: LoggerEvent): void {
    this.innerLog({
      ...evt,
      level: LogLevel.Info,
      message,
      name: 'log.info'
    });
  }

  public warn(message: string, evt?: LoggerEvent): void {
    this.innerLog({
      ...evt,
      level: LogLevel.Warn,
      message,
      name: 'log.warn'
    });
  }

  public error(error: Error, evt?: LoggerEvent): void {
    this.innerLog({
      ...evt,
      level: LogLevel.Error,
      message: error.message,
      name: 'log.error',
      stack: error.stack
    });
  }

  public fatal(error: Error, evt?: LoggerEvent): void {
    this.innerLog({
      ...evt,
      level: LogLevel.Fatal,
      message: error.message,
      name: 'log.fatal',
      stack: error.stack
    });
  }

  public storeMetrics(evt: LoggerEvent): void {
    const msg = evt.message ? `, ${evt.message}` : '';
    this.innerLog({
      ...evt,
      level: evt.level || LogLevel.Debug,
      message: `store ${JSON.stringify(evt.metrics)}${msg}`,
      name: 'metric.store',
      type: EventType.Metric
    });
  }

  /**
   * normal events
   * @param name
   * @param evt
   */
  public event(name: string, evt?: LoggerEvent): void {
    const e = { ...evt };
    e.name = name;
    e.type = EventType.Event;
    e.level = LogLevel.Info;
    e.message = e.message || `log event: ${name}`;
    this.innerLog(e);
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
      traceId: span.context.traceId
    });
    logger.innerLog({
      level: LogLevel.Info,
      message: `${span.name}.start`,
      metrics: {
        [`${span.name}.start.latency`]: span.startTime - span.userStartTime
      },
      name: `${span.name}.start`,
      type: EventType.Tracing
    });
    return logger as SpanLogger;
  }

  public endSpan(evt?: LoggerEvent): void {
    if (!this.span) {
      this.error(new Error('logger.endSpan must call after logger.startSpan'));
      return;
    }

    const e = {
      ...evt,
      name: `${this.span.name}.end`,
      type: EventType.Tracing
    };

    e.level = e.level || LogLevel.Info;

    this.span.endTime = getMillisecondsTime(e.time) || this.manager.timer.now();
    const duration = this.span.endTime - this.span.startTime;
    e.metrics = {
      [`${this.span.name}.duration`]: duration,
      ...e.metrics
    };

    const msg = e.message ? `, ${e.message}` : '';
    e.message = `${this.span.name} end with ${duration}ms${msg}`;
    this.innerLog(e);
  }

  public setExporter(level: LogLevel, exportor: LoggerEventExporter): this {
    Object.keys(LogLevel).forEach(l => {
      const levelValue = LogLevel[l];
      // set LogLevel.Info exporter, will alse set all levels which greater than LogLevel.Info;
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

  private innerLog(evt: LoggerEvent): void {
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

    if (!evt.status) {
      evt.status = CanonicalCode.OK;
    }

    evt.level = Math.max(getLogLevelByStatus(evt.status), evt.level);

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

  private export(level: LogLevel, evts: LoggerEvent[]): void {
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
