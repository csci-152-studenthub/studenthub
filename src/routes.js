import React from "react";
import { Route, Switch } from "react-router-dom";
import SignIn from "./components/pages/auth/SignIn";
import Main from './components/pages/main/Main';
import Exception from './components/pages/exception/Exception';
// import Test from './Test';

export default () =>
  <Switch>
    <Route path="/" exact component={SignIn} />
    <Route path="/home" exact component={Main} />
    <Route path="*" exact component={Exception} />
  </Switch>;
