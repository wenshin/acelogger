import { api } from '.';

test('SimpleLogger::startSpan', () => {
  const logger1 = api.logger.startSpan('test.span1');
  const logger2 = logger1.startSpan('test.span2');
  expect(logger2.startSpan).toBeTruthy();
});
