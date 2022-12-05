import log from 'loglevel';

import logo from './assets/logo.svg';
import styles from './App.module.css';
import { createEffect } from 'solid-js';
import QrScanner from 'qr-scanner';

import {
    invoice, setInvoice,
    user, setUser,
    setCamera,
    username, setUsername,
    login, setLogin, showlogin, showsignup,
    setShowlogin, access_token, setAccessToken,
    error_message, setErrorMessage,
    online, setOnline,
} from './signals';

import { is_online, fetcher, WebSocketService } from './helpers';

import { version } from './config';

import Login from './Login';

import Signup from './Signup';
import Dashboard from './Dashboard';
import Payments from "./Payments";

export let ws = null;

export const toggle_rainbow = () => document.body.classList.toggle("rainbow");

const App = () => {
  if('serviceWorker' in navigator) {
      navigator.serviceWorker
          .register('./service-worker.js', {scope: './'})
          .then((reg) => {
              log.info(`Registration succeeded. Scope is ${reg.scope}`);
          });
  }
  if (navigator.onLine) {
      is_online((is_on) => {
          if (is_on === true) {
              setOnline(true);
              setErrorMessage("");
              ws = new WebSocketService();
          } else {
              setErrorMessage("API is offline.");
          }
      });
  } else {
      setErrorMessage("you are offline.");
  }

  QrScanner.hasCamera().then(setCamera);

  return (
    <div class={styles.App}>
      <section id="main" class={styles.header}>
        <Show when={error_message()}>
            <span className="error">{error_message()}</span>
        </Show>
        <Show when={login()}>
            <Dashboard />
            <Payments />
        </Show>
        <Show when={!login()}>
            <img src={logo} class={styles.logo} alt="logo" />
            <Show when={online()}>
                <Show when={!showlogin() && !showsignup()}>
                    <div class="ring">Loading<span></span></div>
                </Show>
                <Show when={showlogin()}>
                    <Login />
                </Show>
                <Show when={showsignup()}>
                    <Signup />
                </Show>
            </Show>
        </Show>
      </section>
      <footer>
          <button onclick={toggle_rainbow}>rainbow</button>
           - made with ❤️ by <a target="_blank" href="https://www.twitter.com/dnilabs">dni</a>
          <p>b1tco1n.org, wallet based on <a target="_blank" href="https://lnbits.com/">lnbits</a>, version: {version}</p>
      </footer>
    </div>
  );
};

export default App;
