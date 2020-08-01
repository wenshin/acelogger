import { api, Tracer } from '.';

test('Tracer::new only name', () => {
  const tracer = new Tracer({
    name: 'test',
    version: '0.0.1'
  });
  expect(api.timer.now() - tracer.startTime).toBeLessThan(5);
  expect(tracer.version).toBe('0.0.1');
  expect(tracer.name).toBe('test');
  expect(tracer.startTime).toBeTruthy();
});

test('Tracer::new with startTime of milliseconds', () => {
  const startTime = api.timer.now() - 1000;
  const tracer = new Tracer({
    name: 'test',
    startTime
  });
  expect(tracer.startTime).toBe(startTime);
  expect(tracer.version).toBe(undefined);
  expect(tracer.name).toBe('test');
});

test('Tracer::new with startTime of HrTime', () => {
  const ms = api.timer.now() - 1000;
  const startTime: [number, number] = [ms / 1e3, 0];
  const tracer = new Tracer({
    name: 'test',
    startTime
  });
  expect(tracer.startTime).toBe(ms);
});

test('Tracer::setAttributes', () => {
  const tracer = new Tracer({
    name: 'test'
  });
  tracer.setAttributes({
    tag: 'tag'
  });
  tracer.setAttributes({
    tag1: 'tag1'
  });
  expect(tracer.attributes).toEqual({
    tag: 'tag',
    tag1: 'tag1'
  });
});

// test('Tracer::createSpanContext create with parent span context', () => {
// });

// test('Tracer::createSpanContext create without parent span context', () => {
// });

// test('Tracer::startSpan create with parent span context', () => {
// });
