import ace from '.';

test('index: export default', () => {
  expect(ace.logger.startSpan).toBeTruthy();
  expect(ace.tracer.createSpan).toBeTruthy();
});
