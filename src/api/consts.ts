export enum EventType {
  // normal event
  Event = 'event',
  Log = 'log',
  Metric = 'metric',
  Tracing = 'tracing',
}

export enum LogLevel {
  // some code debug informations
  Debug,
  // the informations for users
  Info,
  // app may have error
  Warn,
  // app have error and not crashed
  Error,
  // app crashed
  Fatal,
}
