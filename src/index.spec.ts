import { api, Tracer } from '.';

beforeAll(() => {
  api.setTracer(
    new Tracer({
      name: 'test.app',
      version: '0.0.1'
    })
  );
});

afterAll(() => {
  api.setTracer(null);
});

test('index: export default', () => {
  expect(api.logger.startSpan).toBeTruthy();
  expect(api.tracer.createSpan).toBeTruthy();
});
