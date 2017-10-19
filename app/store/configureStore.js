'use strict';

import {
    createStore,
    applyMiddleware,
    compose
} from 'redux';
import thunk from 'redux-thunk';
import reducers from '../reducers/index';

const middlewares = [thunk];
const createLogger = require('redux-logger');

if (process.env.NODE_ENV === 'development') {
    const logger = createLogger();
    middlewares.push(logger);
}

const finalCreateStore = compose(
    applyMiddleware(...middlewares)
)(createStore);

export default function configureStore(initialState) {
    // store.dispatch() is override, call store.dispatch(action) will also call all middlewares.
    const store = finalCreateStore(reducers, initialState);
    return store;
}
