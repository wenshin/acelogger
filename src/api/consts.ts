export enum EventType {
  Log = 'log',
  Store = 'store',
  Count = 'count',
  Timing = 'timing',
  Start = 'start',
  End = 'end'
}

export enum AlertLevel {
  // some code debug informations
  Debug,
  // user events
  Info,
  // app have may have error
  Warn,
  // app have error and not crashed
  Error,
  // app crashed
  Fatal
}
