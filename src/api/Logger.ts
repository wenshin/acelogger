import { LoggerAttributes } from './LoggerEvent';
import { SpanStruct } from './Span';
import { Manager } from './Manager';
import { SpanOptions } from './Tracer';
import {
  CanonicalCode,
  TraceFlags,
  TimeInput,
  Attributes
} from './opentelemetry';
import { LogLevel } from './consts';

export interface LoggerEventParams {
  level?: LogLevel;
  traceFlags?: TraceFlags;
  // tags for event, always used to filter the event
  attributes?: Attributes;
  // metric data
  metrics?: {
    [key: string]: string | number;
  };
  //  any object data
  data?: {
    spanId?: string;
    traceId?: string;
    [key: string]: any;
  };
  // error status code
  status?: CanonicalCode;
  // error message for event
  message?: string;
  // error stack, only exist when level is EventLevel.Error
  stack?: string;
  // event trigger times
  time?: TimeInput;
}

export interface StartSpanEventOptions extends SpanOptions {
  /**
   * 默认为 true，当设置为 false 时，不会记录 span start 事件
   */
  logStart?: boolean;
  traceFlags?: TraceFlags;
  data?: {
    spanId?: string;
    traceId?: string;
    [key: string]: any;
  };
}

export interface LogParms {
  traceFlags?: TraceFlags;
  // tags for event, always used to filter the event
  attributes?: Attributes;
  //  any object data
  data?: LoggerEventParams['data'];
  // error status code
  status?: CanonicalCode;
}

export type MetricsParams = Omit<LoggerEventParams, 'metrics' | 'time'> & {
  metrics: { [key: string]: number | string };
};

export interface LoggerAttributesParams extends Attributes {
  // logger name
  logger?: string;
  // logger lib name and version, like acelogger@0.0.2
  lib?: string;
}
export type LogFunction = (message: string, evt?: LogParms) => void;

export type SpanLogger = Logger & {
  span: SpanStruct;
};

export interface Logger {
  manager: Manager;
  debug: LogFunction;
  info: LogFunction;
  warn: LogFunction;
  error(err: Error | string, evt?: LogParms): void;
  fatal(err: Error | string, evt?: LogParms): void;

  /**
   * global tags for all logger events.
   * the tags like app name, app version
   * @param attrs
   */
  setAttributes(attrs: LoggerAttributesParams): void;

  getAttributes(): LoggerAttributes;

  /**
   * create span and count span start event
   * @param name
   * @param options
   */
  startSpan(name: string, options?: StartSpanEventOptions): SpanLogger;

  /**
   * end span, and timing span and count span end event
   * @param evt
   */
  endSpan(evt?: LoggerEventParams): void;

  /**
   * save some values for metrics, like cpu usage, memory usage.
   * event level is `LogLevel.Debug`
   * event type is `EventType.Metric`
   * @param evt
   *
   * @example
   * ```typescript
   * api.logger.storeMetrics({
   *   metrics: {
   *     cpuUsage: 0.1,
   *     memoryUsage: 0.5,
   *   }
   * })
   * ```
   */
  storeMetrics(evt: MetricsParams): void;

  /**
   * record any events
   */
  event(name: string, evt?: LoggerEventParams): void;

  /**
   * export all buffered events immediately
   */
  flush(cb?: () => void): void;
}
