import {
    setLogin,
    setShowlogin,
    setPayments,
    payments,
    setBalance,
    balance,
    setUser,
    setErrorMessage,
    setSuccessMessage,
    user,
    error_message,
    setInvoice,
} from "./signals"

import {
    amount,
    setDecodedLnurl,
    setDecodedInvoice,
} from "./Pay"

import log from 'loglevel';
import {
    ws_url,
    api_url,
    debug,
} from "./config"

log.setLevel(debug ? 5 : 3);

import {
    setNewInvoice,
} from "./Create"

export const startInterval = (cb) => {
  cb();
  return setInterval(cb, 10000);
};

export const fetcher = (url, cb, json = true, params = null) => {
  let opts = {
      // needed for cookies to work
      credentials: 'include',
  };
  if (params) {
      opts.method = 'POST';
      if (json) {
          // json request for api
          opts.headers = {
            "Content-Type": 'application/json',
          };
          opts.body = JSON.stringify(params)
      } else {
          // form request for login
          let data = new FormData();
          Object.keys(params).forEach((key) => {
              data.append(key, params[key]);
          });
          opts.body = data
      }
  }
  fetch(api_url+url, opts)
    .then(async response => {
      if (response.status === 401) {
        throw new Error(`unauthorized`);
      }
      if (!response.ok) {
        let json = {};
        try {
          json = await response.json();
        } catch {
          throw new Error(`could not parse response json`);
        }
        let details = "";
        if (Array.isArray(json.detail)) {
          let validation_errors = json.detail.map(e => e.loc[1] + ": " + e.msg);
          details = validation_errors.join("\n");
        } else {
          details = json.detail;
        }
        throw new Error(`${details}`);
      }
      const json = await response.json();
      return json;
    })
    .then(cb)
    .catch((error) => {
        log.error(error);
        setErrorMessage(error.toString());
    });
};

export const is_online = (cb) => {
    fetch(api_url)
        .then(async response => {
            const data = await response.json();
            const is_on = data.status === "OK"
            cb(is_on);
        })
        .catch(async error => {
            cb(false);
        });
};


export const notify = (title, body, icon) => {
  if (!icon) icon = '/assets/favicon.ico';
  if (!("Notification" in window)) {
    // Check if the browser supports notifications
    alert("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
    // Check whether notification permissions have already been granted;
    // if so, create a notification
    const notification = new Notification(title, {body: body, icon: icon});
    // …
  } else if (Notification.permission !== "denied") {
    // We need to ask the user for permission
    Notification.requestPermission().then((permission) => {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        const notification = new Notification(title, {body: body, icon: icon});
      }
    });
  }
}

export const setCookie = (name,value,days) => {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
};

export const getCookie = (name) => {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
};

export const deleteCookie = (name) => {
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

export const clipboard_write = (text) => {
    if('clipboard' in navigator) {
        navigator.clipboard.writeText(text).then(function() {
          // notify("Clipboard", "Copied to clipboard");
        }, function(err) {
          notify("Clipboard", "Error copying to clipboard");
        });
    }
}

export const clipboard_read = (cb) => {
  if('clipboard' in navigator) {
    navigator.clipboard.readText().then(cb);
  }
}


// enum
const WebSocketAction = {
    user: "user",
    pay: "pay",
    invoice: "invoice",
    create_invoice: "create_invoice",
    payment_received: "payment_received",
    error: "error",
    lnurl: "lnurl",
    lnurl_success: "lnurl_success",
    ping: "ping",
    pong: "pong",
    hello: "hello",
};

export class WebSocketService {
    constructor() {
        this.ws = new WebSocket(ws_url);
        this.ws.onerror = this.onerror;
        this.ws.onopen = this.onopen;
        this.ws.onmessage = this.onmessage;
        this.ws.onclose = this.onclose;
    }
    send(params) {
        this.ws.send(JSON.stringify(params));
    }
    onerror(event) {
        setLogin(false)
        setShowlogin(true)
    }
    onclose(event) {
        setLogin(false)
        setShowlogin(true)
    }
    onopen(event) {
        this.send(JSON.stringify({"type": WebSocketAction.user}));
    }
    onmessage(event) {
        let data = JSON.parse(event.data);
        log.debug(data);
        if (data.type == WebSocketAction.user) {
           setLogin(true)
           setUser(data.data);
        }
        if (data.type == WebSocketAction.payment_received) {
            let amount = data.data.amount / 1000;
            let new_balance = balance() + amount;
            notify("payment received!", `${amount} sats\npayment_hash: ` + data.data.payment_hash);
            setBalance(new_balance);
            let pays = payments();
            pays.unshift(data.data)
            setPayments(pays);
        }

        if (data.type == WebSocketAction.pay) {
            let msg = "invoice paid";
            setSuccessMessage(msg);
            setBalance(balance() - amount());
            notify(msg, `${parseInt(amount())} sats\npayment_hash: ` + data.data.payment_hash);
            setInvoice("");
        }
        if (data.type == WebSocketAction.lnurl_success) {
            let new_balance = 0;
            if (data.data.message == "withdrawn") {
                new_balance = balance() + parseInt(amount());
            } else {
                new_balance = balance() - parseInt(amount());
            }
            setBalance(new_balance);
            setSuccessMessage(data.data.message);
            notify(data.data.message, `${parseInt(amount())} sats\npayment_hash: ` + data.data.payment_hash);
            setInvoice("");
        }
        if (data.type == WebSocketAction.invoice) {
            setDecodedInvoice(data.data);
        }
        if (data.type == WebSocketAction.create_invoice) {
            setNewInvoice(data.data.invoice);
        }
        if (data.type == WebSocketAction.error) {
            setErrorMessage(data.message);
            log.error(data.type, data.message);
        }
        if (data.type == WebSocketAction.lnurl) {
            setDecodedLnurl(data.data);
        }
        if (data && data.type == WebSocketAction.ping) {
           this.send({"type": WebSocketAction.pong});
        }
        if (data && data.type == WebSocketAction.pong) {
           log.debug("received pong!!!");
        }
    }
};


export default fetcher;
