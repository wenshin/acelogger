import { SpanOptions as TSpanOptions } from '@opentelemetry/api/build/src/trace/SpanOptions';
import { TimeInput } from '@opentelemetry/api/build/src/common/Time';
import { SpanContext } from './opentelemetry';
import { Span } from './Span';
import { Manager } from './Manager';

export interface TracerStruct {
  // lib name and version. example, acelogger@0.0.2
  lib: string;
  startTime: number; // Milliseconds
  endTime?: number; // Milliseconds
}

export type SpanOptions = TSpanOptions & {
  parent?: SpanContext | null;
};

export interface Tracer {
  manager: Manager;
  toJSON(): TracerStruct;
  createSpanContext(...args: any[]): SpanContext;
  createSpan(name: string, options?: SpanOptions): Span;
  start(time?: TimeInput): void;
  end(time?: TimeInput): void;
}
