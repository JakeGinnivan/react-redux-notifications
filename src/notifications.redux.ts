import redux, { AnyAction } from 'redux'

export interface ComponentState {
    options: ListenOptions
    notifications: Notification[]
}
export interface NotificationsState {
    subscribers: {
        [componentId: string]: ComponentState
    }
}

export interface Notification {
    key: string
    message: string
    trigger: AnyAction
}

export interface ListeningTo {
    hideAfter?: number | null
    defaultMessage?: string | null
    showDismiss: boolean
}

export const LISTEN_TO = 'notifications/listenTo'
export const STOP_LISTEN = 'notifications/stopListen'
export const SHOW_NOTIFICATION = 'notification/showNotification'
export const HIDE_NOTIFICATION = 'notification/hideNotification'

export interface ListenOptions {
    componentId: string
    triggeredBy: string[]
    hideAfter: number | undefined
    defaultMessage: string | undefined
}

export function listen(options: ListenOptions): ListenToAction {
    return { options, type: LISTEN_TO }
}

export function unlisten(componentId: string): StopListenAction {
    return {
        type: STOP_LISTEN,
        componentId,
    }
}

export function hide(componentId: string, key: string): HideNotificationAction {
    return {
        type: HIDE_NOTIFICATION,
        componentId,
        notificationKey: key,
    }
}

let keySeed = 0

export function createMiddleware(key: string): redux.Middleware {
    return store => next => action => {
        const result = next(action)
        const state: NotificationsState | undefined = (store.getState() as any)[
            key
        ]

        if (!state) {
            throw new Error(
                `No state key ${key}, ensure notifications middleware is registered`,
            )
        }

        const notificationKey = `notification_${keySeed++}`
        const notificationMessage =
            action && (action as any).notificationMessage

        for (const componentId in state.subscribers) {
            if (state.subscribers.hasOwnProperty(componentId)) {
                const subscriber = state.subscribers[componentId]

                if (
                    subscriber.options.triggeredBy.indexOf(action.type) !== -1
                ) {
                    const show: ShowNotificationAction = {
                        type: SHOW_NOTIFICATION,
                        componentId,
                        notification: {
                            key: notificationKey,
                            message:
                                notificationMessage ||
                                subscriber.options.defaultMessage,
                            trigger: action,
                        },
                    }
                    store.dispatch(show)

                    if (subscriber.options.hideAfter) {
                        setTimeout(() => {
                            const hideAction: HideNotificationAction = {
                                type: HIDE_NOTIFICATION,
                                notificationKey,
                                componentId,
                            }
                            store.dispatch(hideAction)
                        }, subscriber.options.hideAfter)
                    }
                }
            }
        }

        return result
    }
}

export const middleware: redux.Middleware = createMiddleware('notifications')

export interface ListenToAction {
    type: typeof LISTEN_TO
    options: ListenOptions
}
export interface StopListenAction {
    type: typeof STOP_LISTEN
    componentId: string
}
export interface ShowNotificationAction {
    type: typeof SHOW_NOTIFICATION
    componentId: string
    notification: Notification
}
export interface HideNotificationAction {
    type: typeof HIDE_NOTIFICATION
    componentId?: string
    notificationKey: string
}
export type NotificationActions =
    | ListenToAction
    | StopListenAction
    | ShowNotificationAction
    | HideNotificationAction

const defaultState: NotificationsState = { subscribers: {} }

// tslint:disable-next-line:no-shadowed-variable
const reducer: redux.Reducer<NotificationsState> = function reducer(
    state = defaultState,
    action: NotificationActions | AnyAction,
): NotificationsState {
    const narrowedActions = action as NotificationActions
    switch (narrowedActions.type) {
        case LISTEN_TO: {
            return {
                ...state,
                subscribers: {
                    ...state.subscribers,
                    [narrowedActions.options.componentId]: {
                        options: narrowedActions.options,
                        notifications: [],
                    },
                },
            }
        }

        case STOP_LISTEN: {
            const newListeningTo: NotificationsState = {
                ...state,
                subscribers: { ...state.subscribers },
            }
            delete newListeningTo.subscribers[narrowedActions.componentId]

            return newListeningTo
        }

        case SHOW_NOTIFICATION: {
            return {
                ...state,
                subscribers: {
                    ...state.subscribers,
                    [narrowedActions.componentId]: {
                        ...state.subscribers[narrowedActions.componentId],
                        options:
                            state.subscribers[narrowedActions.componentId]
                                .options,
                        notifications: [
                            ...state.subscribers[narrowedActions.componentId]
                                .notifications,
                            narrowedActions.notification,
                        ],
                    },
                },
            }
        }
        case HIDE_NOTIFICATION: {
            const newState: NotificationsState = {
                ...state,
                subscribers: {
                    ...state.subscribers,
                },
            }

            if (narrowedActions.componentId) {
                const existing =
                    newState.subscribers[narrowedActions.componentId]
                newState.subscribers[narrowedActions.componentId] = {
                    options: existing.options,
                    notifications: existing.notifications.filter(
                        val => val.key !== narrowedActions.notificationKey,
                    ),
                }
            } else {
                for (const subscriberId in newState.subscribers) {
                    if (newState.subscribers.hasOwnProperty(subscriberId)) {
                        const subscriber = newState.subscribers[subscriberId]

                        const filtered = subscriber.notifications.filter(
                            notification =>
                                notification.key !==
                                narrowedActions.notificationKey,
                        )
                        if (
                            filtered.length !== subscriber.notifications.length
                        ) {
                            newState.subscribers[subscriberId] = {
                                options:
                                    newState.subscribers[subscriberId].options,
                                notifications: filtered,
                            }
                        }
                    }
                }
            }

            return newState
        }
    }

    return state
}

export default reducer
