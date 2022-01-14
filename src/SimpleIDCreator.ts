import { IDCreator } from './api';

const spanCountMap = {
  $rootSpan: 0,
};

export function createTraceId() {
  return (
    Math.random().toString(32).substring(2, 8) +
    Math.random().toString(32).substring(2, 8)
  );
}

const DEFAULT_TRACE_ID = createTraceId();
const DEFAULT_SPAN_ID = `${DEFAULT_TRACE_ID}-0`;

export const simpleIdCreator: IDCreator = {
  get defaultTraceId() {
    return DEFAULT_TRACE_ID;
  },
  get defaultSpanId() {
    return DEFAULT_SPAN_ID;
  },
  createSpanId(traceId, parentSpanId) {
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
  },
  createTraceId() {
    return createTraceId();
  },
};
