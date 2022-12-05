import {
    setShowlogin,
    setShowsignup,
    error_message,
    setErrorMessage,
    username,
    setUsername,
    password,
    setPassword,
    password_repeat,
    setPasswordRepeat,
    setAccessToken,
    login,
    setLogin,
} from "./signals";

import { fetcher } from "./helpers";

const show_login_form = (e) => {
    setShowsignup(false);
    setShowlogin(true);
}

const onSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    fetcher("/signup", (r) => {
        window.location = "/";
    }, true, {
        "username": username(),
        "password": password(),
        "password_repeat": password_repeat(),
    });
    return false;
}

function Signup() {
  return (
    <div id="signup">
      <h2>Sign up</h2>
      <form name="signup" method="POST" onSubmit={onSubmit} className={error_message() ? "error" : ""}>
        <input type="text" name="username" placeholder="username..." value={username()} onChange={(e) => setUsername(e.currentTarget.value)} />
        <input type="password" name="password" placeholder="password..." value={password()} onChange={(e) => setPassword(e.currentTarget.value)} />
        <input type="password" name="password-repeat" placeholder="password repeat..." value={password_repeat()} onChange={(e) => setPasswordRepeat(e.currentTarget.value)} />
        <input type="submit" value="signup" />
        &nbsp;or&nbsp;<span class="btn" onClick={show_login_form}>login</span>
      </form>
    </div>
  );
}

export default Signup;
