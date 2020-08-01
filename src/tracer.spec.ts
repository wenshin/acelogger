import Tracer from './Tracer';

test('Tracer::new only name', () => {
  const tracer = new Tracer({
    name: 'test',
    version: '0.0.1'
  });
  expect(Date.now() - tracer.startTime).toBeLessThan(5);
  expect(tracer.version).toBe('0.0.1');
  expect(tracer.name).toBe('test');
});

test('Tracer::new with startTime of milliseconds', () => {
  const startTime = Date.now() - 1000
  const tracer = new Tracer({
    name: 'test',
    startTime
  });
  expect(tracer.startTime).toBe(startTime);
  expect(tracer.version).toBe(undefined);
  expect(tracer.name).toBe('test');
});

test('Tracer::new with startTime of HrTime', () => {
  const ms = Date.now() - 1000;
  const startTime: [number, number] = [ms / 1000, 678]
  const tracer = new Tracer({
    name: 'test',
    startTime
  });
  expect(tracer.startTime).toBe(ms + 1);
});

// test('Tracer::setAttributes', () => {
// });


// test('Tracer::createSpanContext create with parent span context', () => {
// });

// test('Tracer::createSpanContext create without parent span context', () => {
// });

// test('Tracer::startSpan create with parent span context', () => {
// });
