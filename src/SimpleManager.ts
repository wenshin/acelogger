import {
  Manager,
  Logger,
  Tracer,
  Timer,
  ExportResult,
  LogLevel,
  LoggerEvent,
  LoggerEventExporter,
  LoggerAttributes,
  ManagerAttributes,
  InnerManagerAttributes,
} from './api';
import { IDCreator } from './api/IDCreator';
import SimpleLogger from './SimpleLogger';
import SimpleTracer from './SimpleTracer';
import { simpleIdCreator } from './SimpleIDCreator';

const defaultTimer = {
  now: () => Date.now(),
};

enum RegisterKeys {
  Logger = 'logger',
  Tracer = 'tracer',
  Timer = 'timer',
  IDCreator = 'idCreator',
}

interface CacheEvents {
  attributes: LoggerAttributes;
  events: LoggerEvent[];
}

export default class SimpleManager implements Manager {
  public eventBuffer = new Map<LogLevel, Map<string, CacheEvents>>();
  // public for test
  public flushTimer: NodeJS.Timeout;

  private defaultLogger: Logger;
  private defaultTracer: Tracer;
  private registries = new Map<
    string,
    Logger | Tracer | Timer | IDCreator | null
  >();
  private exporterMap: Map<LogLevel, LoggerEventExporter[]> = new Map();
  // 200ms is the minimum interval for human eyes to feel no delay
  private flushDelay = 200;
  private flushCallbacks: Array<() => void> = [];
  private isFlushReady = false;
  private _attributes: InnerManagerAttributes = {
    app: 'unknown',
    appVersion: 'unknown',
    lib: 'acelogger',
    libVersion: '0.13.5',
    os: 'unknown',
    osVersion: 'unknown',
    env: 'production',
  };

  constructor(options?: { flushDelay?: number }) {
    this.defaultLogger = new SimpleLogger();
    this.defaultLogger.manager = this;
    this.defaultTracer = new SimpleTracer();
    this.defaultTracer.manager = this;
    if (options && options.flushDelay) {
      this.flushDelay = options && options.flushDelay;
    }
  }

  public setAttributes(attrs: ManagerAttributes): void {
    Object.assign(this._attributes, attrs);
  }

  get attributes() {
    return this._attributes;
  }

  public setLogger(logger: Logger | null): void {
    this.registries.set('logger', logger);
    if (logger) {
      logger.manager = this;
    }
  }

  get logger(): Logger {
    return (
      (this.registries.get(RegisterKeys.Logger) as Logger) || this.defaultLogger
    );
  }

  public setTracer(tracer: Tracer | null): void {
    this.registries.set('tracer', tracer);
    if (tracer) {
      tracer.manager = this;
    }
  }

  get tracer(): Tracer {
    return (
      (this.registries.get(RegisterKeys.Tracer) as Tracer) || this.defaultTracer
    );
  }

  public setTimer(timer: Timer | null): void {
    this.registries.set(RegisterKeys.Timer, timer);
  }

  get timer(): Timer {
    return (this.registries.get(RegisterKeys.Timer) as Timer) || defaultTimer;
  }

  public setIDCreator(idCreator: IDCreator): void {
    this.registries.set(RegisterKeys.IDCreator, idCreator);
  }

  get idCreator(): IDCreator {
    return (
      (this.registries.get(RegisterKeys.IDCreator) as IDCreator) ||
      simpleIdCreator
    );
  }

  /**
   * @deprecate
   * from 0.10.0 has been replaced by flushDelay with default value 200ms
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public setBufferSize(_: number): void {
    console.warn('DEPRECATED from 0.10.0');
  }

  public setFlushDelay(delay: number): void {
    this.flushDelay = delay;
  }

  public setFlushReady(): void {
    this.isFlushReady = true;
  }

  public setExporter(level: LogLevel, exportor: LoggerEventExporter): this {
    Object.keys(LogLevel).forEach((l) => {
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

  public addEvent(
    spanId: string,
    attrs: LoggerAttributes,
    event: LoggerEvent
  ): this {
    const evts =
      this.eventBuffer.get(event.level) || new Map<string, CacheEvents>();
    const evtsBySpan = evts.get(spanId) || {
      attributes: attrs,
      events: [],
    };
    evtsBySpan.attributes = attrs;
    evtsBySpan.events.push(event);
    evts.set(spanId, evtsBySpan);
    this.eventBuffer.set(event.level, evts);

    this.flush();
    return this;
  }

  public flush(cb?: () => void): void {
    if (cb) {
      this.flushCallbacks.push(cb);
    }
    // do not use debounce to reduce the cpu consume
    if (this.flushTimer || !this.isFlushReady) {
      return;
    }

    this.flushTimer = setTimeout(() => {
      // 1. if exporters exist, export all events
      this.eventBuffer.forEach((evtsBySpan, level) => {
        this.export(level, evtsBySpan);
      });
      // 2. reset eventBuffer anyway
      this.eventBuffer = new Map();
      this.flushTimer = null;
      this.flushCallbacks.forEach((f) => f());
    }, this.flushDelay);
  }

  get flushing(): boolean {
    return !!this.flushTimer;
  }

  private export(level: LogLevel, evts: Map<string, CacheEvents>): void {
    try {
      const exporters = this.exporterMap.get(level);
      if (exporters) {
        exporters.forEach((exporter) => {
          exporter.export(
            { attributes: this.attributes, events: Array.from(evts.values()) },
            (result) => {
              if (result !== ExportResult.SUCCESS) {
                // TODO: report error to some exporter
                /* tslint:disable no-console */
                console.error(
                  `Failed export event with ${
                    result === ExportResult.FAILED_NOT_RETRYABLE ? 'no' : ''
                  } retry`
                );
              }
            }
          );
        });
      }
    } catch (err) {
      // TODO: report error to some exporter
      /* tslint:disable no-console */
      console.error('Failed export events with error', err);
    }
  }
}
