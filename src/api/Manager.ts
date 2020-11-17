import { Tracer } from './Tracer';
import { Logger } from './Logger';
import { Timer } from './Timer';
import { LogLevel } from './consts';
import { LoggerEventExporter } from './LoggerEventExporter';
import { LoggerEvent } from './LoggerEvent';

export interface Manager {
  readonly logger: Logger;
  readonly tracer: Tracer;
  readonly timer: Timer;
  eventBuffer: Map<LogLevel, LoggerEvent[]>;
  setLogger(logger: Logger | null): void;
  setTracer(tracer: Tracer | null): void;
  setTimer(timer: Timer | null): void;
  /**
   * set the buffer size, the implemetion should have a default size
   * @param size
   */
  setBufferSize(size: number): void;
  /**
   * @param level    great than the level will use the exporter.
   * @param exporter the exporter to send data to server.
   */
  setExporter(level: LogLevel, exporter: LoggerEventExporter): this;
  addEvent(evt: LoggerEvent): void;
  /**
   * export all cached events
   */
  flush(): void;
}
