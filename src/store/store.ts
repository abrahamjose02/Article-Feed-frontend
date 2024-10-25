import { configureStore } from "@reduxjs/toolkit";
import { persistReducer,persistStore } from "redux-persist";
import userReducer from './userSlice'
import storage from "redux-persist/lib/storage";


const persistConfig = {
    key:'root',
    storage,
}

const persistedReducer = persistReducer(persistConfig,userReducer)

const store = configureStore({
    reducer:{
        user:persistedReducer,
    },
})

export const persistor = persistStore(store)


export default store;