import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux';
import rootReducer from './reducers/rootReducer';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import App from './ui/Home';

const factualTheme = getMuiTheme({
  // spacing: _spacing2.default,
  fontFamily: 'Helvetica Neue, sans-serif',
  palette: {
    primary1Color: "#ff8700",
    primary2Color: "#faf9f7",
    // primary3Color: _colors.grey400,
    accent1Color: "#ff8700",
    // accent2Color: _colors.grey100,
    // accent3Color: _colors.grey500,
    textColor: "#222222",
    // secondaryTextColor: (0, _colorManipulator.fade)(_colors.darkBlack, 0.54),
    // alternateTextColor: _colors.white,
    // canvasColor: "f5f5f5",
    // borderColor: "#B94A48",
    // disabledColor: (0, _colorManipulator.fade)(_colors.darkBlack, 0.3),
    // pickerHeaderColor: _colors.cyan500,
    // clockCircleColor: (0, _colorManipulator.fade)(_colors.darkBlack, 0.07),
    // shadowColor: _colors.fullBlack
  }
})

// Needed for onTouchTap can go away when react 1.0 release
// Check this repo: https://github.com/zilverline/react-tap-event-plugin
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware))

render(
  <MuiThemeProvider muiTheme={factualTheme}>
    <Provider store={store}>
      <App />
    </Provider>
  </MuiThemeProvider>, 
  document.getElementById('app')
);
