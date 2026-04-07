import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { addWFHRequest, setWFHFilter, setWFHPagination } from '../store/slices/wfhSlice';
import { FiSearch, FiPlus, FiHome, FiX, FiSend, FiChevronLeft, FiChevronRight, FiCalendar, FiMessageSquare, FiFileText } from 'react-icons/fi';
import StatusBadge from '../components/common/StatusBadge';

const WFH = () => {
  const dispatch = useAppDispatch();
  const { wfhRequests, filter, pagination } = useAppSelector((state) => state.wfh);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    reason: '',
    notes: '',
  });
  const [filteredRequests, setFilteredRequests] = useState([]);

  useEffect(() => {
    let filtered = [...wfhRequests];
    
    if (filter.status !== 'all') {
      filtered = filtered.filter(r => r.status === filter.status);
    }
    
    if (filter.search) {
      filtered = filtered.filter(r => 
        r.reason.toLowerCase().includes(filter.search.toLowerCase()) ||
        r.notes.toLowerCase().includes(filter.search.toLowerCase()) ||
        r.status.toLowerCase().includes(filter.search.toLowerCase())
      );
    }
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilteredRequests(filtered);
  }, [wfhRequests, filter]);
  
  const totalPages = Math.ceil(filteredRequests.length / pagination.perPage);
  const start = (pagination.currentPage - 1) * pagination.perPage;
  const currentRequests = filteredRequests.slice(start, start + pagination.perPage);
  
  const stats = {
    total: wfhRequests.length,
    pending: wfhRequests.filter(r => r.status === 'Pending').length,
    approved: wfhRequests.filter(r => r.status === 'Approved').length,
    rejected: wfhRequests.filter(r => r.status === 'Rejected').length,
  };
  
  const handleStatusFilter = (status) => {
    dispatch(setWFHFilter({ status, search: filter.search }));
  };
  
  const handleSearch = (e) => {
    dispatch(setWFHFilter({ status: filter.status, search: e.target.value }));
  };
  
  const handlePageChange = (page) => {
    dispatch(setWFHPagination({ currentPage: page, perPage: pagination.perPage }));
  };
  
  const handleEntriesChange = (e) => {
    dispatch(setWFHPagination({ currentPage: 1, perPage: parseInt(e.target.value) }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.date) {
      alert('Please select a date');
      return;
    }
    
    if (!formData.reason.trim()) {
      alert('Please provide a reason');
      return;
    }
    
    const formattedDate = new Date(formData.date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    
    const newRequest = {
      id: Date.now(),
      date: formattedDate,
      reason: formData.reason.trim(),
      notes: formData.notes.trim() || '-',
      status: 'Pending',
    };
    
    dispatch(addWFHRequest(newRequest));
    setIsModalOpen(false);
    setFormData({ date: '', reason: '', notes: '' });
  };
  
  return (
    <div>
      {/* Stats Grid */}
      <div className="stats-grid grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mb-7">
        <div className="stat-card bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 md:p-5">
          <div className="stat-header flex justify-between items-center mb-3">
            <div className="stat-icon w-10 h-10 md:w-12 md:h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center text-xl md:text-2xl">
              <FiHome />
            </div>
          </div>
          <div className="stat-number text-2xl md:text-3xl font-extrabold text-purple-600">{stats.total}</div>
          <div className="stat-label text-xs text-[var(--muted)]">Total WFH Requests</div>
        </div>
        <div className="stat-card bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 md:p-5">
          <div className="stat-header flex justify-between items-center mb-3">
            <div className="stat-icon w-10 h-10 md:w-12 md:h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-xl md:text-2xl">
              <FiFileText />
            </div>
          </div>
          <div className="stat-number text-2xl md:text-3xl font-extrabold text-amber-500">{stats.pending}</div>
          <div className="stat-label text-xs text-[var(--muted)]">Pending</div>
        </div>
        <div className="stat-card bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 md:p-5">
          <div className="stat-header flex justify-between items-center mb-3">
            <div className="stat-icon w-10 h-10 md:w-12 md:h-12 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center text-xl md:text-2xl">
              <FiFileText />
            </div>
          </div>
          <div className="stat-number text-2xl md:text-3xl font-extrabold text-green-600">{stats.approved}</div>
          <div className="stat-label text-xs text-[var(--muted)]">Approved</div>
        </div>
        <div className="stat-card bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 md:p-5">
          <div className="stat-header flex justify-between items-center mb-3">
            <div className="stat-icon w-10 h-10 md:w-12 md:h-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center text-xl md:text-2xl">
              <FiFileText />
            </div>
          </div>
          <div className="stat-number text-2xl md:text-3xl font-extrabold text-red-500">{stats.rejected}</div>
          <div className="stat-label text-xs text-[var(--muted)]">Rejected</div>
        </div>
      </div>
      
      <div className="wfh-header flex flex-col md:flex-row justify-between items-start md:items-center gap-5 mb-7">
        <h2 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-[var(--text)] to-green-600 bg-clip-text text-transparent">
          Work From Home Requests
        </h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="request-btn bg-green-500 text-white py-2.5 px-6 rounded-full font-semibold text-sm flex items-center gap-2 hover:bg-green-600 hover:-translate-y-0.5 transition-all"
        >
          <FiPlus /> New Request
        </button>
      </div>
      
      {/* Status Tabs */}
      <div className="status-tabs flex flex-wrap gap-2.5 mb-6 pb-3 border-b border-[var(--border)]">
        {['all', 'Pending', 'Approved', 'Rejected'].map(status => (
          <button
            key={status}
            onClick={() => handleStatusFilter(status)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              filter.status === status.toLowerCase()
                ? 'bg-green-500 text-white'
                : 'bg-[var(--surface2)] text-[var(--text-secondary)] hover:bg-green-100 hover:text-green-600'
            }`}
          >
            {status === 'all' ? 'All Requests' : status}
          </button>
        ))}
      </div>
      
      {/* Action Bar */}
      <div className="files-actions flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
        <div className="entries-select flex items-center gap-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-full px-3.5 py-1.5 text-xs text-[var(--text-secondary)]">
          <span>Show entries</span>
          <select
            value={pagination.perPage}
            onChange={handleEntriesChange}
            className="border-none outline-none bg-transparent font-semibold text-[var(--text)] cursor-pointer"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </div>
        <div className="search-wrapper flex items-center gap-3 flex-wrap">
          <div className="search-box flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] rounded-full px-3.5 py-2">
            <FiSearch className="text-[var(--muted)] text-xs" />
            <input
              type="text"
              value={filter.search}
              onChange={handleSearch}
              placeholder="Search records..."
              className="border-none outline-none bg-transparent text-xs text-[var(--text)] w-36 sm:w-44"
            />
          </div>
        </div>
      </div>
      
      {/* Table */}
      <div className="wfh-table-wrapper bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-x-auto shadow-sm">
        <table className="wfh-table w-full border-collapse text-xs min-w-[800px]">
          <thead>
            <tr>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted)] bg-[var(--surface2)] border-b border-[var(--border)]">#</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted)] bg-[var(--surface2)] border-b border-[var(--border)]">Date</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted)] bg-[var(--surface2)] border-b border-[var(--border)]">Reason</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted)] bg-[var(--surface2)] border-b border-[var(--border)]">Notes</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted)] bg-[var(--surface2)] border-b border-[var(--border)]">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentRequests.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-[var(--muted)]">
                  No WFH requests found
                </td>
              </tr>
            ) : (
              currentRequests.map((request, idx) => (
                <tr key={request.id} className="hover:bg-[var(--surface2)] transition-colors">
                  <td className="py-3.5 px-4 border-b border-[var(--border)]">{start + idx + 1}</td>
                  <td className="py-3.5 px-4 border-b border-[var(--border)] font-medium text-[var(--text)]">{request.date}</td>
                  <td className="py-3.5 px-4 border-b border-[var(--border)] text-[var(--text-secondary)]">{request.reason}</td>
                  <td className="py-3.5 px-4 border-b border-[var(--border)] text-[var(--text-secondary)] max-w-[200px] truncate">
                    {request.notes}
                  </td>
                  <td className="py-3.5 px-4 border-b border-[var(--border)]">
                    <StatusBadge status={request.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {filteredRequests.length > 0 && (
        <div className="pagination-container flex flex-col sm:flex-row justify-between items-center gap-3 mt-5">
          <div className="text-xs text-[var(--muted)]">
            Showing {start + 1} to {Math.min(start + pagination.perPage, filteredRequests.length)} of {filteredRequests.length} entries
          </div>
          <div className="page-buttons flex gap-1.5 flex-wrap">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="w-9 h-9 rounded-lg border border-[var(--border)] bg-[var(--surface)] cursor-pointer text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronLeft className="mx-auto" />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`w-9 h-9 rounded-lg border text-xs transition-all ${
                  pagination.currentPage === i + 1
                    ? 'bg-purple-500 border-purple-500 text-white'
                    : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text)]'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === totalPages}
              className="w-9 h-9 rounded-lg border border-[var(--border)] bg-[var(--surface)] cursor-pointer text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronRight className="mx-auto" />
            </button>
          </div>
        </div>
      )}
      
      {/* Request Modal */}
      {isModalOpen && (
        <div className="modal-overlay fixed inset-0 bg-black/50 backdrop-blur-sm z-[1100] flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card bg-[var(--surface)] max-w-md w-full rounded-2xl p-6 md:p-8 shadow-xl border border-[var(--border)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[var(--text)] flex items-center gap-2">
                <FiHome className="text-purple-500" /> Submit WFH Request
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--surface2)] transition-colors"
              >
                <FiX className="text-[var(--text)]" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-field mb-5">
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">
                  <FiCalendar className="inline mr-1 text-purple-500" /> Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full py-3 px-4 bg-[var(--surface2)] border border-[var(--border)] rounded-lg text-sm text-[var(--text)] focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  required
                />
              </div>
              
              <div className="form-field mb-5">
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">
                  <FiMessageSquare className="inline mr-1 text-purple-500" /> Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows="3"
                  placeholder="Why do you need to work from home?"
                  className="w-full py-3 px-4 bg-[var(--surface2)] border border-[var(--border)] rounded-lg text-sm text-[var(--text)] focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                  required
                />
              </div>
              
              <div className="form-field mb-6">
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">
                  <FiFileText className="inline mr-1 text-purple-500" /> Additional Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows="2"
                  placeholder="Any extra information?"
                  className="w-full py-3 px-4 bg-[var(--surface2)] border border-[var(--border)] rounded-lg text-sm text-[var(--text)] focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                />
              </div>
              
              <div className="modal-buttons flex gap-3 justify-end mt-6 pt-4 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full font-medium text-sm bg-transparent border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface2)] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full font-medium text-sm bg-purple-500 text-white hover:bg-purple-600 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                  <FiSend /> Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WFH;