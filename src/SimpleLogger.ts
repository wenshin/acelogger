import {
  Logger,
  LoggerEvent,
  LogLevel,
  EventType,
  SpanLogger,
  CanonicalCode,
  LoggerAttributes,
  SpanStruct,
  Manager,
  SpanOptions,
  LogParms,
  MetricsParams,
  LoggerEventParams,
  TraceFlags,
  SpanKind
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
    lib: 'acelogger@0.7.1',
    logger: 'acelogger',
    spanKind: SpanKind.INTERNAL,
    spanName: 'unknown'
  };

  public setAttributes(attrs: LoggerAttributes): void {
    Object.assign(this.attributes, attrs);
  }

  public getAttributes(): LoggerAttributes {
    return this.attributes;
  }

  public debug(message: string, evt?: LogParms): void {
    this.innerLog({
      ...evt,
      level: LogLevel.Debug,
      message,
      name: 'log.debug',
      type: EventType.Log
    });
  }

  public info(message: string, evt?: LogParms): void {
    this.innerLog({
      ...evt,
      level: LogLevel.Info,
      message,
      name: 'log.info',
      type: EventType.Log
    });
  }

  public warn(message: string, evt?: LogParms): void {
    this.innerLog({
      ...evt,
      level: LogLevel.Warn,
      message,
      name: 'log.warn',
      type: EventType.Log
    });
  }

  public error(error: Error, evt?: LogParms): void {
    this.innerLog({
      ...evt,
      level: LogLevel.Error,
      message: error.message,
      name: 'log.error',
      stack: error.stack,
      type: EventType.Log
    });
  }

  public fatal(error: Error, evt?: LogParms): void {
    this.innerLog({
      ...evt,
      level: LogLevel.Fatal,
      message: error.message,
      name: 'log.fatal',
      stack: error.stack,
      type: EventType.Log
    });
  }

  public storeMetrics(evt: MetricsParams): void {
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
  public event(name: string, evt?: LoggerEventParams): void {
    const e = {
      ...evt,
      level: LogLevel.Info,
      message: (evt && evt.message) || `log event: ${name}`,
      name,
      type: EventType.Event
    };
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
    logger.setAttributes({
      ...this.attributes,
      ...span.attributes,
      spanKind: span.kind,
      spanName: span.name
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

  public endSpan(evt?: LoggerEventParams): void {
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

  public flush(): void {
    this.manager.flush();
  }

  private innerLog(
    evt: LoggerEventParams & { name: string; type: EventType }
  ): void {
    let traceFlags = evt.traceFlags || TraceFlags.NONE;
    const data: LoggerEvent['data'] = {
      spanId: '0',
      traceId: '0',
      ...evt.data
    };
    const attributes: LoggerEvent['attributes'] = {
      ...this.attributes,
      ...evt.attributes
    };

    if (this.span) {
      if (evt.traceFlags === undefined || evt.traceFlags === null) {
        traceFlags = this.span.context.traceFlags;
      }

      data.spanId = this.span.context.spanId;
      data.traceId = this.span.context.traceId;

      attributes.spanName = this.span.name;
      attributes.spanKind = this.span.kind;
    }

    const status = evt.status || CanonicalCode.OK;
    const level = Math.max(getLogLevelByStatus(status), evt.level);
    const time = evt.time || this.manager.timer.now();

    this.manager.addEvent({
      attributes,
      data,
      level,
      message: evt.message,
      metrics: evt.metrics,
      name: evt.name,
      stack: evt.stack,
      status,
      time,
      traceFlags,
      type: evt.type
    });
  }
}
