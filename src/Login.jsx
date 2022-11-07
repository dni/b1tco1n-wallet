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
} from "./signals";

import { fetcher, WebSocketService } from "./helpers";


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
        <span className="error">{error_message()}</span>
        <input type="submit" value="login" />
        &nbsp;or&nbsp;<span class="btn" onClick={signup}>signup</span>
      </form>
    </div>
  );
}

export default Login;
