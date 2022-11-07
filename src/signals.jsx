import { createSignal } from "solid-js";

export const [login, setLogin] = createSignal(false);
export const [user, setUser] = createSignal({});
export const [username, setUsername] = createSignal("");
export const [password, setPassword] = createSignal("");
export const [password_repeat, setPasswordRepeat] = createSignal("");
export const [access_token, setAccessToken] = createSignal("");

export const [error_message, setErrorMessage] = createSignal("");
export const [success_message, setSuccessMessage] = createSignal("");

export const [balance, setBalance] = createSignal(0);
export const [usr, setUsr] = createSignal("");
export const [wallet_id, setWalletId] = createSignal("");
export const [api_key, setApiKey] = createSignal("");
export const [tpos, setTpos] = createSignal("");
export const [lnurlp, setLnurlp] = createSignal("");
export const [lnurlw, setLnurlw] = createSignal("");
export const [payments, setPayments] = createSignal([]);
export const [invoice, setInvoice] = createSignal("");

export const [showlogin, setShowlogin] = createSignal(false);
export const [showsignup, setShowsignup] = createSignal(false);
export const [showsettings, setShowsettings] = createSignal(false);

export const [services, setServices] = createSignal([]);

export const [camera, setCamera] = createSignal(false);
