import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { API_CALL_SUCCESS, apiCall } from './demo.redux'
import { InlineNotification } from '../src/index'

class Demo extends React.Component {
  constructor(props) {
    super(props)
    this.doSomething = this.doSomething.bind(this)
  }

  doSomething() {
    this.props.apiCall()
  }

  render() {
    return (
      <div>
        <InlineNotification
          message='Api call successful!'
          triggeredBy={API_CALL_SUCCESS}
          showDismiss />
        <div onClick={this.doSomething}>Click here to emulate calling an api</div>
      </div>
    )
  }
}

export default connect(() => ({
}), dispatch => bindActionCreators({ apiCall }, dispatch))(Demo)
