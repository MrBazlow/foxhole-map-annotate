import createError from 'http-errors'
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import grant from 'grant'
import nunjucks from 'nunjucks'
import compression from 'compression'

import sessionParser from './lib/session.js'
import indexRouter from './routes/index.js'
import { ACL_ADMIN, ACL_BLOCKED } from './lib/ACLS.js'
import { getConfig } from './lib/config.js'
import warapi from './lib/warapi.js'
import fs from 'fs/promises'

async function startServer () {
  const rootDir = process.cwd()
  const isDevMode = process.env.NODE_ENV === 'development'
  const app = express()
  const config = await getConfig()
  const manifest = await fs.readFile(path.join(rootDir, 'dist/manifest.json'))
    .then((value) => { return JSON.parse(value) })

  nunjucks.configure('views', {
    autoescape: true,
    express: app,
    noCache: isDevMode
  })

  app.set('view engine', 'html')

  if (isDevMode) {
    const vite = await import('vite')
    const viteDevMiddleware = (
      await vite.createServer({
        rootDir,
        server: { middlewareMode: true },
        appType: 'custom'
      })
    ).middlewares
    app.use(viteDevMiddleware)
  } else {
    const sirv = (await import('sirv')).default
    app.use(sirv(path.join(rootDir, 'dist'), {
      maxAge: 7_200_000,
      immutable: true
    }))
    app.set('trust proxy', 2) // trust first two proxies (nginx, cloudflare)
  }
  app.use(compression())
  app.use(express.static(path.resolve('./dist'), { maxAge: 7_200_000 }))
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(cookieParser())
  app.use(sessionParser)
  app.use(grant.express({
    defaults: {
      origin: config.basic.url,
      transport: 'session',
      state: true
    },
    discord: {
      key: config.discord.key,
      secret: config.discord.secret,
      scope: ['identify', 'guilds.members.read'],
      callback: '/login'
    }
  }))
  app.use((req, res, next) => {
    if (isDevMode) {
      req.session.user = 'develop'
      req.session.userId = '1234567895'
      req.session.discordId = '1234567895'
      req.session.acl = ACL_ADMIN
    }
    res.locals.manifest = manifest
    res.locals.isDevMode = isDevMode
    res.locals.config = config
    res.locals.title = config.basic.title
    res.locals.path = req.path
    res.locals.cacheBuster = process.env.COMMIT_HASH
    res.locals.shard = warapi.warData.shard
    res.locals.war = warapi.warData.warNumber
    res.locals.warStatus = warapi.warData.status
    res.locals.warWinner = warapi.getTeam(warapi.warData.winner)
    res.locals.warConquestEndTime = warapi.warData.conquestEndTime || ''
    if (req.session && (req.session.user || req.path === '/login')) {
      res.locals.user = req.session.user
      res.locals.userId = req.session.userId
      res.locals.acl = req.session.acl

      // quick check if somebody is blocked
      if (req.session.userId in config.access.users && config.access.users[req.session.userId] === ACL_BLOCKED) {
        req.session.destroy(() => {
          res.clearCookie('connect.sid')
          res.redirect('/')
        })
      } else {
        next()
      }
    } else {
      res.locals.hiddenCode = req.query.hiddenCode || false
      res.locals.user = false
      res.status(req.path === '/' ? 200 : 403)
      res.render('login')
    }
  })
  app.use('/', indexRouter)

  // catch 404 and forward to error handler
  app.use((_req, _res, next) => {
    next(createError(404))
  })

  // error handler
  app.use((err, _req, res, _next) => {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = isDevMode ? err : {}

    // render the error page
    res.status(err.status ?? 500)
    res.render('error')
  })

  return app
}

export default startServer
