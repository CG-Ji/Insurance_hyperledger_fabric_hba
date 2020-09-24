/*!

=========================================================
* Argon Design System React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-design-system-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-design-system-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "assets/vendor/nucleo/css/nucleo.css";
import "assets/vendor/font-awesome/css/font-awesome.min.css";
import "assets/scss/argon-design-system-react.scss?v1.1.0";

import Index from "views/Index.js";
import Landing from "views/examples/Landing.js";
import Profile from "views/examples/Profile.js";
import Customer from "views/covidins/Customer.js";
import Insurance from "views/covidins/Insurance.js";
import Hospital from "views/covidins/Hospital.js";
import Login from "views/covidins/Login.js";
import Register from "views/covidins/Register.js";
import History from "views/covidins/History.js";

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/" exact render={props => <Index {...props} />} />
      <Route path="/customer-page" exact render={props => <Login {...props} />} />
      <Route path="/customer-page/shop/:username" exact render={props => <Customer {...props} />} />
      <Route path="/customer-page/register" exact render={props => <Register {...props} />} />
      <Route path="/insurance-page" exact render={props => <Insurance {...props} />} />
      <Route path="/hospital-page" exact render={props => <Hospital {...props} />} />
      <Route path="/history-page" exact render={props => <History {...props} />} />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
