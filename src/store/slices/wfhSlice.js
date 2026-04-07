import { createSlice } from '@reduxjs/toolkit';

const loadWFHFromStorage = () => {
  const saved = localStorage.getItem('employeeWFHRequests');
  if (saved) return JSON.parse(saved);
  return [
    {
      id: 1,
      date: "31 Mar 2026",
      reason: "Need to focus on development work without interruptions",
      notes: "Will be available on Slack and email",
      status: "Approved"
    },
    {
      id: 2,
      date: "28 Mar 2026",
      reason: "Internet connectivity issues at office",
      notes: "Working from home until issue resolved",
      status: "Approved"
    },
    {
      id: 3,
      date: "25 Mar 2026",
      reason: "Personal work at home",
      notes: "Will join all meetings virtually",
      status: "Pending"
    },
    {
      id: 4,
      date: "20 Mar 2026",
      reason: "Sick - not feeling well to travel",
      notes: "Resting but available for urgent tasks",
      status: "Rejected"
    }
  ];
};

const initialState = {
  wfhRequests: loadWFHFromStorage(),
  filter: {
    status: 'all',
    search: '',
  },
  pagination: {
    currentPage: 1,
    perPage: 10,
  },
};

const wfhSlice = createSlice({
  name: 'wfh',
  initialState,
  reducers: {
    addWFHRequest: (state, action) => {
      state.wfhRequests.unshift(action.payload);
      localStorage.setItem('employeeWFHRequests', JSON.stringify(state.wfhRequests));
    },
    updateWFHStatus: (state, action) => {
      const { id, status } = action.payload;
      const request = state.wfhRequests.find(r => r.id === id);
      if (request) {
        request.status = status;
        localStorage.setItem('employeeWFHRequests', JSON.stringify(state.wfhRequests));
      }
    },
    setWFHFilter: (state, action) => {
      state.filter.status = action.payload.status;
      state.filter.search = action.payload.search || '';
      state.pagination.currentPage = 1;
    },
    setWFHPagination: (state, action) => {
      state.pagination.currentPage = action.payload.currentPage;
      state.pagination.perPage = action.payload.perPage;
    },
  },
});

export const { addWFHRequest, updateWFHStatus, setWFHFilter, setWFHPagination } = wfhSlice.actions;
export default wfhSlice.reducer;