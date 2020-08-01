import api from './api';
import Tracer from './Tracer';
import Logger from './Logger';
import ConsoleExporterWeb from './exporters/ConsoleExporterWeb';
import ConsoleExporterNode from './exporters/ConsoleExporterNode';

export * from './api';
export * from './consts';
export * from './utils';

api.setLogger(new Logger());

api.setTimer({
  now(): number {
    return Date.now();
  }
});

export { ConsoleExporterWeb, ConsoleExporterNode, Logger, Tracer, api };
