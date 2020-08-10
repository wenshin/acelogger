import {
  CanonicalCode,
  Attributes,
  TimeInput,
  SpanKind
} from './opentelemetry';
import { AlertLevel, EventType } from './consts';

export interface EventAttributes extends Attributes {
  // the app name, example lark, doc
  app: string;
  // the app version
  appVersion?: string;
  // logger name
  loggerName?: string;
  // logger version
  loggerVersion?: string;
  // logger lib name and version, like acelogger@0.0.2
  loggerLib?: string;
  spanId: string;
  spanName: string;
  spanKind?: SpanKind;
  traceId: string;
  // tracer lib name and version, ex. mytracer@0.0.2
  tracerLib?: string;
}

export interface LoggerEvent {
  // event name
  name?: string;
  type?: EventType;
  level?: AlertLevel;
  status?: CanonicalCode;
  // tags for event, always used to filter the event
  attributes?: EventAttributes;
  //  any data for log
  data?: any;
  // error message for event
  message?: string;
  // error stack, only exist when level is EventLevel.Error
  stack?: string;
  // event trigger times
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
