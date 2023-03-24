import express from 'express'
import Discord from '../lib/discord.js'
import eventLog from '../lib/eventLog.js'
import { ACL_ADMIN, ACL_MOD } from '../lib/ACLS.js'
import { getConfig, setConfig } from '../lib/config.js'
import * as sanitizeHtml from 'sanitize-html'
import { clearRegionsCache } from '../lib/conquerUpdater.js'

const router = express.Router()

/* GET home page. */
router.get('/', (_req, res, _next) => {
  res.render('index')
})

router.get('/help', (_req, res, _next) => {
  res.render('help')
})

router.get('/admin', async (req, res, _next) => {
  if (!req.session || (req.session.acl !== ACL_ADMIN && req.session.acl !== ACL_MOD)) {
    return res.redirect('/')
  }
  return res.redirect('/admin/eventlog')
})

router.get('/admin/eventlog', async (req, res, _next) => {
  if (!req.session || (req.session.acl !== ACL_ADMIN && req.session.acl !== ACL_MOD)) {
    return res.redirect('/')
  }
  res.locals.events = eventLog.lastLogs
  res.render('admin.eventlog.html')
})

router.get('/admin/config', async (req, res, _next) => {
  if (!req.session || req.session.acl !== ACL_ADMIN) {
    return res.redirect('/')
  }
  res.render('admin.config.html')
})

router.post('/admin/reload', async (req, res, _next) => {
  const config = await getConfig()
  if (!req.session || (req.session.acl !== ACL_ADMIN)) {
    return res.redirect('/')
  }
  eventLog.logEvent({ type: 'forcedMapReload', user: req.session.user, userId: req.session.userId, data: config })
  clearRegionsCache()
  return res.redirect('/admin/config')
})

router.post('/admin/config', async (req, res, _next) => {
  const config = await getConfig()
  if (!req.session || (req.session.acl !== ACL_ADMIN)) {
    return res.redirect('/')
  }
  eventLog.logEvent({ type: 'configChange', user: req.session.user, userId: req.session.userId, data: config.config })
  if (req.body.title.match(/^[\w ]+$/)) {
    config.basic.title = req.body.title
  }
  if (['Warden', 'Colonial'].includes(req.body.faction)) {
    config.basic.faction = req.body.faction
  }
  config.config.basic.links = []
  if (req.body.link) {
    for (const i in req.body.link.href) {
      const linkHref = req.body.link.href[i]
      if (linkHref.length === 0) {
        continue
      }
      if (!linkHref.match(/^https?:\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|]$/)) {
        continue
      }
      const linkText = (req.body.link.title[i] && req.body.link.title[i].length > 0) ? req.body.link.title[i] : 'Link'
      if (!linkText.match(/^[\w ]+$/)) {
        continue
      }
      config.basic.links.push({
        href: linkHref,
        title: linkText
      })
    }
  }
  const sanitizeOptions = {
    allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p'],
    allowedAttributes: {
      a: ['href']
    }
  }
  config.text.login = sanitizeHtml(req.body.textLogin, sanitizeOptions)
  config.text.accessDenied = sanitizeHtml(req.body.textAccessDenied, sanitizeOptions)
  config.text.feedback = sanitizeHtml(req.body.textFeedback, sanitizeOptions)
  config.text.contributors = sanitizeHtml(req.body.textContributors, sanitizeOptions)

  config.access = { users: {}, discords: {} }

  if (req.body.access) {
    const discordIdPattern = /^(\d+)\s*$/
    if (req.body.access.users) {
      for (const i in req.body.access.users.id) {
        const userId = discordIdPattern.exec(req.body.access.users.id[i])?.[1]
        if (!userId) {
          continue
        }
        config.access.users[userId] = {
          name: req.body.access.users.name[i],
          acl: req.body.access.users.acl[i]
        }
      }
    }
    if (req.body.access.discords) {
      for (const i in req.body.access.discords.id) {
        const discordId = discordIdPattern.exec(req.body.access.discords.id[i])?.[1]
        if (!discordId) {
          continue
        }
        config.access.discords[discordId] = {
          name: req.body.access.discords.name[i],
          hiddenCode: req.body.access.discords.hidden[i],
          roles: {}
        }
        if (req.body.access.discords[discordId]) {
          for (const i in req.body.access.discords[discordId].roles.id) {
            const roleId = discordIdPattern.exec(req.body.access.discords[discordId].roles.id[i])?.[1]
            if (!roleId) {
              continue
            }
            config.access.discords[discordId].roles[roleId] = {
              name: req.body.access.discords[discordId].roles.name[i],
              acl: req.body.access.discords[discordId].roles.acl[i]
            }
          }
        }
      }
    }
  }
  setConfig(config)
  return res.redirect('/admin/config')
})

router.get('/login', async (req, res, _next) => {
  if (req.session.grant === undefined) {
    return res.redirect('/')
  }
  if (req.session.grant.error) {
    throw new Error(req.session.grant.error)
  }
  const discord = new Discord(req.session.grant.response.access_token)
  if (req.session.grant.dynamic?.discordServerId) {
    discord.preferredDiscordServer = req.session.grant.dynamic.discordServerId
  }
  discord.checkAllowedUser().then((data) => {
    if (data.access === true) {
      req.session.user = data.user
      req.session.userId = data.userId
      req.session.discordId = data.discordId
      req.session.acl = data.acl
      req.session.save(() => {
        res.redirect('/')
      })
      return
    }
    res.render('access', data)
  })
})

router.get('/logout', (req, res, _next) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid')
    res.redirect('/')
  })
})

export default router
