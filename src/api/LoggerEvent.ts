import {
  CanonicalCode,
  Attributes,
  TimeInput,
  SpanKind,
  TraceFlags
} from './opentelemetry';
import { LogLevel, EventType } from './consts';

export interface LoggerAttributes extends Attributes {
  // logger name
  logger: string;
  // logger lib name and version, like acelogger@0.0.2
  lib: string;
  // tracer attributes
  spanName: string;
  spanKind: SpanKind;
}

export interface LoggerEvent {
  // event name
  name: string;
  type: EventType;
  level: LogLevel;
  traceFlags: TraceFlags;
  /**
   * set simpling ratio to the event
   */
  simplingRatio?: number;
  // metric data
  metrics?: {
    [key: string]: string | number;
  };
  // tags for event, always used to filter the event
  attributes: LoggerAttributes;
  //  any object data
  data: {
    spanId: string;
    traceId: string;
    [key: string]: any;
  };
  // error status code
  status: CanonicalCode;
  // error message for event
  message: string;
  // error stack, only exist when level is EventLevel.Error
  stack?: string;
  // event trigger times
  time: TimeInput;
}
