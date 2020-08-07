import ace, {
  Manager,
  SimpleTracer,
  SimpleLogger,
  AlertLevel,
  ConsoleExporterWeb
} from '../src';
const manager = new Manager();

manager.setLogger(new SimpleLogger());
manager.setTracer(new SimpleTracer());
manager.logger.setAttributes({
  app: ace.logger.getAttributes().app,
  appVersion: ace.logger.getAttributes().appVersion,
  name: 'my-module'
});

// init logger exporter
manager.logger.setExporter(AlertLevel.Debug, new ConsoleExporterWeb());
manager.logger.setBufferSize(0);

export { manager as myModuleAce };
