import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import leavesReducer from './slices/leavesSlice';
import tasksReducer from './slices/tasksSlice';
import notesReducer from './slices/notesSlice';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    leaves: leavesReducer,
    tasks: tasksReducer,
    notes: notesReducer,
    theme: themeReducer,
  },
});