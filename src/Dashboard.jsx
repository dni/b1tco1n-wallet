import { createEffect } from "solid-js"
import logo from './assets/logo.svg';
import styles from './App.module.css';

import {
    access_token,
    login,
    user,
    username,
    usr,
    lnurlp,
    lnurlw,
    wallet_id,
    api_key,
    balance,
    tpos,
    setTpos,
    setBalance,
    setUsr,
    setApiKey,
    setWalletId,
    setPayments,
    setUsername,
    setLnurlp,
    setLnurlw,
} from './signals';

import Settings from "./Settings";
// import Bookmarks from "./Bookmarks";
import Logout from "./Logout";
import Paylinks from "./Paylinks";
import Pay from "./Pay";
import Create from "./Create";
import Tpos from "./Tpos";

const lnaddress = () => username() + "@b1tco1n.org";
const lnaddress_href = () => "lightning:" + lnaddress();
const email_href = () => "mailto:" + lnaddress();
const website = () => username() + ".b1tco1n.org";
const website_href = () => "https://" + website();

const get_balance = () => balance() ? balance().toLocaleString() : 0;

function Dashboard() {

  createEffect(() => {
      let data = user();
      setUsername(data.username);
      setUsr(data.usr); setWalletId(data.wallet_id); setApiKey(data.api_key);
      setLnurlp(data.lnurlp);
      setLnurlw(data.lnurlw);
      setTpos(data.tpos);
      setBalance(data.balance);
      setPayments(data.payments);
  });

  return (
    <section id="dashboard" class={ login() === true ? "active" : "" } >
       <section id="user-info">
            <img src={logo} class={styles.logo} alt="logo" />
            <div className="user-info-content">
                <h2>welcome {username}!</h2>
                <p>
                    Email Address: <a href={email_href()}>{lnaddress}</a>
                    <br />
                    Lightning Address: <a href={lnaddress_href()}>{lnaddress}</a>
                    <br />
                    Website: <a href={website_href()}>{website}</a>
                </p>
            </div>
        </section>
        <nav>
            <Tpos />
            <Settings />
            <Logout />
        </nav>
        <section id="balance-section">
            <h1 id="balance"><span id="sats">{get_balance()}</span> sats</h1>
        </section>
        <Pay />
        <Create />
        <Paylinks />
    </section>
  );
}

export default Dashboard;
