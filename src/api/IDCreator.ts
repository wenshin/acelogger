export interface IDCreator {
  readonly defaultTraceId: string;
  readonly defaultSpanId: string;
  createTraceId(): string;
  createSpanId(traceId: string, parentSpanId: string): string;
}
