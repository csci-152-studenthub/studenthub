import React from "react";
import { Route, Switch } from "react-router-dom";
import SignIn from "./components/pages/auth/SignIn";
import Exception from './Exception';
import Test from './Test';

export default () =>
  <Switch>
    <Route path="/" exact component={SignIn} />
    <Route path="/signed-in" exact component={Test} />
    <Route path="*" exact component={Exception} />
  </Switch>;
