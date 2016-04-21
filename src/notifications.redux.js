export const LISTEN_TO = 'notifications/listenTo'
export const STOP_LISTEN = 'notifications/stopListen'
export const SHOW_NOTIFICATION = 'notification/showNotification'
export const HIDE_NOTIFICATION = 'notification/hideNotification'

export function listen(options) {
  return Object.assign({}, options, {
    type: LISTEN_TO
  })
}

export function unlisten(actionTypes) {
  return {
    type: STOP_LISTEN,
    actionTypes
  }
}

export function hide(trigger, key) {
  return {
    type: HIDE_NOTIFICATION,
    trigger: trigger,
    key: key
  }
}

let keySeed = 0

export const middleware = store => next => action => {
  const result = next(action)
  const listener = store.getState().notifications.listeningTo[action.type]
  if (listener) {
    const notificationKey = `notification_${keySeed++}`
    store.dispatch({
      type: SHOW_NOTIFICATION,
      key: notificationKey,
      trigger: action,
      showDismiss: listener.showDismiss,
      message: action.notificationMessage || listener.defaultMessage
    })

    if (listener.hideAfter) {
      setTimeout(() => {
        store.dispatch({
          type: HIDE_NOTIFICATION,
          trigger: action.type,
          key: notificationKey
        })
      }, listener.hideAfter)
    }
  }

  return result
}

export default function(state = { listeningTo: { }, notifications: { } }, action) {
  switch (action.type) {
    case LISTEN_TO:
      return Object.assign({}, state, {
        listeningTo: Object.assign({}, state.listeningTo, {
          [action.triggeredBy]: {
            hideAfter: action.hideAfter,
            defaultMessage: action.defaultMessage,
            showDismiss: action.showDismiss
          }
        })
      })
    case STOP_LISTEN: {
      const newListeningTo = Object.assign({}, state.listeningTo)
      action.actionTypes.forEach(actionType => {
        const newCount = state.listeningTo[actionType] - 1
        newListeningTo[actionType] = newCount === 0 ? undefined : newCount
      })
      return Object.assign({}, state, {
        listeningTo: newListeningTo
      })
    }
    case SHOW_NOTIFICATION:
      return Object.assign({}, state, {
        notifications: Object.assign({}, state.notifications, {
          [action.trigger.type]: [...(state.notifications[action.trigger.type] || []), {
            key: action.key,
            message: action.message,
            trigger: action.trigger,
            showDismiss: action.showDismiss
          }]
        })
      })
    case HIDE_NOTIFICATION: {
      let notificationForActionType = state.notifications[action.trigger]
      const filtered = notificationForActionType.filter(n => n.key !== action.key)
      return Object.assign({}, state, {
        notifications: Object.assign({}, state.notifications, {
          [action.trigger]: filtered.length === 0 ? undefined : filtered
        })
      })
    }
  }

  return state
}
