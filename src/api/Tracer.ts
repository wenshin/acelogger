import { SpanOptions as TSpanOptions } from '@opentelemetry/api/build/src/trace/SpanOptions';
import { SpanContext, SpanKind, Attributes } from './opentelemetry';

export interface SpanStruct {
  name: string;
  kind: SpanKind;
  context: SpanContext;
  startTime: number; // Milliseconds
  endTime?: number; // Milliseconds
  // the tags for the span, used for logger
  attributes?: Attributes;
  parentContext?: SpanContext;
}

export interface TracerStruct {
  name: string;
  version: string;
  module: string;
  moduleVersion: string;
  startTime: number; // Milliseconds
  attributes?: Attributes;
}

export type SpanOptions = TSpanOptions & {
  parent?: SpanContext | null;
};

export interface Tracer {
  toJSON(): TracerStruct;
  setAttributes(attrs: Attributes): void;
  createSpanContext(...args: any[]): SpanContext;
  createSpan(name: string, options?: SpanOptions): SpanStruct;
}
