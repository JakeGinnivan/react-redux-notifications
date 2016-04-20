import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { API_CALL_SUCCESS, API_CALL2_SUCCESS, apiCall, apiCall2 } from './demo.redux'
import { InlineNotification } from '../src/index'

class Demo extends React.Component {
  render() {
    return (
      <div>
        <h4>Automatically hide</h4>
        <pre>
{`<InlineNotification
  message=\'Api call successful!\'
  triggeredBy={API_CALL_SUCCESS}
  hideAfter={1000} />`}
        </pre>
        <InlineNotification
          message='Api call successful!'
          triggeredBy={API_CALL_SUCCESS}
          hideAfter={1000} />
        <div onClick={this.props.apiCall}>Click here to emulate calling an api</div>

        <h4>Dismiss</h4>
        <pre>
{`<InlineNotification
  message=\'Api call successful!\'
  triggeredBy={API_CALL2_SUCCESS}
  hideAfter={1000} />`}
        </pre>
        <InlineNotification
          message='Api call successful!'
          triggeredBy={API_CALL2_SUCCESS}
          showDismiss />
        <div onClick={this.props.apiCall2}>Click here to emulate calling an api</div>
      </div>
    )
  }
}

export default connect(() => ({
}), dispatch => bindActionCreators({ apiCall, apiCall2 }, dispatch))(Demo)
