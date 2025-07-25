import { configureStore,applyMiddleware} from '@reduxjs/toolkit';
import ChatReduser from '../Redusers/ChatSlice';
import { thunk } from 'redux-thunk';

const store = configureStore({
    reducer: {
      ChatReduser,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(thunk),
});

// Define RootState type based on the store's state
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export the store for use in your app
export default store;

