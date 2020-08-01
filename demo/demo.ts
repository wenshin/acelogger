import {
  api,
  Tracer,
  ConsoleExporterWeb,
  AlertLevel,
  CanonicalCode
} from '../src';

api.setTracer(
  new Tracer({
    name: 'demo.app',
    version: '0.0.1'
  })
);

api.tracer.now = (): number => {
  return performance.timeOrigin + performance.now();
};

// init logger exporter
api.logger.setExporter(AlertLevel.Debug, new ConsoleExporterWeb());
api.logger.setBufferSize(0);

api.logger.debug('test debug');
api.logger.info('test info');
api.logger.warn('test warn');
api.logger.error(new Error('test error'));

const spanLogger = api.logger.startSpan('first.span', {
  parent: api.tracer.createSpanContext()
});

setTimeout(() => {
  spanLogger.debug('test span debug');
  spanLogger.info('test span info');
  spanLogger.warn('test span warn');
  spanLogger.error(new Error('test span error'));
  spanLogger.endSpan();
}, 2000);

// create sub span
const span1 = spanLogger.startSpan('first_child.span');

setTimeout(() => {
  span1.debug('test span debug');
  span1.info('test span info');
  span1.warn('test span warn');
  span1.error(new Error('test span error'));
  span1.endSpan({
    status: CanonicalCode.UNKNOWN
  });
}, 4000);
