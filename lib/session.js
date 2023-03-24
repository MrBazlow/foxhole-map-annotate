import session from 'express-session'
import { getConfig } from './config.js'
import FileStore from 'session-file-store/lib/session-file-store.js'

const NewFileStore = FileStore(session)
const fileStoreOptions = {}
const config = await getConfig()

const expressSession = session({
  secret: process.env.SECRET || 'grant',
  store: new NewFileStore(fileStoreOptions),
  saveUninitialized: true,
  resave: false,
  cookie: {
    maxAge: 86400000,
    secure: config.basic.url.startsWith('https://')
  }
})

export default expressSession
