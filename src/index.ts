import api from './api';
import Tracer from './Tracer';
import Logger from './Logger';
import ConsoleExporterWeb from './exporters/ConsoleExporterWeb';
import ConsoleExporterNode from './exporters/ConsoleExporterNode';

export * from './api';
export * from './consts';

api.setLogger(new Logger());

export {
  ConsoleExporterWeb,
  ConsoleExporterNode,
  Logger,
  Tracer,
  api,
}
