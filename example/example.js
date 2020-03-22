import { createStore, combineReducers, applyMiddleware } from '../src/index';

// reducers

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

// store

let store = createStore(appReducer, { counter: 10 }, applyMiddleware(logger, thanksSayer, bitteSayer));

// subscribers

const subscriber1 = store.subscribe(() => console.log('subscriber1', store.getState()))
const subscriber2 = store.subscribe(() => console.log('subscriber2', store.getState()))

store.dispatch({ type: 'INCREMENT' })

store.dispatch({ type: 'INCREMENT' })

subscriber1.unsubscribe(); 

store.dispatch({ type: 'DECREMENT' })

store.dispatch({ type: 'SECONDARY' })

// middlewares

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