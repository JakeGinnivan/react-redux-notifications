import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  API_CALL_SUCCESS, API_CALL2_SUCCESS, API_CALL3_SUCCESS,
  apiCall, apiCall2, apiCall3
} from './demo.redux'
import { InlineNotification } from '../src/index'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

class Demo extends React.Component {
  render() {
    return (
      <div>
        <div>
          The trigger is a redux event, all you need to do is specify the event you want to notify for
          and how you want the notification to behave
        </div>
        <h4>Automatically hide</h4>
        <pre>
{`<InlineNotification
  defaultMessage=\'Api call successful!\'
  hideAfter={1000}
  triggeredBy={API_CALL_SUCCESS} />`}
        </pre>
        <InlineNotification
          defaultMessage='Api call successful!'
          hideAfter={1000}
          triggeredBy={API_CALL_SUCCESS} />
        <button onClick={this.props.apiCall}>Click here to emulate calling an api</button>

        <h4>Dismiss</h4>
        <pre>
{`<InlineNotification
  message=\'Api call successful!\'
  showDismiss
  triggeredBy={API_CALL2_SUCCESS} />`}
        </pre>
        <InlineNotification
          defaultMessage='Api call successful!'
          showDismiss
          triggeredBy={API_CALL2_SUCCESS} />
        <button onClick={this.props.apiCall2}>Click here to emulate calling an api</button>

      <h4>Animations</h4>
        <pre>
{`<InlineNotification
  message=\'Api call successful!\'
  triggeredBy={API_CALL3_SUCCESS}
  hideAfter={1000}
  renderContainer={notifications => (
    <ReactCSSTransitionGroup transitionName='alert'
      transitionEnterTimeout={200} transitionLeaveTimeout={500}>
      {notifications}
    </ReactCSSTransitionGroup>
  )} />`}
        </pre>
        <InlineNotification
          defaultMessage='Api call successful!'
          hideAfter={1000}
          triggeredBy={API_CALL3_SUCCESS}
          renderContainer={notifications => (
            <ReactCSSTransitionGroup transitionName='alert'
              transitionEnterTimeout={200} transitionLeaveTimeout={500}>
              {notifications}
            </ReactCSSTransitionGroup>
          )} />
        <button onClick={this.props.apiCall3}>Click here to emulate calling an api</button>
      </div>
    )
  }
}

Demo.propTypes = {
  apiCall: React.PropTypes.func.isRequired,
  apiCall2: React.PropTypes.func.isRequired,
  apiCall3: React.PropTypes.func.isRequired
}

export default connect(() => ({
}), dispatch => bindActionCreators({ apiCall, apiCall2, apiCall3 }, dispatch))(Demo)
