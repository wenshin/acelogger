import {
  CanonicalCode,
  Attributes,
  TimeInput,
  SpanKind
} from './opentelemetry';
import { AlertLevel, EventType } from './consts';
import { TraceFlags } from '@opentelemetry/api/build/src/trace/trace_flags';

export interface LoggerAttributes extends Attributes {
  app?: string;
  appVersion?: string;
  // logger lib name and version, like acelogger@0.0.2
  lib?: string;
  // logger name, may be module name, default is app name
  name?: string;
  // logger version, may be module name, default is app version
  version?: string;

  // tracer attributes
  spanId?: string;
  spanName?: string;
  spanKind?: SpanKind;
  traceId?: string;
  // tracer lib name and version, ex. mytracer@0.0.2
  tracerLib?: string;
}

export interface LoggerEvent {
  // event name
  name?: string;
  type?: EventType;
  level?: AlertLevel;
  traceFlags?: TraceFlags;
  // tags for event, always used to filter the event
  attributes?: LoggerAttributes;
  // metric data
  metrics?: {
    [key: string]: string | number;
  };
  //  any object data
  data?: {
    [key: string]: any;
  };
  // error status code
  status?: CanonicalCode;
  // error message for event
  message?: string;
  // error stack, only exist when level is EventLevel.Error
  stack?: string;
  // event trigger times
  time?: TimeInput;
}

export interface LoggerCountEvent extends LoggerEvent {
  data?: {
    count: number;
  };
}

export interface LoggerTimmingEvent extends LoggerEvent {
  data?: {
    duration: number;
  };
}
