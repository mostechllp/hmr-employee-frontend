import { useEffect, useState, useRef } from 'react';
import { useAppSelector } from '../store/hooks';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Dashboard = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [punchInTime, setPunchInTime] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
      setCurrentDate(now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    
    const savedPunch = localStorage.getItem('employeePunchedIn');
    const savedPunchTime = localStorage.getItem('employeePunchInTime');
    if (savedPunch === 'true' && savedPunchTime) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsPunchedIn(true);
      setPunchInTime(new Date(savedPunchTime));
    }
    
    return () => clearInterval(interval);
  }, []);

  const handlePunch = () => {
    if (!isPunchedIn) {
      const now = new Date();
      setPunchInTime(now);
      setIsPunchedIn(true);
      localStorage.setItem('employeePunchedIn', 'true');
      localStorage.setItem('employeePunchInTime', now.toISOString());
    } else {
      setIsPunchedIn(false);
      localStorage.removeItem('employeePunchedIn');
      localStorage.removeItem('employeePunchInTime');
    }
  };

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Hours Worked',
      data: [8, 7.5, 8, 6, 8, 4, 0],
      backgroundColor: '#2ecc71',
      borderRadius: 8,
      barPercentage: 0.6,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#2ecc71',
        callbacks: { label: (context) => `${context.raw} hours` },
      },
    },
    scales: {
      y: { beginAtZero: true, max: 9, title: { display: true, text: 'Hours', font: { size: 11 } } },
      x: { ticks: { font: { size: 11 } } },
    },
  };

  return (
    <div>
      {/* Welcome Banner */}
      <div className="welcome-banner bg-gradient-to-br from-green-600 to-green-500 rounded-xl p-5 md:p-7 mb-7 flex flex-col md:flex-row justify-between items-center gap-5">
        <div className="welcome-left flex items-center gap-5 flex-wrap">
          <div className="welcome-avatar w-16 h-16 rounded-xl overflow-hidden border-3 border-white shadow-lg">
            <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="welcome-text">
            <h2 className="text-xl md:text-2xl font-bold text-white">Welcome, {user.name}! 👋</h2>
            <p className="text-white/90 text-xs md:text-sm">{user.role}</p>
          </div>
        </div>
        <div className="datetime-info text-center md:text-right text-white">
          <div className="time text-2xl md:text-3xl font-bold">{currentTime}</div>
          <div className="date text-xs opacity-90">{currentDate}</div>
        </div>
      </div>

      {/* Punch Card */}
      <div className="punch-card bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 md:p-6 mb-7 flex flex-col md:flex-row justify-between items-center gap-5">
        <div className="punch-stats flex gap-8 md:gap-10 flex-wrap justify-center">
          <div className="punch-item text-center">
            <div className="punch-label text-xs text-[var(--muted)] mb-2">Punch In</div>
            <div className={`punch-value text-2xl font-bold ${isPunchedIn ? 'text-green-500' : 'text-[var(--text)]'}`}>
              {punchInTime ? punchInTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '—'}
            </div>
          </div>
          <div className="punch-item text-center">
            <div className="punch-label text-xs text-[var(--muted)] mb-2">Punch Out</div>
            <div className="punch-value text-2xl font-bold text-[var(--text)]">—</div>
          </div>
        </div>
        <button
          onClick={handlePunch}
          className="punch-btn bg-green-500 border-none text-white py-3 px-8 rounded-full font-semibold text-sm cursor-pointer transition-all flex items-center gap-2 hover:bg-green-600 hover:-translate-y-0.5 hover:shadow-md"
        >
          <i className="fas fa-fingerprint"></i> {isPunchedIn ? 'Punch Out' : 'Punch In'}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid grid grid-cols-2 md:grid-cols-3 gap-5 mb-7">
        <div className="stat-card bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 text-center hover:-translate-y-0.5 hover:shadow-md transition-all">
          <div className="stat-icon w-12 h-12 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center text-2xl mx-auto mb-3">
            <i className="fas fa-calendar-check"></i>
          </div>
          <div className="stat-number text-3xl font-extrabold text-green-600">18</div>
          <div className="stat-label text-xs text-[var(--muted)]">Present (30d)</div>
        </div>
        <div className="stat-card bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 text-center hover:-translate-y-0.5 hover:shadow-md transition-all">
          <div className="stat-icon w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center text-2xl mx-auto mb-3">
            <i className="fas fa-calendar-alt"></i>
          </div>
          <div className="stat-number text-3xl font-extrabold text-blue-500">2</div>
          <div className="stat-label text-xs text-[var(--muted)]">Leaves Taken</div>
        </div>
        <div className="stat-card bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 text-center hover:-translate-y-0.5 hover:shadow-md transition-all">
          <div className="stat-icon w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-2xl mx-auto mb-3">
            <i className="fas fa-hourglass-half"></i>
          </div>
          <div className="stat-number text-3xl font-extrabold text-amber-500">28</div>
          <div className="stat-label text-xs text-[var(--muted)]">Leave Balance</div>
        </div>
      </div>

      {/* Chart Card */}
      <div className="chart-card bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 mb-7">
        <h3 className="text-base font-semibold text-[var(--text)] mb-5 flex items-center gap-2">
          <i className="fas fa-chart-line"></i> My Attendance (Last 7 Days)
        </h3>
        <div className="chart-container h-64 relative">
          <Bar ref={chartRef} data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;