import {
    setShowlogin,
    setShowsignup,
    username,
    setUsername,
    password,
    setPassword,
    setAccessToken,
    error_message,
    setErrorMessage,
    login,
    setLogin,
    lnauth,
    setLnauth,
} from "./signals";

import { clipboard_write, fetcher, WebSocketService } from "./helpers";

import {
    qr_url,
} from './config';

const copy_lnauth = () => clipboard_write(lnauth());
const qr_lnauth = () => lnauth() ? qr_url + lnauth() : "#";

const signup = (e) => {
    setShowsignup(true);
    setShowlogin(false);
}

const onSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    fetcher("/login", (r) => {
        window.location = "/"
    }, false, {
        "username": username(),
        "password": password(),
    });
    return false;
}
function Login() {
  return (
    <div id="login">
      <h2>Login</h2>
      <form method="POST" onSubmit={onSubmit} className={error_message() ? "error" : ""}>
        <input type="text" name="username" placeholder="username..." value={username()} onChange={(e) => setUsername(e.currentTarget.value)} />
        <input type="password" name="password" placeholder="password..." value={password()} onChange={(e) => setPassword(e.currentTarget.value)} />
        <input type="submit" value="login" />
        &nbsp;or&nbsp;<span class="btn" onClick={signup}>signup</span>
      </form>
      <Show when={lnauth()}>
          <h2>LNAuth Login</h2>
          <p><img class='qrcode' src={qr_lnauth()} alt="" /></p>
          <p>{lnauth()}</p>
          <p><button onclick={copy_lnauth}>copy</button></p>
      </Show>
    </div>
  );
}

export default Login;
