import {
  Tracer,
  TracerStruct,
  SpanOptions,
  SpanContext,
  TimeInput,
  TraceFlags,
  SpanKind,
  Manager,
  SpanStruct,
} from './api';
import { getMillisecondsTime } from './utils';

type SpanContextConfig = {
  traceId?: string;
  spanId?: string;
  traceFlags?: TraceFlags;
} & SpanContext;

export default class SimpleTracer implements Tracer {
  public manager: Manager;
  private data: TracerStruct = {
    startTime: Date.now(),
  };

  public toJSON(): TracerStruct {
    return this.data;
  }

  public createSpanContext(ctx?: SpanContextConfig): SpanContext {
    const c = Object.assign({}, ctx);
    const traceId = c.traceId || this.manager.idCreator.defaultTraceId;
    return {
      isRemote: c.isRemote,
      spanId: this.manager.idCreator.createSpanId(traceId, c.spanId),
      traceFlags: c.traceFlags || TraceFlags.NONE,
      traceId,
      traceState: c.traceState,
    };
  }

  public createSpan(name: string, options?: SpanOptions): SpanStruct {
    const opt = options || {};
    const now = this.manager.timer.now();
    const userStartTime = getMillisecondsTime(opt.startTime) || now;
    return {
      attributes: opt.attributes,
      context: this.createSpanContext(opt.parent),
      endTime: 0,
      kind: opt.kind || SpanKind.INTERNAL,
      name,
      parentContext: opt.parent,
      startTime: now,
      userStartTime,
    };
  }

  public start(time: TimeInput): void {
    this.data.startTime = getMillisecondsTime(time) || this.manager.timer.now();
  }

  public end(time: TimeInput): void {
    this.data.endTime = getMillisecondsTime(time) || this.manager.timer.now();
  }
}
