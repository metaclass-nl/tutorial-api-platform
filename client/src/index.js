import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { reducer as form } from 'redux-form';
import { Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import {
    ConnectedRouter,
    connectRouter,
    routerMiddleware
} from 'connected-react-router';
import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-free/css/all.css';
import * as serviceWorker from './serviceWorker';
import Navigation from './components/Navigation.js';
import {RawIntlProvider} from 'react-intl';
import getIntl, {initIntl} from './utils/intlProvider';
import messages from "./messages/all";

// Import your reducers and routes here
import Welcome from './Welcome';
import employee from './reducers/employee/';
import employeeRoutes from './routes/employee';
import hours from './reducers/hours/';
import hoursRoutes from './routes/hours';

const history = createBrowserHistory();
const store = createStore(
    combineReducers({
        router: connectRouter(history),
        form,
        /* Add your reducers here */
        employee,
        hours,
    }),
    applyMiddleware(routerMiddleware(history), thunk)
);

initIntl(navigator.language, messages);

ReactDOM.render(
    <RawIntlProvider value={getIntl()}>
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <div>
                    <Navigation/>
                    <div className="mainContainer">
                        <Switch>
                            <Route path="/" component={Welcome} strict={true} exact={true}/>
                                {/* Add your routes here */}
                                {employeeRoutes}
                                {hoursRoutes}
                            <Route render={() => <h1>Not Found</h1>} />
                        </Switch>
                    </div>
                </div>
            </ConnectedRouter>
        </Provider>
    </RawIntlProvider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();