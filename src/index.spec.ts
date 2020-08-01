import { api } from '.';

test('index: export default', () => {
  expect(api.logger.startSpan).toBeTruthy();
  expect(api.tracer.createSpan).toBeFalsy();
});
