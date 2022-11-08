/* @refresh reload */
import { render } from 'solid-js/web';

import './index.css';
import App from './App';
import { spiral } from './spiral';
import { debug } from './config';
import log from 'loglevel';

log.setLevel(debug ? "debug" : "info");
log.info(`debugging is ${debug ? 'enabled' : 'disabled'}`)

spiral();
render(() => <App />, document.getElementById('root'));
