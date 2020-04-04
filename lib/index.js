import { isObject } from './utils.js';
import Store from './store.js';

function createStore(reducerFn, initialState, enhancer) {
    let store;

    if (typeof initialState === 'function' && typeof enhancer === "undefined") {
        enhancer = initialState;
        initialState = undefined;
    }

    if (typeof enhancer !== undefined && typeof enhancer === "function") {
        store = enhancer(createStore)(reducerFn, initialState);
    } else {
        store = new Store(reducerFn, initialState);
    }

    return store;
}

function combineReducers(reducersObj) {
    const combinedReducer = (state, action) => {
        for (let key of Object.keys(reducersObj)) {
            if (!isObject(state)) {
                state = {};
            }

            state[key] = reducersObj[key](state[key], action);
        }

        return state;
    }

    return combinedReducer;
}

function compose(...funcs) {
    if (funcs.length === 0) {
        return (arg) => arg;
    }

    if (funcs.length === 1) {
        return funcs[0];
    }

    return funcs.reduce((a, b) => (...args) => a(b(...args)));
}

function applyMiddleware(...middlewares) {
    return createStore => (reducerFn, ...args) => {
        const store = createStore(reducerFn, ...args);

        let dispatch;

        const middlewareAPI = {
            getState: store.getState,
            dispatch: (action, ...args) => dispatch(action, ...args)
        }

        const middleWaresChain = middlewares.map(middleware => middleware(middlewareAPI));
        dispatch = compose(...middleWaresChain)(store.dispatch);

        return {
            ...store,
            dispatch
        }
    }
}

export {
    createStore,
    combineReducers,
    applyMiddleware,
    compose
}

