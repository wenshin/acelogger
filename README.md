# Acelogger

Acelogger is a light and powerful logger with tracing and metrics logging. It is inspired by opentelemetry-js api.

# Design

## Why make a new one?
opentelemetry, opentracing and other libraries, are hard to understand and use.

## Core Concept
The logging, tracing and metrics are all just the events logged by logger, which with different alert level and event type.

1. tracer is just the factory class for span
2. span is just struct without methods
3. logger use tracer to create span and span context
4. logger create events, to record
   1. any messagge
   2. any metrics
   3. count span, timing span, logging span
5. alert level includes: debug, info, warn, error
6. event type includes: log, store, count, timing, span start, span end

# Usage

## Install

```
$ npm install --save acelogger
```

## Example
```typescript
import {
  api, Tracer, ConsoleExporterWeb,
  AlertLevel, CanonicalCode
} from 'acelogger';

api.setTracer(new Tracer({
  name: 'demo.app',
  version: '0.0.1'
}))
api.tracer.setAttributes({
  os: 'MacOS',
  osVersion: '13.0',
})

// init logger exporter
api.logger.setExporter(AlertLevel.Debug, new ConsoleExporterWeb());
// export events immediately
api.logger.setBufferSize(0);

// log info level message
api.logger.info('test info')
api.logger.store({
  data: {
    memoryUsage: 0.1,
    cpuUsage: 0.5,
  }
})
api.logger.count('button_click')
api.logger.timming('fetch', 500, {
  attributes: {
    url: 'https://demo.com'
  }
})

// creat a span logger
const spanLogger = api.logger.startSpan('first.span', {
  parent: api.tracer.createSpanContext()
})

spanLogger.endSpan({
  status: CanonicalCode.OK
})
```

## API
* logging message: debug, info, warn, error
* logging tracing: startSpan, endSpan
* logging metrics: store, count, timing
* custom exporter: setExporter
* custom sampler: setSampler
* custom buffer size: setBufferSize

[See Details](./src/api)

# ChangeLog
