import { createStore, combineReducers, applyMiddleware } from '../src/index.js';

// counter and colorChanger reducers

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

// creation of combinedReducer from counter and colorChanger reducers

const appReducer = combineReducers({
    counter,
    colorChanger
});

// creation store with app reducer, initial (preloaded) state and enhancer applyMiddleware

let store = createStore(appReducer, { counter: 10 }, applyMiddleware(thanksSayer, bitteSager));

// initial state
console.log('Initital state', store.getState());
console.log("-------------------------------");

// creation of two subscribers to liaten to the store

const subscriber1 = store.subscribe(() => console.log('subscriber1 state', store.getState()))
const subscriber2 = store.subscribe(() => console.log('subscriber2 state', store.getState()))

// started dispatching of actions to which subscribers are subscribed
store.dispatch({ type: 'INCREMENT' })
console.log("-------------------------------");

store.dispatch({ type: 'INCREMENT' })
console.log("-------------------------------");

// example of unsubscrube method to stop listen to the store

subscriber1.unsubscribe(); 
console.log('subscriber1 is unsubscribed');
console.log("-------------------------------");

store.dispatch({ type: 'DECREMENT' })
console.log("-------------------------------");

store.dispatch({ type: 'SECONDARY' })
console.log("-------------------------------");

// applied middlewares

function thanksSayer({ getState }) {
    return next => action => {
        console.log('Thanks Middleware will dispatch', action);

        // call the next dispatch method in the middleware chain
        const returnedValue = next(action);

        console.log('Thanks Middleware state after dispatch', getState());

        return returnedValue;
    }
}

function bitteSager({ getState }) {
    return next => action => {
        console.log('Bitte Middleware will dispatch', action);

        // call the next dispatch method in the middleware chain
        const returnedValue = next(action);

        console.log('Bitte Middleware state after dispatch', getState());

        return returnedValue;
    }
}