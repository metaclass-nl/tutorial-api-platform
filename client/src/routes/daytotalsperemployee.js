import React from 'react';
import { Route } from 'react-router-dom';
import { List, Create, Update, Show } from '../components/daytotalsperemployee/';

export default [
  <Route path="/day_totals_per_employees/create" component={Create} exact key="create" />,
  <Route path="/day_totals_per_employees/edit/:id" component={Update} exact key="update" />,
  <Route path="/day_totals_per_employees/show/:id" component={Show} exact key="show" />,
  <Route path="/day_totals_per_employees/" component={List} exact strict key="list" />
];
