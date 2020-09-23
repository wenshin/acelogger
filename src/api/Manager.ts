import { Tracer } from './Tracer';
import { Logger } from './Logger';
import { Timer } from './Timer';

export interface Manager {
  readonly logger: Logger;
  readonly tracer: Tracer;
  readonly timer: Timer;
  setLogger(logger: Logger | null): void;
  setTracer(tracer: Tracer | null): void;
  setTimer(timer: Timer | null): void;
}
