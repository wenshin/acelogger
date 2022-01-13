import {
  CanonicalCode,
  Attributes,
  TimeInput,
  TraceFlags,
} from './opentelemetry';
import { LogLevel, EventType } from './consts';

/**
 * inspired by sentry data
 */
export interface ErrorStackFrame {
  lineno: number;
  colno: number;
  filename: string;
  function: string;
  in_app?: boolean;
}

export interface LoggerEvent {
  // event name
  name: string;
  type: EventType;
  level: LogLevel;
  traceFlags: TraceFlags;
  traceId: string;
  spanId: string;
  /**
   * set sampling rate to the event
   */
  samplingRate?: number;
  // metric data
  metrics?: {
    [key: string]: string | number;
  };
  // tags for event, always used to filter the event
  attributes: Attributes;
  //  any object data
  data: {
    /**
     * span start event will carry the userStartTime
     */
    userStartTime?: TimeInput;
    [key: string]: unknown;
  };
  // error status code
  status: CanonicalCode;
  // error message for event
  message: string;
  // error stack, only exist when level is EventLevel.Error
  stack?: ErrorStackFrame[];
  // event trigger times
  time: TimeInput;
}
