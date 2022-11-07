import { fetcher } from "./helpers"

const logout = () => {
    fetcher("/logout", (r) => {
        window.location = "/";
    }, false);
    return false;
}

function Settings() {
  return (
      <button onClick={logout}>logout</button>
  );
}

export default Settings;
