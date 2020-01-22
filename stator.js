function createStore(reducerFn) {
    const store = new Store(reducerFn);
    return store;
}

class Store {
    constructor(reducerFn) {
        this.subscribers = [];
        this.reducerFn = reducerFn;
        this.state = this.dispatch({type: 'DUMMY'});
    }
    
    subscribe = (callbackFn) => {
        this.subscribers.push(callbackFn);
        return {unsubscribe: () => { this.subscribers = this.subscribers.filter(fn => fn !== callbackFn)}} 
    };

    dispatch = (actionObj) => {
        this.state = this.reducerFn(this.state, actionObj);
        this.subscribers.forEach(subscriber => {
            subscriber();
        });
    }

    getState = () => {
        return this.state;
    }
}

let store = createStore(counter);

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

const subscriber1 = store.subscribe(() => console.log(store.getState()))

store.dispatch({ type: 'INCREMENT' })

store.dispatch({ type: 'INCREMENT' })

subscriber1.unsubscribe();

store.dispatch({ type: 'DECREMENT' })
  