import React from "react";
import { Route } from "react-router-dom";
import { List, Create, Update, Show } from "../components/hours/";

export default [
  <Route path="/hours/create" component={Create} exact key="create" />,
  <Route path="/hours/edit/:id" component={Update} exact key="update" />,
  <Route path="/hours/show/:id" component={Show} exact key="show" />,
  <Route path="/hours/" component={List} exact strict key="list" />,
  <Route path="/hours/:page" component={List} exact strict key="page" />,
];
