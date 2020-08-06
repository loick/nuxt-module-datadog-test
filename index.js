const path = require('path')

const tracer = require('dd-trace')

// Inspired by https://github.com/aaronransley/nuxt-datadog-trace/blob/master/index.js
module.exports = function DatadogTrace(moduleOptions) {
  this.nuxt.hook('render:before', () => {
    const hostAppPkg = require(path.resolve(this.options.rootDir, 'package.json'))

    tracer.init({
      hostname: process.env.DD_TRACE_AGENT_HOSTNAME,
      port: process.env.DD_TRACE_AGENT_PORT,
      logInjection: true,
      runtimeMetrics: true,
      service: hostAppPkg.name,
      ...moduleOptions,
      ...this.options.datadogTrace
    })

    // Remove the healthcheck from the datadog logs
    tracer.use('http', {
      service: process.env.DD_SERVICE_NAME,
      blacklist: [/\/healthcheck.*/],
    })
  })
}
