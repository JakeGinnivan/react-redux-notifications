import React from 'react'
import { connect } from 'react-redux'
import { listen, unlisten, hide } from './notifications.redux'

class InlineNotification extends React.Component {
  constructor(props) {
    super(props)
    this.dismiss = this.dismiss.bind(this)
  }

  componentDidMount() {
    this.props.dispatch(listen({
      triggeredBy: this.props.triggeredBy,
      hideAfter: this.props.hideAfter,
      message: this.props.message
    }))
  }

  componentWillUnmount() {
    this.props.dispatch(unlisten(this.props.triggeredBy))
  }

  componentDidReceiveProps(nextProps) {
    if (this.props.triggeredBy !== nextProps.triggeredBy) {
      this.componentWillUnmount()
      this.props.dispatch(listen({
        triggeredBy: this.props.triggeredBy,
        hideAfter: this.props.hideAfter
      }))
    }
  }

  dismiss(notification) {
    this.props.dispatch(hide(this.props.triggeredBy, notification.key))
  }

  render() {
    const notificationsForMe = this.props.notifications[this.props.triggeredBy] || []
    return (
      <div>
        {notificationsForMe.map(n => (
          <div key={n.key}>
            {this.props.message}
            {this.props.showDismiss && <div onClick={() => this.dismiss(n)}>dismiss</div>}
          </div>
        ))}
      </div>
    )
  }
}

InlineNotification.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  triggeredBy: React.PropTypes.string.isRequired,
  notifications: React.PropTypes.object.isRequired,
  message: React.PropTypes.string,
  hideAfter: React.PropTypes.number
}

export default connect(state => ({
  notifications: state.notifications.notifications
}))(InlineNotification)
