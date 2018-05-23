const Log = require('../index')
const chalk = require('chalk')

const delay = function () {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve()
    }, 2000)
  })
}

const config = {
  verbose: false,
  onPanic: function (state) {
    console.log('Exiting')
    process.exit()
  },
  render: function (state, message) {
    let preface = ''

    if (state.hasCompletedInitialBuild) {
      preface += `\n\nServer running on ${chalk.green.bold('localhost:1313')}\n`
    }
    if (state.showLatestVersionAlert) {
      preface += `\nThere is an update available: Use ${chalk.green.bold('npm i -g example-cli')} to update\n`
    }

    return `
    ${preface}
    ${message}
    `
  }
}

const initialState = {
  hasCompletedInitialBuild: false,
  showLatestVersionAlert: false
}

const log = new Log(config, initialState)

async function demo () {
  await delay()
  log.info('Starting up server')
  await delay()
  log.setState({
    hasCompletedInitialBuild: true
  })
  log.info('Transforming asset files')
  await delay()
  log.wait('Building files in templates')
  await delay()
  log.wait('Deploying files to server')
  await delay()
  log.error('Failed to send notification')
  await delay()
  log.success('Deployed files to server')
  await delay()
  log.setState({
    hasCompletedInitialBuild: false,
    showLatestVersionAlert: true
  })
  await delay()
  log.error('Exiting server')
  console.log('\n')
}

demo()
