/**
 * Admin (Edit Config)
 * @type {string}
 */
const ACL_ADMIN = 'admin'

/**
 * Full access (edit/add all tracks, edit/add all icons) + EventLog
 * @type {string}
 */
const ACL_MOD = 'moderator'

/**
 * Full access (add/edit own tracks, add/edit own icons)
 * @type {string}
 */
const ACL_FULL = 'full'

/**
 * Access only to add/edit own icons
 * @type {string}
 */
const ACL_ICONS_ONLY = 'icons'

/**
 * Only read access
 * @type {string}
 */
const ACL_READ = 'read'

/**
 * Blocked / No access
 * @type {string}
 */
const ACL_BLOCKED = 'blocked'

const ACL_ACTIONS = {
  CONFIG: 'config',
  EVENT_LOG: 'event.log',
  ICON_ADD: 'icon.add',
  ICON_EDIT: 'icon.edit',
  ICON_DELETE: 'icon.delete',
  DECAY_UPDATE: 'decay.update',
  READ: 'read'
}

const ACL_ORDER = { [ACL_BLOCKED]: -10, [ACL_ADMIN]: 0, [ACL_MOD]: 10, [ACL_FULL]: 20, [ACL_ICONS_ONLY]: 50, [ACL_READ]: 100 }

function hasAccess (userId, userAcl, action, feature = null) {
  if (userAcl === ACL_ADMIN) {
    return true
  }
  if (userAcl === ACL_MOD) {
    return action !== ACL_ACTIONS.CONFIG
  }
  if (userAcl === ACL_READ) {
    return action === ACL_ACTIONS.READ
  }
  // Everybody below can read
  if (action === ACL_ACTIONS.READ || action === ACL_ACTIONS.DECAY_UPDATE) {
    return true
  }

  // No role below admin/mod has access to this
  if (action === ACL_ACTIONS.CONFIG || action === ACL_ACTIONS.EVENT_LOG) {
    return false
  }

  if (userAcl === ACL_FULL) {
    if (action === ACL_ACTIONS.ICON_ADD) {
      return true
    }
    // if its not add, there needs to be a feature and the userIds need to match
    if (!feature || (feature.properties.userId && feature.properties.userId !== userId)) {
      return false
    }
    // own or undefined feature, allowed to edit
    return true
  }

  if (userAcl === ACL_ICONS_ONLY) {
    if (!feature || !feature.properties || feature.properties.type !== 'information') {
      return false
    }
    // Not own feature
    if (feature.properties.userId && feature.properties.userId !== userId) {
      return false
    }
    return action === ACL_ACTIONS.ICON_ADD || action === ACL_ACTIONS.ICON_EDIT || action === ACL_ACTIONS.ICON_DELETE
  }

  return false
}

export {
  hasAccess,
  ACL_ACTIONS,
  ACL_ORDER,
  ACL_ADMIN,
  ACL_MOD,
  ACL_FULL,
  ACL_ICONS_ONLY,
  ACL_READ,
  ACL_BLOCKED
}
