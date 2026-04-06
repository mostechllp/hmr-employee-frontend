import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addLeaveRequest } from '../store/slices/leavesSlice';
import { FiChevronRight, FiCalendar, FiTag, FiMessageSquare, FiPaperclip, FiSend, FiX } from 'react-icons/fi';
import { MdCalculate } from 'react-icons/md';

const RequestLeave = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { leaveBalances } = useAppSelector((state) => state.leaves);
  const [formData, setFormData] = useState({
    fromDate: '',
    toDate: '',
    leaveType: 'Annual Leave',
    reason: '',
  });
  const [totalDays, setTotalDays] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    calculateDays();
  }, [formData.fromDate, formData.toDate]);
  
  const calculateDays = () => {
    if (formData.fromDate && formData.toDate) {
      const from = new Date(formData.fromDate);
      const to = new Date(formData.toDate);
      if (to >= from) {
        const days = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;
        setTotalDays(days);
      } else {
        setTotalDays(0);
      }
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.fromDate || !formData.toDate) {
      alert('Please select dates');
      return;
    }
    
    if (totalDays <= 0) {
      alert('Please select valid dates');
      return;
    }
    
    if (formData.reason.length < 10) {
      alert('Please provide a reason (minimum 10 characters)');
      return;
    }
    
    const from = new Date(formData.fromDate).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
    const to = new Date(formData.toDate).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
    
    const newRequest = {
      id: Date.now(),
      type: formData.leaveType,
      fromDate: from,
      toDate: to,
      days: totalDays,
      claimSalary: "Yes",
      document: selectedFile ? selectedFile.name : "-",
      status: "Pending",
      remark: formData.reason,
    };
    
    dispatch(addLeaveRequest(newRequest));
    navigate('/leaves');
  };
  
  const currentBalance = leaveBalances[formData.leaveType];
  const remaining = currentBalance 
    ? currentBalance.allocated - (currentBalance.taken + currentBalance.pending) 
    : 0;
  
  return (
    <div>
      {/* Breadcrumbs */}
      <div className="breadcrumbs flex items-center gap-2 text-sm mb-6">
        <Link to="/dashboard" className="text-green-500 hover:underline">Dashboard</Link>
        <FiChevronRight className="text-xs text-[var(--muted)]" />
        <Link to="/leaves" className="text-green-500 hover:underline">My Leaves</Link>
        <FiChevronRight className="text-xs text-[var(--muted)]" />
        <span className="text-[var(--muted)]">Request Leave</span>
      </div>
      
      <div className="page-header mb-7">
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[var(--text)] to-green-600 bg-clip-text text-transparent flex items-center gap-2">
          <FiCalendar /> Leave Application Form
        </h2>
      </div>
      
      <div className="split-container grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-7">
        {/* Form */}
        <div className="form-container bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 md:p-8 shadow-sm">
          <form onSubmit={handleSubmit}>
            <div className="form-section-title text-lg font-bold text-green-600 mb-6 pb-3 border-b-2 border-green-100 flex items-center gap-2.5">
              <FiTag /> Leave Details
            </div>
            <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <div className="form-field flex flex-col gap-2">
                <label className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1">
                  <FiCalendar className="text-green-500" /> From Date <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="date"
                  value={formData.fromDate}
                  onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                  className="py-3 px-3.5 bg-[var(--surface2)] border border-[var(--border)] rounded-lg text-sm text-[var(--text)] focus:outline-none focus:border-green-500 focus:shadow-[0_0_0_3px_rgba(46,204,113,0.12)] transition-all"
                />
              </div>
              <div className="form-field flex flex-col gap-2">
                <label className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1">
                  <FiCalendar className="text-green-500" /> To Date <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="date"
                  value={formData.toDate}
                  onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                  className="py-3 px-3.5 bg-[var(--surface2)] border border-[var(--border)] rounded-lg text-sm text-[var(--text)] focus:outline-none focus:border-green-500 focus:shadow-[0_0_0_3px_rgba(46,204,113,0.12)] transition-all"
                />
              </div>
              <div className="form-field flex flex-col gap-2">
                <label className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1">
                  <FiTag className="text-green-500" /> Leave Type <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  value={formData.leaveType}
                  onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                  className="py-3 px-3.5 bg-[var(--surface2)] border border-[var(--border)] rounded-lg text-sm text-[var(--text)] focus:outline-none focus:border-green-500 focus:shadow-[0_0_0_3px_rgba(46,204,113,0.12)] transition-all"
                >
                  <option value="Annual Leave">Annual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Emergency Leave">Emergency Leave</option>
                </select>
              </div>
              <div className="form-field flex flex-col gap-2">
                <label className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1">
                  <MdCalculate className="text-green-500" /> Total Days
                </label>
                <div className="total-days-box bg-green-500/10 p-3 rounded-lg text-center">
                  <span className="text-2xl md:text-3xl font-extrabold text-green-600 block">{totalDays}</span>
                  <small>Days</small>
                </div>
              </div>
              <div className="form-field md:col-span-2 flex flex-col gap-2">
                <label className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1">
                  <FiMessageSquare className="text-green-500" /> Reason for Leave <span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows="4"
                  placeholder="Please describe your reason for requesting leave (min 10 characters)..."
                  className="py-3 px-3.5 bg-[var(--surface2)] border border-[var(--border)] rounded-lg text-sm text-[var(--text)] focus:outline-none focus:border-green-500 focus:shadow-[0_0_0_3px_rgba(46,204,113,0.12)] transition-all resize-none"
                />
                <small className={`text-[11px] ${formData.reason.length >= 10 ? 'text-green-500' : 'text-red-500'}`}>
                  {formData.reason.length}/10 characters
                </small>
              </div>
              <div className="form-field md:col-span-2 flex flex-col gap-2">
                <label className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1">
                  <FiPaperclip className="text-green-500" /> Supporting Document (Optional)
                </label>
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  className="py-2.5 px-3.5 bg-[var(--surface2)] border border-[var(--border)] rounded-lg text-sm text-[var(--text)] file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-green-500 file:text-white file:cursor-pointer hover:file:bg-green-600"
                />
                <small className="text-[11px] text-[var(--muted)]">Max size: 5MB. Allowed formats: PDF, DOC, DOCX, JPG, PNG</small>
              </div>
            </div>
            
            <div className="form-actions flex flex-col sm:flex-row justify-end gap-4 mt-8 pt-6 border-t border-[var(--border)]">
              <Link to="/leaves" className="cancel-btn py-3 px-7 rounded-full font-semibold text-center bg-transparent border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface2)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                <FiX /> Cancel
              </Link>
              <button type="submit" className="submit-btn py-3 px-8 rounded-full font-semibold bg-green-500 text-white hover:bg-green-600 hover:-translate-y-0.5 hover:shadow-md transition-all flex items-center justify-center gap-2">
                <FiSend /> Submit Request
              </button>
            </div>
          </form>
        </div>
        
        {/* Balance Card */}
        <div className="balance-card bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 shadow-sm sticky top-24">
          <div className="balance-header text-center pb-5 border-b border-[var(--border)] mb-5">
            <h3 className="text-lg font-bold text-[var(--text)]">Leave Balance</h3>
            <p className="text-xs text-[var(--muted)] mt-1">Current allocation for 2026</p>
          </div>
          
          <div className="balance-remaining text-center mb-6">
            <div className="remaining-number text-4xl md:text-5xl font-extrabold text-green-600">{remaining}</div>
            <div className="remaining-label text-xs text-[var(--muted)] mt-2">Days Remaining</div>
          </div>
          
          <div className="balance-stats flex gap-4 mb-6">
            <div className="balance-stat flex-1 text-center p-3 bg-[var(--surface2)] rounded-lg">
              <div className="stat-value text-xl font-bold text-[var(--text)]">{currentBalance?.allocated || 0}</div>
              <div className="stat-label text-[10px] text-[var(--muted)] mt-1">Allocated</div>
            </div>
            <div className="balance-stat flex-1 text-center p-3 bg-[var(--surface2)] rounded-lg">
              <div className="stat-value text-xl font-bold text-[var(--text)]">{currentBalance?.taken + currentBalance?.pending || 0}</div>
              <div className="stat-label text-[10px] text-[var(--muted)] mt-1">Taken / Pending</div>
            </div>
          </div>
          
          <div className="leave-type-list mt-5">
            {Object.entries(leaveBalances).map(([type, balance]) => (
              <div key={type} className="leave-type-item flex justify-between items-center py-3 border-b border-[var(--border)]">
                <span className="leave-type-name text-xs font-medium text-[var(--text-secondary)] flex items-center gap-2">
                  {type === 'Annual Leave' && <FiCalendar className="text-green-500" />}
                  {type === 'Sick Leave' && <FiMessageSquare className="text-blue-500" />}
                  {type === 'Emergency Leave' && <FiMessageSquare className="text-amber-500" />}
                  {type}
                </span>
                <span className="leave-type-days text-sm font-bold text-[var(--text)]">
                  {balance.allocated - (balance.taken + balance.pending)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestLeave;