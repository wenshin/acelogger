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
