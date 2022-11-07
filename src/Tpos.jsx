import {
    tpos
} from "./signals"

import { lnbits_url } from "./config"
const open_tpos = () => window.open(lnbits_url + "/tpos/" + tpos(), "_blank");

function Settings() {
  return (
    <section id="tpos">
      <button onClick={open_tpos}>pos</button>
    </section>
  );
}

export default Settings;
