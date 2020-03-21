function _generateRandomType () {
    const randomString = Math.random().toString(36);
    const randomType = `DUMMY_INITIALIZER${randomString}`
    return randomType;
}

function _isObject(obj) {
    const isArray = Array.isArray(obj);
    const isObjectType = typeof obj === 'object';
    const isNull = obj === null;

    return isObjectType && !isArray && !isNull;
}

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
            if (!_isObject(state)) {
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
        dispatch = _compose(...middleWaresChain)(store.dispatch);

        return {
            ...store,
            dispatch
        }
    }
}

class Store {
    constructor(reducerFn, initialState) {
        this.subscribers = [];
        this.reducerFn = reducerFn;
        this.state = _isObject(initialState) ? { ...initialState } : initialState;
        this.dispatch({ type: _generateRandomType() });
    }

    subscribe = (callbackFn) => {
        this.subscribers.push(callbackFn);
        return { unsubscribe: () => { this.subscribers = this.subscribers.filter(fn => fn !== callbackFn) } }
    };

    dispatch = (actionObj) => {
        this.state = this.reducerFn(this.state, actionObj);
        this.subscribers.forEach(subscriber => {
            subscriber();
        });
        return actionObj;
    }

    getState = () => {
        return this.state;
    }
}

function counter(state = 0, action) {
    switch (action.type) {
        case 'INCREMENT':
            return state + 1
        case 'DECREMENT':
            return state - 1
        default:
            return state
    }
}

function colorChanger(state = 'black', action) {
    switch (action.type) {
        case 'MAIN':
            return 'blue'
        case 'SECONDARY':
            return 'darkblue'
        default:
            return state
    }
}

const appReducer = combineReducers({
    counter,
    colorChanger
});

let store = createStore(appReducer, { counter: 10 }, applyMiddleware(logger, thanksSayer, bitteSayer));

// const subscriber1 = store.subscribe(() => console.log('subscriber1', store.getState()))
// const subscriber2 = store.subscribe(() => console.log('subscriber2', store.getState()))

store.dispatch({ type: 'INCREMENT' })

store.dispatch({ type: 'INCREMENT' })

// subscriber1.unsubscribe(); 

store.dispatch({ type: 'DECREMENT' })

store.dispatch({ type: 'SECONDARY' })


function logger({ getState }) {
    return next => action => {
        console.log('Logger will dispatch', action);

        // Call the next dispatch method in the middleware chain.
        const returnValue = next(action);

        console.log('Logger state after dispatch', getState());

        console.log('-------------------------');

        // This will likely be the action itself, unless
        // a middleware further in chain changed it.
        return returnValue;
    }
}

function thanksSayer({ getState }) {
    return next => action => {
        console.log('Thanks will dispatch', action);

        // Call the next dispatch method in the middleware chain.
        const returnValue = next(action);

        console.log('Thanks state after dispatch', getState());

        // This will likely be the action itself, unless
        // a middleware further in chain changed it.
        return returnValue;
    }
}

function bitteSayer({ getState }) {
    return next => action => {
        console.log('Bitte will dispatch', action);

        // Call the next dispatch method in the middleware chain.
        const returnValue = next(action);

        console.log('Bitte state after dispatch', getState());

        // This will likely be the action itself, unless
        // a middleware further in chain changed it.
        return returnValue;
    }
}

export {
    createStore,
    combinedReducers,
    applyMiddleware,
    compose
}

