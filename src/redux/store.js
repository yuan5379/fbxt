import { createStore,combineReducers } from 'redux'
import { collapsedReducer } from './recuder/CollapsedReducer'
import { LoadingReducer } from './recuder/LoadingReducer'

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['collapsedReducer']
}

const reducer = combineReducers({
    collapsedReducer,
    LoadingReducer
})

  const persistedReducer = persistReducer(persistConfig, reducer)
const store = createStore(persistedReducer)
const persiststore = persistStore(store)
export  {
    store,
    persiststore
}