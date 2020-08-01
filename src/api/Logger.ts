import { Sampler, SpanOptions, TimeInput } from '@opentelemetry/api';
import { AlertLevel } from './consts';
import { LoggerEventExporter } from './LoggerEventExporter';
import {
  LoggerEvent,
  LoggerCountEvent,
  LoggerStoreEvent,
  LoggerTimmingEvent
} from './LoggerEvent';
import { SpanStruct } from './Tracer';

export type LogFunction = (message: string, evt?: LoggerEvent) => void;

export type SpanLogger = Logger & { span: SpanStruct };

export interface Logger {
  debug: LogFunction;
  info: LogFunction;
  warn: LogFunction;
  error(err: Error | string, evt?: LoggerEvent): void;

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
   * event level is `AlertLevel.Info`
   * event type is `EventType.Store`
   * @param evt
   *
   * @example
   * ```typescript
   * api.logger.store({
   *   name: 'same name if exist'
   *   data: {
   *     cpuUsage: 0.1,
   *     memoryUsage: 0.5,
   *   }
   * })
   * ```
   */
  store(evt: LoggerStoreEvent): void;

  /**
   * count event, like dau, mau, pv, uv etc
   * event level is `EventLevel.Info`
   * event type is `EventType.Count`
   * @param evt
   */
  count(name: string, evt?: LoggerCountEvent): void;

  /**
   * event level is `EventLevel.Info`
   * event type is `EventType.Timing`
   * @param evt
   */
  timing(name: string, duration: TimeInput, evt?: LoggerTimmingEvent): void;

  /**
   *
   * @param level   the level which can use the smapler.
   * @param sampler any opentelemetry Sampler implementions
   */
  setSampler(level: AlertLevel, sampler: Sampler): this;

  /**
   * @param level    great than the level will use the exporter.
   * @param exporter the exporter to send data to server.
   */
  setExporter(level: AlertLevel, exporter: LoggerEventExporter): this;

  /**
   * set the buffer size, the implemetion should have a default size
   * @param size
   */
  setBufferSize(size: number): this;

  /**
   * export all buffered events immediately
   */
  flush(): void;
}
