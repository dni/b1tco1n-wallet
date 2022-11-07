/* @refresh reload */
import { render } from 'solid-js/web';

import './index.css';
import App from './App';
import { spiral } from './spiral';

spiral();

render(() => <App />, document.getElementById('root'));
