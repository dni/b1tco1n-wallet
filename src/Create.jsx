import {
    success_message,
    setSuccessMessage,
    error_message,
    setErrorMessage,
    invoice,
    setInvoice,
    camera
} from "./signals"

import { qr_url } from "./config"
import { notify, clipboard_write, clipboard_read } from "./helpers"
import { ws } from "./App"
import { createSignal, createEffect } from "solid-js"

export const [amount, setAmount] = createSignal(0);
export const [description, setDescription] = createSignal(0);

export const [show_new_invoice_form, setShowNewInvoiceForm] = createSignal(false);
export const [show_new_invoice, setShowNewInvoice] = createSignal(false);
export const [new_invoice, setNewInvoice] = createSignal("");

const create_invoice = (event) => {
    setErrorMessage("");
    setShowNewInvoiceForm(false);
    ws.send({"type": "create_invoice", "data": {"amount": amount(), "description": description()}})
};

const show_create_invoice = (event) => {
    setShowNewInvoiceForm(true);
};

const cancel_invoice = (event) => {
    setNewInvoice("")
    setShowNewInvoiceForm(false);
    setShowNewInvoice(false);
};

const qr_invoice = () => new_invoice() ? qr_url + new_invoice() : "#";
const copy_invoice = () => clipboard_write(new_invoice());

function Create() {
  createEffect(() => {
      let inv = new_invoice() ? true : false;
      setShowNewInvoice(inv);
  });
  return (
      <section id="create" className={error_message() ? 'error' : ''}>
         <h3>create invoice</h3>
         <Show when={!show_new_invoice_form()}>
             <button onclick={show_create_invoice}>create</button>
         </Show>
         <Show when={show_new_invoice()}>
             <p><img class="qrcode" src={qr_invoice()} alt="invoice qrcode svg" /></p>
             <button onclick={copy_invoice}>copy invoice</button>
             <button onclick={cancel_invoice}>cancel</button>
         </Show>
         <Show when={show_new_invoice_form()}>
             <div className="invoiceform payform">
                <h3>create invoice</h3>
                <label htmlFor="amount">Amount:</label>
                <input placeholder="100" type="number" className="amount" name="amount" onKeyup={(e) => setAmount(parseInt(e.currentTarget.value))} />
                <label htmlFor="comment">Comment: </label>
                <textarea onKeyup={(e) => setDescription(e.currentTarget.value)} placeholder="description..." name="description"></textarea>
                <span className="error">{error_message()}</span>
                <button onclick={create_invoice}>create</button>
                <button onclick={cancel_invoice}>cancel</button>
             </div>
         </Show>
      </section>
  );
}

export default Create;
