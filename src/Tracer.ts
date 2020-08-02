import api, {
  Tracer,
  TracerStruct,
  SpanStruct,
  SpanOptions,
  SpanContext,
  TimeInput,
  TraceFlags,
  Attributes,
  SpanKind
} from './api';
import { getMillisecondsTime } from './utils';

interface SimpleTracerConfig {
  name: string;
  version?: string;
  startTime?: TimeInput;
  attributes?: Attributes;
}

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
  public name: string;
  public version?: string;
  public module?: string;
  public moduleVersion?: string;
  public startTime?: number;
  public attributes?: Attributes;

  constructor(config: SimpleTracerConfig) {
    this.name = config.name;
    this.version = config.version;
    this.module = 'acelogger';
    this.moduleVersion = '0.0.2';
    this.attributes = config.attributes || {};
    this.startTime = getMillisecondsTime(config.startTime) || api.timer.now();
  }

  public toJSON(): TracerStruct {
    return {
      attributes: this.attributes,
      module: this.module,
      moduleVersion: this.moduleVersion,
      name: this.name,
      startTime: this.startTime,
      version: this.version
    };
  }

  public setAttributes(attrs: Attributes): void {
    Object.assign(this.attributes, attrs);
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

  public createSpan(name: string, options?: SpanOptions): SpanStruct {
    const opt = options || {};
    return {
      attributes: opt.attributes,
      context: this.createSpanContext(opt.parent),
      endTime: 0,
      kind: opt.kind || SpanKind.INTERNAL,
      name,
      parentContext: opt.parent,
      startTime: getMillisecondsTime(opt.startTime) || api.timer.now()
    };
  }
}
