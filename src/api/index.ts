import { Tracer } from './Tracer';
import { Logger } from './Logger';

export * from './Tracer';
export * from './Logger';
export * from './LoggerEvent';
export * from './LoggerEventExporter';
export * from './consts';

export class Api {
  private registries = new Map<string, any>()

  public setLogger(logger: Logger): void {
    this.registries.set('logger', logger);
  }

  get logger(): Logger {
    return this.registries.get('logger');
  }

  public setTracer(tracer: Tracer): void {
    this.registries.set('tracer', tracer);
  }

  get tracer(): Tracer {
    return this.registries.get('tracer');
  }
}

export default new Api();
