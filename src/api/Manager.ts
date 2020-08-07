import { Tracer } from './Tracer';
import { Logger } from './Logger';
import { Timer } from './Timer';

const defaultTimer = {
  now: () => Date.now()
};

export class Manager {
  private registries = new Map<string, any>();

  public setLogger(logger: Logger | null): void {
    this.registries.set('logger', logger);
    if (logger) {
      logger.manager = this;
    }
  }

  get logger(): Logger {
    return this.registries.get('logger');
  }

  public setTracer(tracer: Tracer | null): void {
    this.registries.set('tracer', tracer);
    if (tracer) {
      tracer.manager = this;
    }
  }

  get tracer(): Tracer {
    return this.registries.get('tracer');
  }

  public setTimer(timer: Timer | null): void {
    this.registries.set('timer', timer);
  }

  get timer(): Timer {
    return this.registries.get('timer') || defaultTimer;
  }
}
