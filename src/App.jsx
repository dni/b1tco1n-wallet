const version = "0.0.1";

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
    setShowlogin, access_token, setAccessToken
} from './signals';

import { fetcher, WebSocketService } from './helpers';

import Login from './Login';

import Signup from './Signup';
import Dashboard from './Dashboard';
import Payments from "./Payments";

export const ws = new WebSocketService();

export const toggle_rainbow = () => document.body.classList.toggle("rainbow");
export const toggle_hole = () => document.body.classList.toggle("hole");

const App = () => {
  if('serviceWorker' in navigator) {
      navigator.serviceWorker
          .register('./service-worker.js', {scope: './'})
          .then((reg) => {
              // registration worked
              console.log('Registration succeeded. Scope is ' + reg.scope);
          });
  }

  QrScanner.hasCamera().then(setCamera);

  return (
    <div class={styles.App}>
      <section id="main" class={styles.header}>
        <Show when={login()}>
            <Dashboard />
            <Payments />
        </Show>
        <Show when={!login()}>
            <img src={logo} class={styles.logo} alt="logo" />
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
      </section>
      <footer>
          <button onclick={toggle_rainbow}>rainbow</button>
          <button onclick={toggle_hole}>hole</button>
           - made with ❤️ by <a target="_blank" href="https://www.twitter.com/dnilabs">dni</a>
          <p>b1tco1n.org, wallet based on <a target="_blank" href="https://lnbits.com/">lnbits</a>, version: {version}</p>
      </footer>
    </div>
  );
};

export default App;
