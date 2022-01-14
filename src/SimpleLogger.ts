import { stackToFrame } from '.';
import {
  Logger,
  LogLevel,
  EventType,
  SpanLogger,
  CanonicalCode,
  LoggerAttributes,
  SpanStruct,
  Manager,
  LogParms,
  MetricsParams,
  LoggerEventParams,
  TraceFlags,
  SpanKind,
  StartSpanEventOptions,
  LoggerEvent,
} from './api';
import {
  getDurationMetric,
  getLatencyMetric,
  getSpanEventName,
  getLogLevelByStatus,
  getMillisecondsTime,
} from './utils';

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
    logger: 'unknown',
    spanKind: SpanKind.INTERNAL,
    spanName: 'unknown',
  };

  public setAttributes(attrs: Partial<LoggerAttributes>): void {
    Object.assign(this.attributes, attrs);
  }

  public getAttributes(): LoggerAttributes {
    return this.attributes;
  }

  public debug(message: string, evt?: LogParms): void {
    this.innerLog(
      Object.assign({}, evt, {
        level: LogLevel.Debug,
        message,
        name: 'log.debug',
        type: EventType.Log,
      })
    );
  }

  public info(message: string, evt?: LogParms): void {
    this.innerLog(
      Object.assign({}, evt, {
        level: LogLevel.Info,
        message,
        name: 'log.info',
        type: EventType.Log,
      })
    );
  }

  public warn(message: string, evt?: LogParms): void {
    this.innerLog(
      Object.assign({}, evt, {
        level: LogLevel.Warn,
        message,
        name: 'log.warn',
        type: EventType.Log,
      })
    );
  }

  public error(error: Error | string, evt?: LogParms): void {
    let message = '';
    let stack = '';
    if (error instanceof Error) {
      message = error.message;
      stack = error.stack;
    } else {
      message = error;
    }
    this.innerLog(
      Object.assign({}, evt, {
        level: LogLevel.Error,
        message,
        name: 'log.error',
        stack,
        type: EventType.Log,
      })
    );
  }

  public fatal(error: Error | string, evt?: LogParms): void {
    let message = '';
    let stack = '';
    if (error instanceof Error) {
      message = error.message;
      stack = error.stack;
    } else {
      message = error;
    }
    this.innerLog(
      Object.assign({}, evt, {
        level: LogLevel.Fatal,
        message,
        name: 'log.fatal',
        stack,
        type: EventType.Log,
      })
    );
  }

  public storeMetrics(evt: MetricsParams): void {
    const msg = evt.message ? `, ${evt.message}` : '';
    this.innerLog(
      Object.assign({}, evt, {
        level: evt.level || LogLevel.Debug,
        message: `store ${JSON.stringify(evt.metrics)}${msg}`,
        name: 'metric.store',
        type: EventType.Metric,
      })
    );
  }

  /**
   * normal events
   * @param name
   * @param evt
   */
  public event(name: string, evt?: LoggerEventParams): void {
    const e = Object.assign({}, evt, {
      level: LogLevel.Info,
      message: (evt && evt.message) || `log event: ${name}`,
      name,
      type: EventType.Event,
    });
    this.innerLog(e);
  }

  // startSpan, throw start event
  // endSpan, throw end event with duration
  public startSpan(name: string, options?: StartSpanEventOptions): SpanLogger {
    const opts = this.span
      ? Object.assign({}, options, {
          parent: this.span.context,
        })
      : options;

    const span = this.manager.tracer.createSpan(name, opts);
    const logger = new SimpleLogger();
    logger.span = span;
    logger.manager = this.manager;
    logger.setAttributes(
      Object.assign({}, this.attributes, span.attributes, {
        spanKind: span.kind,
        spanName: span.name,
      })
    );
    const logStart = !(opts && opts.logStart === false);
    const eventName = getSpanEventName(span.name, 'start');
    if (logStart) {
      const data: LoggerEvent['data'] = (opts && opts.data) || {};
      data.userStartTime = span.userStartTime;
      logger.innerLog({
        data: data,
        level: LogLevel.Info,
        metrics: {
          [getLatencyMetric(eventName)]: span.startTime - span.userStartTime,
        },
        name: eventName,
        type: EventType.Tracing,
      });
    }
    return logger as SpanLogger;
  }

  public endSpan(evt?: LoggerEventParams): void {
    if (!this.span) {
      this.error(new Error('logger.endSpan must call after logger.startSpan'));
      return;
    }

    const e = Object.assign({}, evt, {
      name: getSpanEventName(this.span.name, 'end'),
      type: EventType.Tracing,
    });

    e.level = e.level || LogLevel.Info;

    this.span.endTime = getMillisecondsTime(e.time) || this.manager.timer.now();
    const duration = this.span.endTime - this.span.startTime;
    e.metrics = Object.assign(
      {},
      {
        [getDurationMetric(this.span.name)]: duration,
      },
      e.metrics
    );

    const msg = e.message ? `, ${e.message}` : '';
    e.message = `${this.span.name} end with ${duration}ms${msg}`;
    this.innerLog(e);
  }

  public flush(cb?: () => void): void {
    this.manager.flush(cb);
  }

  private innerLog(
    evt: LoggerEventParams & { name: string; type: EventType }
  ): void {
    let traceFlags = evt.traceFlags || TraceFlags.NONE;
    const tracing = {
      spanId: this.manager.idCreator.defaultSpanId,
      traceId: this.manager.idCreator.defaultTraceId,
      parentSpanId: '',
    };

    if (this.span) {
      if (evt.traceFlags === undefined || evt.traceFlags === null) {
        traceFlags = this.span.context.traceFlags;
      }

      tracing.spanId = this.span.context.spanId;
      tracing.parentSpanId = this.span.parentContext?.spanId || '';
      tracing.traceId = this.span.context.traceId;
    }

    const status = evt.status || CanonicalCode.OK;
    const level = Math.max(getLogLevelByStatus(status), evt.level);
    const time = evt.time || this.manager.timer.now();
    const samplingRate =
      typeof evt.samplingRate === 'number' ? evt.samplingRate : 1;

    this.manager.addEvent(tracing.spanId, this.attributes, {
      ...tracing,
      attributes: evt.attributes,
      data: evt.data,
      level,
      message: evt.message,
      metrics: evt.metrics,
      name: evt.name,
      samplingRate,
      stack: evt.stack ? stackToFrame(evt.stack) : undefined,
      status,
      time,
      traceFlags,
      type: evt.type,
    });
  }
}
