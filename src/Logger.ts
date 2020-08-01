import { Sampler, HrTime, CanonicalCode } from '@opentelemetry/api';
import { isTimeInputHrTime, hrTimeToMilliseconds } from '@opentelemetry/core';
import api, { SpanOptions, Logger, LoggerEvent, SpanStruct, LoggerEventExporter, AlertLevel, EventType, LoggerTimmingEvent, LoggerCountEvent, LoggerStoreEvent, ExportResult, SpanLogger } from './api';

export default class SimpleLogger implements Logger {
  public span?: SpanStruct;
  private bufferSize: number = 10;
  private bufferCount: number = 0;
  private eventBuffer: Map<AlertLevel, LoggerEvent[]> = new Map();
  private exporterMap: Map<AlertLevel, LoggerEventExporter[]> = new Map();
  private samplerMap: Map<AlertLevel, Sampler> = new Map();

  public startSpan(name: string, options?: SpanOptions): SpanLogger {
    const opts = this.span ? {
      ...options,
      parent: this.span.context
    } : options;

    const span = api.tracer.createSpan(name, opts);
    const logger = new SimpleLogger();
    logger.span = span;
    logger.exporterMap = this.exporterMap;
    logger.samplerMap = this.samplerMap;
    logger.bufferSize = this.bufferSize;
    logger.count(`${span.name}.start`);
    return logger as SpanLogger;
  }

  public endSpan(evt?: LoggerTimmingEvent): void {
    if (!this.span) {
      this.error(new Error('logger.endSpan must call after logger.startSpan'));
      return;
    }
    const endTime = evt && evt.time;
    this.span.endTime = Date.now();
    if (endTime && isTimeInputHrTime(endTime)) {
      this.span.endTime = hrTimeToMilliseconds(endTime as HrTime);
    }

    if (evt && evt.status) {
      this.error(new Error(`${this.span.name} failed with status ${evt.status}`), evt);
    }
    this.timing(`${this.span.name}.end`, this.span.endTime - this.span.startTime, evt);
    this.count(`${this.span.name}.end`, evt);
  }

  public debug(message: string, evt?: LoggerEvent): void {
    this.innerLog(AlertLevel.Debug, message, { ...evt });
  }

  public info(message: string, evt?: LoggerEvent): void {
    this.innerLog(AlertLevel.Info, message, { ...evt });
  }

  public warn(message: string, evt?: LoggerEvent): void {
    this.innerLog(AlertLevel.Warn, message, { ...evt });
  }

  public error(error: Error, evt?: LoggerEvent): void {
    this.innerLog(AlertLevel.Error, error, { ...evt });
  }

  public store(evt: LoggerStoreEvent): void {
    evt.type = EventType.Store;
    this.innerLog(AlertLevel.Info, '', { ...evt });
  }

  public count(name: string, evt?: LoggerCountEvent): void {
    const e = { ...evt };
    e.name = name;
    e.data = e.data || 1;
    e.type = EventType.Count;
    this.innerLog(AlertLevel.Info, `count ${name} ${e.data} times`, e);
  }

  /**
   *
   * @param name the name of timing event
   * @param duration ms
   * @param evt other event info
   */
  public timing(name: string, duration: number, evt?: LoggerTimmingEvent): void {
    const e = { ...evt };
    e.name = name;
    e.data = duration;
    e.type = EventType.Timing;
    this.innerLog(AlertLevel.Info, `timing ${name} ${duration}ms`, e);
  }

  public setExporter(level: AlertLevel, exportor: LoggerEventExporter): this {
    Object.keys(AlertLevel).forEach(l => {
      const levelValue = AlertLevel[l];
      // set AlertLevel.Info exporter, will alse set all levels which greater than AlertLevel.Info;
      if (typeof levelValue === 'number' && levelValue >= level) {
        const arr = this.exporterMap.get(levelValue) || [];
        arr.push(exportor);
        this.exporterMap.set(levelValue, arr);
      }
    })
    return this;
  }

  public setSampler(level: AlertLevel, sampler: Sampler): this {
    this.samplerMap.set(level, sampler);
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

  private innerLog(
    level: AlertLevel,
    message: string | Error,
    evt: LoggerEvent
  ): void {
    evt.level = level;
    if (typeof message === 'string' && message) {
      evt.message = message;
    } else if (message instanceof Error) {
      evt.error = message;
      evt.message = message.message;
    }

    if (!evt.status) {
      evt.status = CanonicalCode.OK;
    }

    if (!evt.time) {
      evt.time = Date.now();
    }

    try {
      const tracer = api.tracer.toJSON();
      const span = this.span || ({} as unknown as SpanStruct);
      evt.attributes = {
        ...evt.attributes,
        ...span.attributes,
        spanId: span.context && span.context.spanId,
        spanKind: span.kind,
        spanName: span.name,
        traceId: span.context && span.context.traceId,
        tracerModule: tracer.module,
        tracerModuleVersion: tracer.moduleVersion,
        tracerName: tracer.name,
        tracerVersion: tracer.version,
      };

      const sampler = this.samplerMap.get(level);
      if (sampler && !sampler.shouldSample(span.context)) {
        return;
      }

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

  private export(level: AlertLevel, evts: LoggerEvent[]): void {
    try {
      const exporters = this.exporterMap.get(level);
      if (exporters) {
        exporters.forEach((exporter) => {
          exporter.export(evts, (result) => {
            if (result !== ExportResult.SUCCESS) {
              // TODO: report error to some exporter
              /* tslint:disable no-console */
              console.error(`Failed export event with ${result === ExportResult.FAILED_NOT_RETRYABLE ? 'no' : ''} retry`);
            }
          })
        })
      }
    } catch (err) {
      // TODO: report error to some exporter
      /* tslint:disable no-console */
      console.error('Failed export events with error', err);
    }
  }
}
