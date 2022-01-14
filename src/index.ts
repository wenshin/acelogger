import SimpleLogger from './SimpleLogger';
import SimpleTracer from './SimpleTracer';
import { createTraceId } from './SimpleIDCreator';
import SimpleManager from './SimpleManager';
import ConsoleExporterWeb from './exporters/ConsoleExporterWeb';
import ConsoleExporterNode from './exporters/ConsoleExporterNode';

export * from './api';
export * from './consts';
export * from './utils';

export {
  createTraceId,
  ConsoleExporterWeb,
  ConsoleExporterNode,
  SimpleLogger,
  SimpleTracer,
  SimpleManager,
};

const manager = new SimpleManager();

export default manager;
