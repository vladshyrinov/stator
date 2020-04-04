# Redux-Stator

It is a lightweight version of Redux library

## API

### createStore

##### parameters
- reducer function
- initial state (conditional)
- enhancer (conditional)
##### functionality
creates Store class instance to manage application state

### combineReducers

##### parameters
- reducers object
##### functionality
combines multiple reducers into one

### compose

##### parameters
- functions to compose
##### functionality
helps to compose functions to have needed call order, can be used for creation own enhancers for Store

### applyMiddleware

##### parameters
- middlewares
##### functionality
applies middlewares that will be called between action dispatch and state changes

## Usage
see [example](example)
