import { isObject, generateRandomType } from './utils';

class Store {
    constructor(reducerFn, initialState) {
        this.subscribers = [];
        this.reducerFn = reducerFn;
        this.state = isObject(initialState) ? { ...initialState } : initialState;
        this.dispatch({ type: generateRandomType() });
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

export default Store;