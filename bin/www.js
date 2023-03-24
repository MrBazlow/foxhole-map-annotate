#!/usr/bin/env node

/**
 * Module dependencies.
 */
import * as dotenv from 'dotenv'
import startServer from '../app.js'
import debug from 'debug'
import http from 'http'
import socket from '../websocket.js'
import gradient from 'gradient-string'
import pc from 'picocolors'

dotenv.config()

debug(`${process.env.npm_package_name}:server`)

const blueGradient = gradient([
  '#245682',
  '#97c1e2',
  '#3b85bc',
  '#97c1e2',
  '#245682'
])

const title = ` _       __               __              ______                              
| |     / /___ __________/ /__  ____     / ____/  ______  ________  __________
| | /| / / __ \`/ ___/ __  / _ \\/ __ \\   / __/ | |/_/ __ \\/ ___/ _ \\/ ___/ ___/
| |/ |/ / /_/ / /  / /_/ /  __/ / / /  / /____>  </ /_/ / /  /  __(__  |__  ) 
|__/|__/\\__,_/_/   \\__,_/\\___/_/ /_/  /_____/_/|_/ .___/_/   \\___/____/____/  
                                                /_/                           `

console.clear()
console.log(blueGradient.multiline(title))

const versionString = `  Name: ${process.env.npm_package_name}  Version: ${process.env.npm_package_version}`
console.log(versionString)

const startTime = Math.ceil(performance.now())
const mode = process.env.NODE_ENV === 'production' ? `${pc.green('Production')}` : `${pc.yellow('Development')}`
let isGood = true
let caughtError

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT ?? '3000')

const app = await startServer()

try {
  app.set('port', port)

  /**
   * Create HTTP server.
   */

  const server = http.createServer(app)

  /**
   * Listen on provided port, on all network interfaces.
   */

  server.listen(port)
  server.on('error', onError)
  server.on('listening', () => onListening(server))

  /**
   * Websocket
   */

  socket(server)
} catch (error) {
  isGood = false
  caughtError = error
} finally {
  const startDuration = startTime ? `${Math.ceil(performance.now()) - startTime} ms` : ''
  const loadString = `${pc.dim(`Loaded in ${startDuration}`)}`
  const statusString = isGood ? `${pc.bold(pc.green('READY'))}` : `${pc.bold(pc.red('ERROR'))}`
  const readyString = `  Status: ${statusString}  Mode: ${mode}  ${isGood ? loadString : ''}`
  console.clear()
  console.log(blueGradient.multiline(title))
  console.log(versionString)
  console.log(readyString)
  if (isGood) {
    const listenString = `  Listening on: ${pc.blue(`http://localhost:${process.env.PORT}`)}`
    console.log(listenString)
  } else {
    const code = caughtError?.code ? pc.bold(`\n  Name: ${caughtError?.code}`) : undefined
    console.error(`${pc.red(`${code ?? ''}\n  ${caughtError?.stack}`)}`)
  }
}

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort (val) {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError (error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`)
      return process.exit(1)
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`)
      return process.exit(1)
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening (server) {
  const addr = server.address()
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`
  debug(`Listening on ${bind}`)
}
