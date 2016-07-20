import React from 'react';
import ReactDOM from 'react-dom';
import App from './ui/Home';


// Needed for onTouchTap can go away when react 1.0 release
// Check this repo: https://github.com/zilverline/react-tap-event-plugin
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

ReactDOM.render(<App />, document.getElementById('app'));
