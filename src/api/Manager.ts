import { Attributes } from './opentelemetry';
import { Tracer } from './Tracer';
import { Logger } from './Logger';
import { Timer } from './Timer';
import { LogLevel } from './consts';
import { LoggerEventExporter } from './LoggerEventExporter';
import { LoggerEvent } from './LoggerEvent';
import { LoggerAttributes } from './Logger';
import { IDCreator } from './IDCreator';

export interface ManagerAttributes extends Attributes {
  app: string;
  appVersion: string;
  /**
   * the library name of the manager
   */
  lib?: string;
  libVersion?: string;
  os: string;
  osVersion: string;
  env: 'production' | 'staging' | 'development' | string;
}

export type InnerManagerAttributes = ManagerAttributes & {
  lib: string;
  libVersion: string;
};

export interface CacheEvents {
  attributes: LoggerAttributes;
  events: LoggerEvent[];
}

export interface Manager {
  readonly logger: Logger;
  readonly tracer: Tracer;
  readonly timer: Timer;
  readonly idCreator: IDCreator;
  readonly flushing: boolean;
  readonly attributes: InnerManagerAttributes;
  eventBuffer: Map<LogLevel, Map<string, CacheEvents>>;

  setAttributes(attrs: ManagerAttributes): void;

  setLogger(logger: Logger | null): void;
  setTracer(tracer: Tracer | null): void;
  setTimer(timer: Timer | null): void;
  setIDCreator(idCreator: IDCreator | null): void;
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
  addEvent(spanId: string, attrs: LoggerAttributes, event: LoggerEvent): void;
  /**
   * export all cached events
   */
  flush(cb?: () => void): void;
}
