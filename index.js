const diffy = require('diffy')
const trim = require('diffy/trim')
const chalk = require('chalk')

const pad = (text) => (` ${text} `)

class Logger {
  constructor (config, state) {
    console.log('')
    this.config = config
    this.state = state
    this.view = diffy()
  }

  render () {
    this.view.render(() => trim(this.config.render(this.state, this.message)))
  }

  setState (state) {
    this.state = Object.assign(this.state, state)
    this.render()
  }

  log (message, prefix) {
    this.message = trim(`${prefix} ${message}`)
    this.render()
  }

  info (message, options = { prefix: 'INFO' }) {
    let styledPrefix = chalk.bgKeyword('gray').black(pad(options.prefix))
    this.log(message, styledPrefix)
    return this
  }
  wait (message, options = { prefix: 'WAIT' }) {
    let styledPrefix = chalk.bgKeyword('orange').black(pad(options.prefix))
    this.log(message, styledPrefix)
    return this
  }
  success (message, options = { prefix: 'DONE' }) {
    let styledPrefix = chalk.bgGreenBright.black(pad(options.prefix))
    this.log(message, styledPrefix)
    return this
  }
  error (message, options = { prefix: 'ERROR' }) {
    let styledPrefix = chalk.bgRedBright.white(pad(options.prefix))
    this.log(message, styledPrefix)
    return this
  }

  panic (message, options = { prefix: 'ERROR' }) {
    this.error(message, { prefix: options.prefix })
    return this.config.onPanic(this.state)
  }
}

class VerboseLogger {
  constructor (config, state) {
    this.config = config
    this.state = state
  }
  setState (state) {
    this.state = Object.assign(this.state, state)
  }

  getTimeStamp () {
    return (new Date()).toTimeString()
  }

  log (message) {
    let timeStamp = `[${chalk.grey(this.getTimeStamp())}]`
    console.log(`${timeStamp} ${message}`)
  }
  info (message) {
    this.log(message)
    return this
  }
  wait (message) {
    this.log(message)
    return this
  }
  success (message) {
    this.log(message)
    return this
  }
  error (message) {
    this.log(message)
    return this
  }
  panic (message) {
    this.log(message)
    return this.config.onPanic(this.state)
  }
}

module.exports = function (config, initialState) {
  if (config.verbose) {
    return new VerboseLogger(config, initialState)
  } else {
    return new Logger(config, initialState)
  }
}
