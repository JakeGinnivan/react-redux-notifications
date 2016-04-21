import React from 'react'
import { connect } from 'react-redux'
import { listen, unlisten, hide } from './notifications.redux'

class InlineNotification extends React.Component {
  constructor(props) {
    super(props)
    this.dismiss = this.dismiss.bind(this)
  }

  componentDidMount() {
    this.dispatchListen(this.props)
  }

  componentWillUnmount() {
    this.props.dispatch(unlisten(this.props.triggeredBy))
  }

  componentDidReceiveProps(nextProps) {
    if (this.props.triggeredBy !== nextProps.triggeredBy ||
        this.props.hideAfter !== nextProps.hideAfter ||
        this.props.defaultMessage !== nextProps.defaultMessage) {
      this.componentWillUnmount()
      this.dispatchListen(nextProps)
    }
  }

  dispatchListen(props) {
    props.dispatch(listen({
      triggeredBy: Array.isArray(props.triggeredBy) ? props.triggeredBy : [props.triggeredBy],
      hideAfter: props.hideAfter,
      defaultMessage: props.defaultMessage,
      showDismiss: props.showDismiss
    }))
  }

  dismiss(notification) {
    this.props.dispatch(hide(notification.trigger, notification.key))
  }

  renderNotification(notification, dismiss) {
    return (
      <div className='notification' key={notification.key}>
        {notification.message}
        {notification.showDismiss && <span className='notification_dismiss' onClick={dismiss}>x</span>}
      </div>
    )
  }

  renderContainer(notifications) {
    return (
      <div>
        {notifications}
      </div>
    )
  }

  render() {
    const renderNotification = this.props.renderNotification || this.renderNotification
    const renderContainer = this.props.renderContainer || this.renderContainer
    const notificationsForMe = this.props.notifications[this.props.triggeredBy] || []
    return renderContainer(notificationsForMe.map(n => renderNotification(n, () => this.dismiss(n))))
  }
}

InlineNotification.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  triggeredBy: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.arrayOf(React.PropTypes.string)
  ]).isRequired,
  notifications: React.PropTypes.object.isRequired,
  defaultMessage: React.PropTypes.string,
  hideAfter: React.PropTypes.number,
  renderNotification: React.PropTypes.func,
  renderContainer: React.PropTypes.func
}

export default connect(state => ({
  notifications: state.notifications.notifications
}))(InlineNotification)
