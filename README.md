# Acelogger

Acelogger is a light and powerful logger with tracing and metrics logging. It is inspired by opentelemetry-js api.

# Design

## Why make a new one?

opentelemetry, opentracing and other libraries, are hard to understand and use.

1. too many concepts. TracerProvider, Tracer, SpanProcessor, Span, Logger, Event, Metric, MetricProvider etc.
2. large code size

   1. @opentelemetry/tracing Minimized 39.9kb
   2. @opentelemetry/api Minimized 13.8kb
   3. @opentelemetry/web Minimized 46.1kb
   4. acelogger minimized 22kb

3. bad design

   1. circulation dependencies
   2. do not support tree shaking

## Core Concepts

The logging, tracing and metrics will generate events which logged by logger,
event have different alert level and event type.

1. tracer is just the factory class for span.
2. logger use tracer to create span and span context.
3. logger create, record, export events.
4. define exporte with alert level, includes: debug, info, warn, error
5. exporter will sample the events
6. event type includes:
   1. log event, for message logging
   2. store, count and timing events, for metric reporting
   3. span start and span end events, for tracing

# Usage

## Install

```
$ npm install --save acelogger
```

## Example

```typescript
import ace, {
  ConsoleExporterWeb,
  AlertLevel,
  CanonicalCode,
  isMetricEvent
} from 'acelogger';

api.tracer.setAttributes({
  os: 'MacOS',
  osVersion: '13.0'
});

class MetricExporterWeb implements LoggerEventExporter {
  export(evts: LoggerEvent[]) {
    const metricEvents = evts.filter(isMetricEvent);
    console.log(metricEvents);
  }
}

// set event exporter, for mesage logging
api.logger.setExporter(AlertLevel.Debug, new ConsoleExporterWeb());
// set event exporter, for metric reportings
api.logger.setExporter(AlertLevel.Debug, new MetricExporterWeb());
// export events immediately
api.logger.setBufferSize(0);

// log info level message
api.logger.info('test info');
api.logger.store({
  data: {
    memoryUsage: 0.1,
    cpuUsage: 0.5
  }
});
api.logger.count('button_click');
api.logger.timming('fetch', 500, {
  attributes: {
    url: 'https://demo.com'
  }
});

// creat a span logger
const spanLogger = api.logger.startSpan('first.span', {
  parent: api.tracer.createSpanContext()
});

spanLogger.endSpan({
  status: CanonicalCode.OK
});
```

## API

### LoggerEvent

- logging message: debug, info, warn, error
- logging tracing: startSpan, endSpan
- logging metrics: store, count, timing
- custom exporter: setExporter
- custom sampler: setSampler
- custom buffer size: setBufferSize

[See Details](./src/api)

# ChangeLog

## 2020-08-10 0.0.3

- new singleton api

## 2020-08-02 0.0.2

- fix opentelemetry-api do not support tree shaking problem

## 2020-08-02 0.0.1

- first version with logger and tracer
