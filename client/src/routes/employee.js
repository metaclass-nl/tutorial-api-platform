import React from 'react';
import { Route } from 'react-router-dom';
import { List, Create, Update, Show } from '../components/employee/';

export default [
  <Route path="/employees/create" component={Create} exact key="create" />,
  <Route path="/employees/edit/:id" component={Update} exact key="update" />,
  <Route path="/employees/show/:id" component={Show} exact key="show" />,
  <Route path="/employees/" component={List} exact strict key="list" />
];
