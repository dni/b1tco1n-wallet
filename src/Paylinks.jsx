import {
    lnurlp,
    lnurlw,
} from './signals';

import {
    clipboard_write,
} from './helpers';

import {
    qr_url,
} from './config';

const qr_lnurlp = () => lnurlp() ? qr_url + lnurlp() : "#";
const copy_lnurlp = () => clipboard_write(lnurlp());
const qr_lnurlw = () => lnurlw() ? qr_url + lnurlw() : "#";
const copy_lnurlw = () => clipboard_write(lnurlw());

function Paylinks() {
  return (
    <section id="paylinks">
      <div id="paylink" class="paylink">
          <h3>receive</h3>
          <p>with this link you can receive sats.</p>
          <p><img class='qrcode' src={qr_lnurlp()} alt="lnurlp qr" /></p>
          <p>{lnurlp()}</p>
          <p><button onclick={copy_lnurlp}>Copy lnurlp</button></p>
      </div>
      <div id="withdrawlink" class="paylink">
          <h3>withdraw</h3>
          <p>with this link you can withdraw sats. DO NOT SHARE</p>
          <p><img class='qrcode' src={qr_lnurlw()} alt="lnurlp qr" /></p>
          <p>{lnurlw()}</p>
          <p><button onclick={copy_lnurlw}>Copy withdrawlink</button></p>
      </div>
    </section>
  );
}

export default Paylinks;
