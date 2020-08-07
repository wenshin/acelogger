import {
  Tracer,
  TracerStruct,
  Span,
  SpanOptions,
  SpanContext,
  TimeInput,
  TraceFlags,
  SpanKind,
  Manager
} from './api';
import { getMillisecondsTime } from './utils';
import SimpleSpan from './SimpleSpan';

type SpanContextConfig = {
  traceId?: string;
  spanId?: string;
  traceFlags?: TraceFlags;
} & SpanContext;

function createSpanId(parentSpanId?: string): string {
  return parentSpanId ? `${parentSpanId}.1` : '1';
}

function createTraceId(): string {
  return (
    Math.random()
      .toString(32)
      .substring(2) +
    Math.random()
      .toString(32)
      .substring(2)
  );
}

export default class SimpleTracer implements Tracer {
  public manager: Manager;
  private data: TracerStruct = {
    lib: 'acelogger@0.0.2',
    startTime: Date.now()
  };

  public toJSON(): TracerStruct {
    return this.data;
  }

  public createSpanContext(ctx?: SpanContextConfig): SpanContext {
    const c = { ...ctx };
    return {
      isRemote: c.isRemote,
      spanId: createSpanId(c.spanId),
      traceFlags: c.traceFlags || TraceFlags.NONE,
      traceId: c.traceId || createTraceId(),
      traceState: c.traceState
    };
  }

  public createSpan(name: string, options?: SpanOptions): Span {
    const opt = options || {};
    const newOptions = {
      attributes: opt.attributes,
      context: this.createSpanContext(opt.parent),
      endTime: 0,
      kind: opt.kind || SpanKind.INTERNAL,
      name,
      parentContext: opt.parent,
      startTime: getMillisecondsTime(opt.startTime) || this.manager.timer.now()
    };
    return new SimpleSpan(newOptions);
  }

  public start(time: TimeInput): void {
    this.data.startTime = getMillisecondsTime(time) || this.manager.timer.now();
  }

  public end(time: TimeInput): void {
    this.data.endTime = getMillisecondsTime(time) || this.manager.timer.now();
  }
}
