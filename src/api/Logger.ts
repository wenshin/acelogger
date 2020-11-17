import { LoggerEvent, LoggerAttributes } from './LoggerEvent';
import { SpanStruct } from './Span';
import { Manager } from './Manager';
import { SpanOptions } from './Tracer';

export type LogFunction = (message: string, evt?: LoggerEvent) => void;

export type SpanLogger = Logger & {
  span: SpanStruct;
};

export interface Logger {
  manager: Manager;
  debug: LogFunction;
  info: LogFunction;
  warn: LogFunction;
  error(err: Error | string, evt?: LoggerEvent): void;
  fatal(err: Error | string, evt?: LoggerEvent): void;

  /**
   * global tags for all logger events.
   * the tags like app name, app version
   * @param attrs
   */
  setAttributes(attrs: LoggerAttributes): void;

  getAttributes(): LoggerAttributes;

  /**
   * create span and count span start event
   * @param name
   * @param options
   */
  startSpan(name: string, options?: SpanOptions): SpanLogger;

  /**
   * end span, and timing span and count span end event
   * @param evt
   */
  endSpan(evt?: LoggerEvent): void;

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
  storeMetrics(evt: LoggerEvent): void;

  /**
   * record any events
   */
  event(name: string, evt?: LoggerEvent): void;

  /**
   * export all buffered events immediately
   */
  flush(): void;
}
