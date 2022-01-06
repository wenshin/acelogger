import ace, { SimpleTracer } from '.';

test('SimpleTracer::new', () => {
  const tracer = new SimpleTracer();
  const tracerData = tracer.toJSON();
  expect(ace.timer.now() - tracerData.startTime).toBeLessThan(5);
  expect(tracerData.startTime).toBeTruthy();
  expect(tracerData.endTime).toBeFalsy();

  // resign start time
  const newStartTime = ace.timer.now();
  tracer.start(newStartTime);
  expect(tracerData.startTime).toBe(newStartTime);

  // end tracer
  tracer.end(newStartTime);
  expect(tracerData.endTime).toBe(newStartTime);
});

test('SimpleTracer::end with HrTime', () => {
  const ms = ace.timer.now() - 1000;
  const time: [number, number] = [ms / 1e3, 0];
  const tracer = new SimpleTracer();
  tracer.end(time);
  expect(tracer.toJSON().endTime).toBe(ms);
});

// test('Tracer::createSpanContext create with parent span context', () => {
// });

// test('Tracer::createSpanContext create without parent span context', () => {
// });

// test('Tracer::startSpan create with parent span context', () => {
// });
