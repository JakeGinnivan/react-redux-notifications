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
  ...restOfMiddleware
})

// Middleware setup
import { middleware as NotificationMiddleware } from 'react-redux-notifications'

let store = createStore(
  myAppReducers,
  compose(
    applyMiddleware(ReduxThunk, NotificationMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : _ => _
  )
)
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

## Limitations
You can only have one InlineNotification component rendered for a particular event.

Currently the last rendered components settings will win.

## API
### InlineNotification component
 - `triggeredBy` - either string or array of strings defining which redux event(s) to listen for
 - `defaultMessage` - The fallback message to render. `notificationMessage` on the triggering event type will take precident
 - `hideAfter` - Hide notification after specified number of ms
 - `renderNotification` - Override rendering each notification `function(notification) { return <div key={notification.key}>{notification.message}</div> }`
 - `renderContainer` - Override the container render `function(notifications) { return <div id='notificationContainer'>{notifications}</div> }`
    - `notifications` are the rendered components, you need to specify renderContainer and renderNotification separately

#### notification
The notification object which is passed to `renderNotification`
``` js
{
  key: "<unique key used as react component key>"
  message: "<notificationMessage || defaultMessage>"
  trigger: "<redux event which triggered the notification>"
}
```

## Demo site
[http://jake.ginnivan.net/react-redux-notifications/](http://jake.ginnivan.net/react-redux-notifications/)

### Common Tasks

* Developing - **npm start** - Runs the development server at *localhost:8080* and use Hot Module Replacement. You can override the default host and port through env (`HOST`, `PORT`).
* Creating a version - **npm version <x.y.z>** - Updates */dist* and *package.json* with the new version and create a version tag to Git.
* Publishing a version - **npm publish** - Pushes a new version to npm and updates the project site.

If you don't want to use universal rendering for the React portion, set `RENDER_UNIVERSAL` to `false` at *webpack.config.babel.js*.

### Testing

The test setup is based on Karma/Mocha/Chai/Phantom. Code coverage report is generated through istanbul/isparta to `build/`.

* Running tests once - **npm test**
* Running tests continuously **npm run test:tdd**
* Linting - **npm run test:lint** - Runs ESLint.

### Demo Site

The boilerplate includes a [GitHub Pages](https://pages.github.com/) specific portion for setting up a demo site for the component. The main commands handle with the details for you. Sometimes you might want to generate and deploy it by hand, or just investigate the generated bundle.

* Building - **npm run gh-pages** - Builds the demo into `./gh-pages` directory.
* Deploying - **npm run deploy-gh-pages** - Deploys the contents of `./gh-pages` to the `gh-pages` branch. GitHub will pick this up automatically. Your site will be available through *<user name>.github.io/<project name>`.
* Generating stats - **npm run stats** - Generates stats that can be passed to [webpack analyse tool](https://webpack.github.io/analyse/). This is useful for investigating what the build consists of.

## License

*react-redux-notifications* is available under MIT. See LICENSE for more details.

## Attributions
Thanks to [https://github.com/survivejs/react-component-boilerplate](https://github.com/survivejs/react-component-boilerplate)
for the scaffolding of this library
