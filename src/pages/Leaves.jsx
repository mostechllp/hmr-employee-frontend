import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setLeaveFilter, setLeavePagination } from '../store/slices/leavesSlice';
import { FiSearch, FiPlus, FiFileText, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import StatusBadge from '../components/common/StatusBAdge';

const Leaves = () => {
  const dispatch = useAppDispatch();
  const { leaves, filter, pagination } = useAppSelector((state) => state.leaves);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  
  useEffect(() => {
    let filtered = [...leaves];
    
    if (filter.status !== 'all') {
      filtered = filtered.filter(l => l.status === filter.status);
    }
    
    if (filter.search) {
      filtered = filtered.filter(l => 
        l.type.toLowerCase().includes(filter.search.toLowerCase()) ||
        l.status.toLowerCase().includes(filter.search.toLowerCase()) ||
        l.remark.toLowerCase().includes(filter.search.toLowerCase())
      );
    }
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilteredLeaves(filtered);
  }, [leaves, filter]);
  
  const totalPages = Math.ceil(filteredLeaves.length / pagination.perPage);
  const start = (pagination.currentPage - 1) * pagination.perPage;
  const currentLeaves = filteredLeaves.slice(start, start + pagination.perPage);
  
  const stats = {
    total: leaves.length,
    pending: leaves.filter(l => l.status === 'Pending').length,
    approved: leaves.filter(l => l.status === 'Approved').length,
    rejected: leaves.filter(l => l.status === 'Rejected').length,
  };
  
  const handleStatusFilter = (status) => {
    dispatch(setLeaveFilter({ status, search: filter.search }));
  };
  
  const handleSearch = (e) => {
    dispatch(setLeaveFilter({ status: filter.status, search: e.target.value }));
  };
  
  const handlePageChange = (page) => {
    dispatch(setLeavePagination({ currentPage: page, perPage: pagination.perPage }));
  };
  
  const handleEntriesChange = (e) => {
    dispatch(setLeavePagination({ currentPage: 1, perPage: parseInt(e.target.value) }));
  };
  
  return (
    <div>
      {/* Stats Grid */}
      <div className="stats-grid grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mb-7">
        <div className="stat-card bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 md:p-5">
          <div className="stat-header flex justify-between items-center mb-3">
            <div className="stat-icon w-10 h-10 md:w-12 md:h-12 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center text-xl md:text-2xl">
              <FiFileText />
            </div>
          </div>
          <div className="stat-number text-2xl md:text-3xl font-extrabold text-green-600">{stats.total}</div>
          <div className="stat-label text-xs text-[var(--muted)]">Total Leaves Taken</div>
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
            <div className="stat-icon w-10 h-10 md:w-12 md:h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center text-xl md:text-2xl">
              <FiFileText />
            </div>
          </div>
          <div className="stat-number text-2xl md:text-3xl font-extrabold text-purple-500">{stats.approved}</div>
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
      
      <div className="leaves-header flex flex-col md:flex-row justify-between items-start md:items-center gap-5 mb-7">
        <h2 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-[var(--text)] to-green-600 bg-clip-text text-transparent">
          My Leave Requests
        </h2>
        <Link to="/request-leave" className="request-btn bg-green-500 text-white py-2.5 px-6 rounded-full font-semibold text-sm flex items-center gap-2 hover:bg-green-600 hover:-translate-y-0.5 transition-all">
          <FiPlus /> Request Leave
        </Link>
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
              placeholder="Search by type, status..."
              className="border-none outline-none bg-transparent text-xs text-[var(--text)] w-36 sm:w-44"
            />
          </div>
        </div>
      </div>
      
      {/* Table */}
      <div className="leave-table-wrapper bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-x-auto shadow-sm">
        <table className="leave-table w-full border-collapse text-xs min-w-[900px]">
          <thead>
            <tr>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted)] bg-[var(--surface2)] border-b border-[var(--border)] w-16">#</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted)] bg-[var(--surface2)] border-b border-[var(--border)]">Type</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted)] bg-[var(--surface2)] border-b border-[var(--border)]">From</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted)] bg-[var(--surface2)] border-b border-[var(--border)]">To</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted)] bg-[var(--surface2)] border-b border-[var(--border)]">Days</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted)] bg-[var(--surface2)] border-b border-[var(--border)]">Claim Salary</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted)] bg-[var(--surface2)] border-b border-[var(--border)]">Document</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted)] bg-[var(--surface2)] border-b border-[var(--border)]">Status</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted)] bg-[var(--surface2)] border-b border-[var(--border)]">Remark</th>
            </tr>
          </thead>
          <tbody>
            {currentLeaves.map((leave, idx) => (
              <tr key={leave.id} className="hover:bg-[var(--surface2)] transition-colors">
                <td className="py-3.5 px-4 border-b border-[var(--border)] text-center">{start + idx + 1}</td>
                <td className="py-3.5 px-4 border-b border-[var(--border)] font-semibold text-[var(--text)]">{leave.type}</td>
                <td className="py-3.5 px-4 border-b border-[var(--border)] text-[var(--text-secondary)]">{leave.fromDate}</td>
                <td className="py-3.5 px-4 border-b border-[var(--border)] text-[var(--text-secondary)]">{leave.toDate}</td>
                <td className="py-3.5 px-4 border-b border-[var(--border)] text-[var(--text-secondary)]">{leave.days}</td>
                <td className="py-3.5 px-4 border-b border-[var(--border)]">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                    leave.claimSalary === 'Yes' 
                      ? 'bg-green-500/15 text-green-600' 
                      : 'bg-[var(--surface2)] text-[var(--muted)]'
                  }`}>
                    {leave.claimSalary}
                  </span>
                </td>
                <td className="py-3.5 px-4 border-b border-[var(--border)]">
                  {leave.document !== '-' ? (
                    <span className="text-blue-500 cursor-pointer hover:underline">{leave.document}</span>
                  ) : '-'}
                </td>
                <td className="py-3.5 px-4 border-b border-[var(--border)]">
                  <StatusBadge status={leave.status} />
                </td>
                <td className="py-3.5 px-4 border-b border-[var(--border)] text-[var(--text-secondary)] max-w-[150px] truncate">
                  {leave.remark}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {filteredLeaves.length > 0 && (
        <div className="pagination-container flex flex-col sm:flex-row justify-between items-center gap-3 mt-5">
          <div className="text-xs text-[var(--muted)]">
            Showing {start + 1} to {Math.min(start + pagination.perPage, filteredLeaves.length)} of {filteredLeaves.length} entries
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
                    ? 'bg-green-500 border-green-500 text-white'
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
    </div>
  );
};

export default Leaves;