import { success_message, setSuccessMessage, error_message, setErrorMessage, invoice, setInvoice, camera } from "./signals"
import { notify, clipboard_read } from "./helpers"
import { ws } from "./App"
import { createSignal, createEffect } from "solid-js"
import QrScanner from 'qr-scanner';


// import { start_camera, stop_camera } from "./helpers"

export const [decodedInvoice, setDecodedInvoice] = createSignal({});
export const [decodedLnurl, setDecodedLnurl] = createSignal({});

export const [showInvoiceForm, setShowInvoiceForm] = createSignal(false);
export const [showLnurlpForm, setShowLnurlpForm] = createSignal(false);
export const [showLnurlwForm, setShowLnurlwForm] = createSignal(false);

export const [amount, setAmount] = createSignal(0);
export const [minAmount, setMinAmount] = createSignal(0);
export const [maxAmount, setMaxAmount] = createSignal(0);
export const [description, setDescription] = createSignal(0);
export const [comment, setComment] = createSignal("");
export const [commentAllowed, setCommentAllowed] = createSignal(0);

export const [toggle_camera, setToggleCamera] = createSignal(false);

const pay_invoice = (event) => {
    setErrorMessage("");
    ws.send({"type": "pay", "data": {"bolt11": invoice()}})
};


const pay_lnurlp = (event) => {
    let lnurl = decodedLnurl();
    let amt = amount() * 1000;
    if (amt >= lnurl.minSendable && amt <= lnurl.maxSendable) {
        setErrorMessage("");
        ws.send({"type": "pay_lnurlp", "data": {
            "callback": lnurl.callback,
            "amount": amt,
            "comment": comment(),
        }})
    } else {
        setErrorMessage("ERROR: amount not in range");
    }
};

const pay_lnurlw = (event) => {
    let lnurl = decodedLnurl();
    let amt = amount() * 1000;
    if (amt >= lnurl.minWithdrawable && amt <= lnurl.maxWithdrawable) {
        setErrorMessage("");
        ws.send({"type": "pay_lnurlw", "data": {
            "callback": lnurl.callback,
            "amount": amount(),
            "k1": lnurl.k1,
        }})
    } else {
        setErrorMessage("ERROR: amount not in range");
    }
};


const cancel_invoice = (event) => {
    setInvoice("")
};

let qrScanner = null;

const action_toggle_camera = (event) => {
    let cam = !toggle_camera();
    setToggleCamera(cam);
    if (cam) {
        qrScanner = new QrScanner(
            document.getElementById("video"),
            result => setInvoice(result)
        );
        qrScanner.start();
    } else {
        qrScanner.stop();
    }
}

const get_amount = (event) => {
    let inv = decodedInvoice();
    return (inv.amount_msat / 1000).toLocaleString();
};

const get_description = (event) => {
    let inv = decodedInvoice();
    return inv.description;
};

const paste = (e) => {
    let clipboardData, pastedData;
    e.stopPropagation();
    e.preventDefault();
    clipboardData = e.clipboardData || window.clipboardData;
    pastedData = clipboardData.getData('Text');
    setInvoice(pastedData);
};

function Pay() {
  createEffect(() => {
      let data = decodedInvoice();
      if (data) {
         setShowInvoiceForm(true);
      }
  });
  createEffect(() => {
      let data = decodedLnurl();
      if (data) {
          if (data.tag === "payRequest") {
              setCommentAllowed(data.commentAllowed);
              let desc = JSON.parse(data.metadata)[0][1];
              setDescription(desc);
              setMinAmount(data.minSendable / 1000);
              setMaxAmount(data.maxSendable / 1000);
              setShowLnurlpForm(true);
              let el = document.querySelector(".lnurlpform .amount")
              if (el) el.focus();

          }
          if (data.tag === "withdrawRequest") {
              setShowLnurlwForm(true);
              setMinAmount(data.minWithdrawable / 1000);
              setMaxAmount(data.maxWithdrawable / 1000);
              setDescription(data.defaultDescription);
              let el = document.querySelector(".lnurlwform .amount")
              if (el) el.focus();
          }
      }
  });
  createEffect(() => {
      if (invoice()) {
          ws.send({"type": "invoice", "data": {"bolt11": invoice()}})
      }
     setErrorMessage("");
     setShowInvoiceForm(false);
     setShowLnurlpForm(false);
     setShowLnurlwForm(false);
  });
  return (
      <section id="pay" className={error_message() ? 'error' : ''}>
         <h3>pay invoice</h3>
         <Show when={camera()}>
             <button onclick={action_toggle_camera}>toggle scanner</button> {toggle_camera() ? "on" : "off"}
         </Show>
         <textarea placeholder="paste invoice (lnbc.) or LNURL here..."
            onPaste={paste} id="invoice" name="invoice" rows="6" value={invoice()}></textarea>
         <Show when={showInvoiceForm()}>
             <div className="invoiceform payform">
                <h3>lightning invoice</h3>
                <p>
                    <label>amount:</label> <span class="sats">{get_amount}</span> sats<br />
                    <label>memo:</label> {get_description} <br />
                </p>
                 <span className="error">{error_message()}</span>
                 <button onclick={pay_invoice}>pay</button>
                 <button onclick={cancel_invoice}>cancel</button>
             </div>
          </Show>
         <Show when={showLnurlpForm()}>
             <div className="lnurlpform payform">
                <h3>lnurlp, payment link</h3>
                <label htmlFor="amount">Amount:
                    <div className="info">
                        <label>min. amount: {minAmount}</label>
                        <label>max. amount: {maxAmount}</label>
                        <label>info: {description}</label>
                    </div>
                </label>
                <input placeholder="100" type="number" className="amount" name="amount" onKeyup={(e) => setAmount(parseInt(e.currentTarget.value))} />

                <label htmlFor="comment">Comment:
                    <div className="info">
                        <label>max. characters: {commentAllowed}</label>
                    </div>
                 </label>
                <textarea onKeyup={(e) => setComment(e.currentTarget.value)} placeholder="comment..." id="comment" name="comment"></textarea>
                <br />
                <label htmlFor="bookmark1"><input id="bookmark1" name="bookmark" type="checkbox" /> bookmark lnurl</label>
                <span className="error">{error_message()}</span>
                <button onclick={pay_lnurlp}>pay</button>
                <button onclick={cancel_invoice}>cancel</button>
             </div>
         </Show>
         <Show when={showLnurlwForm()}>
             <div className="lnurlwform payform">
                <h3>lnurlw, withdraw link</h3>
                <label htmlFor="amount">Amount: </label>
                <label>min. amount: {minAmount}</label>
                <label>max. amount: {maxAmount}</label>
                <input placeholder="100" type="number" className="amount" name="amount" onKeyup={(e) => setAmount(parseInt(e.currentTarget.value))} />
                <label htmlFor="bookmark2"><input id="bookmark2" name="bookmark" type="checkbox" /> bookmark lnurl</label>
                <span className="error">{error_message()}</span>
                <button onclick={pay_lnurlw}>withdraw</button>
                <button onclick={cancel_invoice}>cancel</button>
             </div>
         </Show>
      </section>
  );
}

export default Pay;
