export const LISTEN_TO = 'notifications/listenTo'
export const STOP_LISTEN = 'notifications/stopListen'
export const SHOW_NOTIFICATION = 'notification/showNotification'
export const HIDE_NOTIFICATION = 'notification/hideNotification'

export function listen(options) {
  return Object.assign({}, options, {
    type: LISTEN_TO
  })
}

export function unlisten(actionType) {
  return {
    type: STOP_LISTEN,
    actionType
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
      trigger: action.type,
      message: action.notificationMessage
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
            message: action.message
          }
        })
      })
    case STOP_LISTEN: {
      const newCount = state.listeningTo[action.actionType] - 1
      return Object.assign({}, state, {
        listeningTo: Object.assign({}, state.listeningTo, {
          [action.actionType]: newCount === 0 ? undefined : newCount
        })
      })
    }
    case SHOW_NOTIFICATION:
      return Object.assign({}, state, {
        notifications: Object.assign({}, state.notifications, {
          [action.trigger]: [...(state.notifications[action.trigger] || []), {
            key: action.key,
            message: action.message
          }]
        })
      })
    case HIDE_NOTIFICATION: {
      let notificationForActionType = state.notifications[action.trigger]
      return Object.assign({}, state, {
        notifications: Object.assign({}, state.notifications, {
          [action.trigger]: notificationForActionType.filter(n => n.key !== action.key)
        })
      })
    }
  }

  return state
}
