import { Manager } from './api';
import SimpleLogger from './SimpleLogger';
import SimpleTracer from './SimpleTracer';
import ConsoleExporterWeb from './exporters/ConsoleExporterWeb';
import ConsoleExporterNode from './exporters/ConsoleExporterNode';

export * from './api';
export * from './consts';
export * from './utils';

export { ConsoleExporterWeb, ConsoleExporterNode, SimpleLogger, SimpleTracer };

const manager = new Manager();

manager.setLogger(new SimpleLogger());
manager.setTracer(new SimpleTracer());

export default manager;
