import { CanonicalCode, Attributes, TimeInput, SpanKind } from '@opentelemetry/api';
import { AlertLevel, EventType } from './consts';

export { CanonicalCode, SpanKind, TimeInput, Attributes };

export interface LoggerEvent {
  name?: string;
  type?: EventType;
  level?: AlertLevel;
  status?: CanonicalCode;
  // tags for event, always used to filter the event
  attributes?: Attributes & {
    spanId: string;
    traceId: string;
    spanName: string;
    tracerName: string;
    spanKind?: SpanKind;
    tracerVersion?: string;
    tracerModule?: string;
    tracerModuleVersion?: string;
  };
  //  any data for log
  data?: any;
  // error message for event
  message?: string;
  // error object for event
  error?: Error;
  time?: TimeInput;
}

export interface LoggerCountEvent extends LoggerEvent {
  data?: number;
}

export interface LoggerTimmingEvent extends LoggerEvent {
  data?: number;
}

export interface LoggerStoreEvent extends LoggerEvent {
  data?: {
    [key: string]: number;
  };
}

