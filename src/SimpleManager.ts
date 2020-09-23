import { Manager, Logger, Tracer, Timer } from './api';
import SimpleLogger from './SimpleLogger';
import SimpleTracer from './SimpleTracer';

const defaultTimer = {
  now: () => Date.now()
};

export default class SimpleManager implements Manager {
  private defaultLogger: Logger;
  private defaultTracer: Tracer;
  private registries = new Map<string, any>();

  constructor() {
    this.defaultLogger = new SimpleLogger();
    this.defaultLogger.manager = this;
    this.defaultTracer = new SimpleTracer();
    this.defaultTracer.manager = this;
  }

  public setLogger(logger: Logger | null): void {
    this.registries.set('logger', logger);
    if (logger) {
      logger.manager = this;
    }
  }

  get logger(): Logger {
    return this.registries.get('logger') || this.defaultLogger;
  }

  public setTracer(tracer: Tracer | null): void {
    this.registries.set('tracer', tracer);
    if (tracer) {
      tracer.manager = this;
    }
  }

  get tracer(): Tracer {
    return this.registries.get('tracer') || this.defaultTracer;
  }

  public setTimer(timer: Timer | null): void {
    this.registries.set('timer', timer);
  }

  get timer(): Timer {
    return this.registries.get('timer') || defaultTimer;
  }
}
