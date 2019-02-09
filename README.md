# react-redux-notifications

Say you have a form with an API call and when the form submit succeeds you want to show the user a success message, or
in the event of a failure, show them a failure message.

React-redux-notifications is a redux middleware powered notification system which makes this super easy in a decoupled way.

## Setup

```js
// Reducer setup
import { reducer as notifications } from 'react-redux-notifications'

const todoApp = combineReducers({
    notifications,
    ...restOfMiddleware,
})

// Middleware setup
import { middleware as NotificationMiddleware } from 'react-redux-notifications'

let store = createStore(
    myAppReducers,
    compose(
        applyMiddleware(ReduxThunk, NotificationMiddleware),
        window.devToolsExtension ? window.devToolsExtension() : _ => _,
    ),
)

// To use a different key to middleware
import { createMiddleware } from 'react-redux-notifications'
import { reducer as myCustomKey } from 'react-redux-notifications'

const todoApp = combineReducers({
    myCustomKey,
    ...restOfMiddleware,
})

const NotificationMiddleware = createMiddleware('myCustomKey')

let store = createStore(
    myAppReducers,
    compose(
        applyMiddleware(ReduxThunk, NotificationMiddleware),
        window.devToolsExtension ? window.devToolsExtension() : _ => _,
    ),
)

<InlineNotification
  message='Api call successful!'
  triggeredBy={API_CALL_SUCCESS}
  reduxKey="myCustomKey" />
```

## Example usage

```js
<InlineNotification
  message='Api call successful!'
  triggeredBy={API_CALL_SUCCESS}
  showDismiss />

<InlineNotification
  defaultMessage='Api call successful!'
  triggeredBy={DIFFERENT_API_CALL_SUCCESS}
  hideAfter={500} />
```

## API

### InlineNotification component

-   `triggeredBy` - either string or array of strings defining which redux event(s) to listen for
-   `defaultMessage` - The fallback message to render. `notificationMessage` on the triggering event type will take precident
-   `hideAfter` - Hide notification after specified number of ms
-   `showDismiss` - Show the default dismiss button
-   `renderDismiss` - Override the rendering of the dismiss button (this has no effect when renderNotification is specified, as dismiss is part of the notification)
-   `renderNotification` - Override rendering each notification `function(notification) { return <div key={notification.key}>{notification.message}</div> }`
-   `renderContainer` - Override the container render `function(notifications) { return <div id='notificationContainer'>{notifications}</div> }`
    -   `notifications` are the rendered components, you need to specify renderContainer and renderNotification separately
-   `reduxKey` - If not using the default `notifications` key for redux, your key can be specified here

#### notification

The notification object which is passed to `renderNotification`

```js
{
    key: '<unique key used as react component key>'
    message: '<notificationMessage || defaultMessage>'
    trigger: '<redux event which triggered the notification>'
}
```

## License

_react-redux-notifications_ is available under MIT. See LICENSE for more details.
