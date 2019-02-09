import React from 'react'
import PropTypes from 'prop-types'
import { connect, HandleThunkActionCreator } from 'react-redux'
import {
    listen,
    unlisten,
    hide,
    Notification,
    NotificationsState,
} from './notifications.redux'

interface MappedStateProps {
    subscribers: NotificationsState['subscribers']
}
export interface OwnProps {
    defaultMessage?: string
    hideAfter?: number
    triggeredBy: string | string[]
    renderNotification?: (
        notification: Notification,
        dismissNotification: () => void,
    ) => React.ReactElement<any>
    renderContainer?: (
        notifications: Array<React.ReactElement<any>>,
    ) => React.ReactElement<any>
    renderDismiss?: (dismiss: () => void) => React.ReactElement<any> | null
    showDismiss?: boolean
    reduxKey?: string
}
interface DispatchProps {
    listen: HandleThunkActionCreator<typeof listen>
    unlisten: HandleThunkActionCreator<typeof unlisten>
    hide: HandleThunkActionCreator<typeof hide>
}

type Props = DispatchProps & OwnProps & MappedStateProps

class InlineNotification extends React.Component<Props> {
    static idSeed = 1
    static propTypes = {
        triggeredBy: PropTypes.oneOfType([
            PropTypes.string.isRequired,
            PropTypes.arrayOf(PropTypes.string.isRequired),
        ]).isRequired,
        defaultMessage: PropTypes.string,
        hideAfter: PropTypes.number,
        renderNotification: PropTypes.func,
        renderContainer: PropTypes.func,
        renderDismiss: PropTypes.func,
        showDismiss: PropTypes.bool,
    }

    componentId = `inline-${InlineNotification.idSeed++}`

    componentDidMount() {
        this.dispatchListen(this.props)
    }

    componentWillUnmount() {
        this.props.unlisten(this.componentId)
    }

    componentDidUpdate(prevProps: Props) {
        if (
            this.props.triggeredBy !== prevProps.triggeredBy ||
            this.props.hideAfter !== prevProps.hideAfter ||
            this.props.defaultMessage !== prevProps.defaultMessage
        ) {
            this.componentWillUnmount()
            this.dispatchListen(prevProps)
        }
    }

    dispatchListen(props: Props) {
        this.props.listen({
            componentId: this.componentId,
            triggeredBy: Array.isArray(props.triggeredBy)
                ? props.triggeredBy
                : [props.triggeredBy],
            hideAfter: props.hideAfter || undefined,
            defaultMessage: props.defaultMessage || undefined,
        })
    }

    dismiss = (notification: Notification) => {
        this.props.hide(this.componentId, notification.key)
    }

    renderNotification(
        notification: Notification,
        dismiss: React.ReactElement<any> | null,
    ): React.ReactElement<any> {
        return (
            <div className="notification" key={notification.key}>
                {notification.message}
                {dismiss}
            </div>
        )
    }

    renderContainer(notifications: Array<React.ReactElement<any>>) {
        return <div>{notifications}</div>
    }

    render() {
        const renderContainer =
            this.props.renderContainer || this.renderContainer
        const componentState = this.props.subscribers[this.componentId]

        return renderContainer(
            componentState
                ? componentState.notifications.map(n => {
                      const dismiss = () => this.dismiss(n)
                      if (this.props.renderNotification) {
                          return this.props.renderNotification(n, dismiss)
                      }

                      const dismissEl = this.props.renderDismiss ? (
                          this.props.renderDismiss(dismiss)
                      ) : this.props.showDismiss ? (
                          <button
                              className="notification_dismiss"
                              onClick={dismiss}
                          >
                              x
                          </button>
                      ) : null
                      return this.renderNotification(n, dismissEl)
                  })
                : [],
        )
    }
}

export default connect<
    MappedStateProps,
    DispatchProps,
    OwnProps,
    { [key: string]: NotificationsState }
>(
    (state, ownProps) => {
        const reduxKey = ownProps.reduxKey || 'notifications'
        const notificationState = state[reduxKey]
        if (!notificationState) {
            throw new Error(`Missing ${reduxKey} key in redux state`)
        }
        return {
            subscribers: notificationState.subscribers,
        }
    },
    {
        listen,
        hide,
        unlisten,
    },
)(InlineNotification)
