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

const spanCountMap = {
  $rootSpan: 0,
};

function createSpanId(traceId: string, parentSpanId?: string): string {
  let count: number;
  // no parent span
  if (!parentSpanId) {
    count = spanCountMap.$rootSpan = spanCountMap.$rootSpan + 1;
  } else {
    if (!spanCountMap[parentSpanId]) {
      count = spanCountMap[parentSpanId] = 1;
    } else {
      count = spanCountMap[parentSpanId] = spanCountMap[parentSpanId] + 1;
    }
  }
  return parentSpanId ? `${parentSpanId}.${count}` : `${traceId}-${count}`;
}

export function createTraceId(): string {
  return (
    Math.random().toString(32).substring(2, 8) +
    Math.random().toString(32).substring(2, 8)
  );
}

export const DEFAULT_TRACE_ID = createTraceId();
export const DEFAULT_SPAN_ID = `${DEFAULT_TRACE_ID}-0`;

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
    const traceId = c.traceId || DEFAULT_TRACE_ID;
    return {
      isRemote: c.isRemote,
      spanId: createSpanId(traceId, c.spanId),
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
