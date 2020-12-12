import {
  Manager,
  Logger,
  Tracer,
  Timer,
  ExportResult,
  LogLevel,
  LoggerEvent,
  LoggerEventExporter
} from './api';
import SimpleLogger from './SimpleLogger';
import SimpleTracer from './SimpleTracer';

const defaultTimer = {
  now: () => Date.now()
};

enum RegisterKeys {
  Logger = 'logger',
  Tracer = 'tracer',
  Timer = 'timer'
}

export default class SimpleManager implements Manager {
  public eventBuffer: Map<LogLevel, LoggerEvent[]> = new Map();

  private defaultLogger: Logger;
  private defaultTracer: Tracer;
  private registries = new Map<string, any>();
  private exporterMap: Map<LogLevel, LoggerEventExporter[]> = new Map();
  private bufferCount: number = 0;
  private bufferSize: number = 10;
  private flushTimer: NodeJS.Timeout;

  constructor() {
    this.defaultLogger = new SimpleLogger();
    this.defaultLogger.manager = this;
    this.defaultTracer = new SimpleTracer();
    this.defaultTracer.manager = this;
  }

  public setLogger(logger: Logger | null): void {
    this.registries.set('logger', logger);
    if (logger) {
      logger.manager = this;
    }
  }

  get logger(): Logger {
    return this.registries.get(RegisterKeys.Logger) || this.defaultLogger;
  }

  public setTracer(tracer: Tracer | null): void {
    this.registries.set('tracer', tracer);
    if (tracer) {
      tracer.manager = this;
    }
  }

  get tracer(): Tracer {
    return this.registries.get(RegisterKeys.Tracer) || this.defaultTracer;
  }

  public setTimer(timer: Timer | null): void {
    this.registries.set(RegisterKeys.Timer, timer);
  }

  get timer(): Timer {
    return this.registries.get(RegisterKeys.Timer) || defaultTimer;
  }

  public setBufferSize(size: number): void {
    this.bufferSize = size;
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

  public addEvent(evt: LoggerEvent): this {
    const evts = this.eventBuffer.get(evt.level) || [];
    evts.push(evt);
    this.bufferCount++;
    this.eventBuffer.set(evt.level, evts);

    if (this.bufferCount >= this.bufferSize) {
      this.flush();
    }
    return this;
  }

  public flush(cb?: () => void): void {
    if (this.flushTimer) {
      return;
    }

    this.flushTimer = setTimeout(() => {
      // 1. if exporters exist, export all events
      this.eventBuffer.forEach((evts, key) => {
        this.export(key, evts);
      });
      // 2. reset eventBuffer anyway
      this.eventBuffer = new Map();
      this.bufferCount = 0;
      this.flushTimer = null;
      if (cb) {
        cb();
      }
    }, 0);
  }

  get flushing(): boolean {
    return !!this.flushTimer;
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
