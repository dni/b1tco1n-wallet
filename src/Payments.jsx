import { createEffect } from "solid-js"
import { payments } from "./signals"

const get_amount = (amount) => (amount / 1000).toLocaleString();

const get_class = (payment) => {
    let classes = payment.pending ? "pending " : "";
    classes += payment.amount > 0 ? "receive" : "sent";
    return classes;
};
const get_date = (timestamp) => {
    let date = new Date(timestamp * 1000);
    return date.toLocaleString();
};

function Payments() {
  return (
      <section id="payments">
       <h3>payments</h3>
       <ul id="payment-list">
          <For each={payments()} fallback={<div>no payments</div>}>
              {(payment, index) => (
                 <li class={get_class(payment)} key={index()}>
                  <span className="amount">{get_amount(payment.amount)} sats</span>
                  {payment.pending ? "pending " : ""}
                  <span class="date">{get_date(payment.time)}</span>
                  <span className="memo">{payment.memo}</span>
                 </li>
              )}
          </For>
       </ul>
      </section>
  );
}

export default Payments;
