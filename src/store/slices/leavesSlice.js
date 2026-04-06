import { createSlice } from '@reduxjs/toolkit';

const loadLeavesFromStorage = () => {
  const saved = localStorage.getItem('employeeLeaveRequests');
  if (saved) return JSON.parse(saved);
  return [
    {
      id: 1,
      type: "Annual Leave",
      fromDate: "01 Apr 2026",
      toDate: "30 Apr 2026",
      days: 30,
      claimSalary: "Yes",
      document: "-",
      status: "Approved",
      remark: "approved"
    },
    {
      id: 2,
      type: "Sick Leave",
      fromDate: "10 Apr 2026",
      toDate: "12 Apr 2026",
      days: 3,
      claimSalary: "Yes",
      document: "medical.pdf",
      status: "Approved",
      remark: "Fever"
    },
    {
      id: 3,
      type: "Emergency Leave",
      fromDate: "15 Apr 2026",
      toDate: "16 Apr 2026",
      days: 2,
      claimSalary: "No",
      document: "-",
      status: "Rejected",
      remark: "Insufficient documents"
    },
    {
      id: 4,
      type: "Annual Leave",
      fromDate: "20 May 2026",
      toDate: "25 May 2026",
      days: 6,
      claimSalary: "Yes",
      document: "-",
      status: "Pending",
      remark: "Vacation"
    }
  ];
};

const initialState = {
  leaves: loadLeavesFromStorage(),
  leaveBalances: {
    'Annual Leave': { allocated: 30, taken: 18, pending: 2 },
    'Sick Leave': { allocated: 15, taken: 5, pending: 0 },
    'Emergency Leave': { allocated: 5, taken: 0, pending: 0 },
  },
  filter: {
    status: 'all',
    search: '',
  },
  pagination: {
    currentPage: 1,
    perPage: 10,
  },
};

const leavesSlice = createSlice({
  name: 'leaves',
  initialState,
  reducers: {
    addLeaveRequest: (state, action) => {
      state.leaves.unshift(action.payload);
      localStorage.setItem('employeeLeaveRequests', JSON.stringify(state.leaves));
      
      // Update balance
      const leave = action.payload;
      const balance = state.leaveBalances[leave.type];
      if (balance && leave.status === 'Pending') {
        balance.pending += leave.days;
      }
    },
    updateLeaveStatus: (state, action) => {
      const { id, status } = action.payload;
      const leave = state.leaves.find(l => l.id === id);
      if (leave) {
        const oldStatus = leave.status;
        leave.status = status;
        
        // Update balance
        const balance = state.leaveBalances[leave.type];
        if (balance) {
          if (oldStatus === 'Pending' && status === 'Approved') {
            balance.pending -= leave.days;
            balance.taken += leave.days;
          } else if (oldStatus === 'Pending' && status === 'Rejected') {
            balance.pending -= leave.days;
          }
        }
        
        localStorage.setItem('employeeLeaveRequests', JSON.stringify(state.leaves));
      }
    },
    setLeaveFilter: (state, action) => {
      state.filter.status = action.payload.status;
      state.filter.search = action.payload.search || '';
      state.pagination.currentPage = 1;
    },
    setLeavePagination: (state, action) => {
      state.pagination.currentPage = action.payload.currentPage;
      state.pagination.perPage = action.payload.perPage;
    },
  },
});

export const { addLeaveRequest, updateLeaveStatus, setLeaveFilter, setLeavePagination } = leavesSlice.actions;
export default leavesSlice.reducer;