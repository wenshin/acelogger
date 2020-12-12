import './init';
import ace, { CanonicalCode } from '../src';
import { myModuleAce } from './my-module';

ace.logger.debug('test debug');
ace.logger.info('test info');
ace.logger.warn('test warn');
ace.logger.error(new Error('test error'));

const spanLogger = ace.logger.startSpan('first.span', {
  parent: ace.tracer.createSpanContext()
});

setTimeout(() => {
  spanLogger.setAttributes({
    path: '/path/to/span'
  });
  spanLogger.debug('test span debug');
  spanLogger.info('test span info');
  spanLogger.warn('test span warn');
  spanLogger.error(new Error('test span error'));
  spanLogger.endSpan();
  spanLogger.flush();
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
  span1.flush();
}, 4000);

// module logging
myModuleAce.logger.debug('test module debug');
myModuleAce.logger.info('test module info');
myModuleAce.logger.warn('test module warn');
myModuleAce.logger.error(new Error('test module error'));
myModuleAce.flush();
