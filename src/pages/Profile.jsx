import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateProfile } from '../store/slices/authSlice';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCamera, FiLock, FiSave, FiRefreshCw, FiEdit2, FiBriefcase, FiCalendar, FiUsers, FiCheckCircle } from 'react-icons/fi';

const Profile = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    fullName: user.name,
    personalEmail: 'jithin.personal@gmail.com',
    personalNumber: '+971 50 123 4567',
    address: 'Dubai, United Arab Emirates',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  
  useEffect(() => {
    const savedProfile = localStorage.getItem('employeeProfile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(prev => ({ ...prev, ...profile }));
    }
  }, []);
  
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileSize = file.size / 1024 / 1024;
      if (fileSize > 2) {
        alert('Profile photo must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword) {
      if (!passwordData.currentPassword) {
        alert('Please enter current password');
        return;
      }
      if (passwordData.newPassword.length < 8) {
        alert('New password must be at least 8 characters');
        return;
      }
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        alert('New passwords do not match');
        return;
      }
      alert('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }
    
    dispatch(updateProfile({ name: formData.fullName }));
    
    const profileData = {
      fullName: formData.fullName,
      personalEmail: formData.personalEmail,
      personalNumber: formData.personalNumber,
      address: formData.address,
    };
    localStorage.setItem('employeeProfile', JSON.stringify(profileData));
    
    alert('Profile updated successfully!');
  };
  
  const handleReset = () => {
    setFormData({
      fullName: user.name,
      personalEmail: 'jithin.personal@gmail.com',
      personalNumber: '+971 50 123 4567',
      address: 'Dubai, United Arab Emirates',
    });
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPhotoPreview(null);
  };
  
  return (
    <div>
      <div className="page-header mb-7">
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[var(--text)] to-green-600 bg-clip-text text-transparent flex items-center gap-2">
          <FiUser /> My Profile
        </h2>
      </div>
      
      <div className="split-container grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-7">
        {/* Form */}
        <div className="form-container bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 md:p-8 shadow-sm">
          <form onSubmit={handleSubmit}>
            <div className="form-section-title text-lg font-bold text-green-600 mb-6 pb-3 border-b-2 border-green-100 flex items-center gap-2.5">
              <FiEdit2 /> Edit Personal Info
            </div>
            <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <div className="form-field md:col-span-2 flex flex-col gap-2">
                <label className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1">
                  <FiUser className="text-green-500" /> Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="py-3 px-3.5 bg-[var(--surface2)] border border-[var(--border)] rounded-lg text-sm text-[var(--text)] focus:outline-none focus:border-green-500 focus:shadow-[0_0_0_3px_rgba(46,204,113,0.12)] transition-all"
                />
              </div>
              <div className="form-field flex flex-col gap-2">
                <label className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1">
                  <FiMail className="text-green-500" /> Company Email (read-only)
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="py-3 px-3.5 bg-[var(--surface2)] border border-[var(--border)] rounded-lg text-sm text-[var(--text)] opacity-70 cursor-not-allowed"
                />
              </div>
              <div className="form-field flex flex-col gap-2">
                <label className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1">
                  <FiMail className="text-green-500" /> Personal Email
                </label>
                <input
                  type="email"
                  value={formData.personalEmail}
                  onChange={(e) => setFormData({ ...formData, personalEmail: e.target.value })}
                  className="py-3 px-3.5 bg-[var(--surface2)] border border-[var(--border)] rounded-lg text-sm text-[var(--text)] focus:outline-none focus:border-green-500 focus:shadow-[0_0_0_3px_rgba(46,204,113,0.12)] transition-all"
                />
              </div>
              <div className="form-field flex flex-col gap-2">
                <label className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1">
                  <FiPhone className="text-green-500" /> Personal Number
                </label>
                <input
                  type="tel"
                  value={formData.personalNumber}
                  onChange={(e) => setFormData({ ...formData, personalNumber: e.target.value })}
                  className="py-3 px-3.5 bg-[var(--surface2)] border border-[var(--border)] rounded-lg text-sm text-[var(--text)] focus:outline-none focus:border-green-500 focus:shadow-[0_0_0_3px_rgba(46,204,113,0.12)] transition-all"
                />
              </div>
              <div className="form-field md:col-span-2 flex flex-col gap-2">
                <label className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1">
                  <FiMapPin className="text-green-500" /> Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows="2"
                  className="py-3 px-3.5 bg-[var(--surface2)] border border-[var(--border)] rounded-lg text-sm text-[var(--text)] focus:outline-none focus:border-green-500 focus:shadow-[0_0_0_3px_rgba(46,204,113,0.12)] transition-all resize-none"
                />
              </div>
            </div>
            
            <div className="form-section-title text-lg font-bold text-green-600 mb-6 pb-3 border-b-2 border-green-100 flex items-center gap-2.5">
              <FiCamera /> Profile Photo
            </div>
            <div className="form-field w-full mb-6">
              <div 
                onClick={() => document.getElementById('profilePhoto').click()}
                className="photo-upload-area border-2 border-dashed border-[var(--border)] rounded-lg p-4 text-center cursor-pointer hover:border-green-500 hover:bg-green-500/10 transition-all"
              >
                <FiCamera className="text-3xl text-green-500 mx-auto mb-2" />
                <div className="upload-text text-sm text-[var(--text-secondary)] mb-1">Click to upload profile photo</div>
                <div className="upload-hint text-[11px] text-[var(--muted)]">JPG/PNG, max 2MB</div>
              </div>
              <input
                type="file"
                id="profilePhoto"
                accept="image/jpeg,image/png"
                style={{ display: 'none' }}
                onChange={handlePhotoChange}
              />
              {(photoPreview || user.avatar) && (
                <div className="photo-preview flex justify-center mt-3">
                  <img 
                    src={photoPreview || user.avatar} 
                    alt="Preview" 
                    className="w-20 h-20 rounded-full object-cover border-2 border-green-500"
                  />
                </div>
              )}
            </div>
            
            <div className="form-section-title text-lg font-bold text-green-600 mb-6 pb-3 border-b-2 border-green-100 flex items-center gap-2.5">
              <FiLock /> Change Password
            </div>
            <div className="form-grid grid grid-cols-1 gap-5 mb-6">
              <div className="form-field flex flex-col gap-2">
                <label className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1">
                  <FiLock className="text-green-500" /> Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                  className="py-3 px-3.5 bg-[var(--surface2)] border border-[var(--border)] rounded-lg text-sm text-[var(--text)] focus:outline-none focus:border-green-500 focus:shadow-[0_0_0_3px_rgba(46,204,113,0.12)] transition-all"
                />
              </div>
              <div className="form-field flex flex-col gap-2">
                <label className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1">
                  <FiLock className="text-green-500" /> New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Min. 8 characters"
                  className="py-3 px-3.5 bg-[var(--surface2)] border border-[var(--border)] rounded-lg text-sm text-[var(--text)] focus:outline-none focus:border-green-500 focus:shadow-[0_0_0_3px_rgba(46,204,113,0.12)] transition-all"
                />
              </div>
              <div className="form-field flex flex-col gap-2">
                <label className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1">
                  <FiCheckCircle className="text-green-500" /> Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Repeat new password"
                  className="py-3 px-3.5 bg-[var(--surface2)] border border-[var(--border)] rounded-lg text-sm text-[var(--text)] focus:outline-none focus:border-green-500 focus:shadow-[0_0_0_3px_rgba(46,204,113,0.12)] transition-all"
                />
              </div>
            </div>
            
            <div className="form-actions flex flex-col sm:flex-row justify-end gap-4 mt-8 pt-6 border-t border-[var(--border)]">
              <button
                type="button"
                onClick={handleReset}
                className="cancel-btn py-3 px-7 rounded-full font-semibold bg-transparent border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface2)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <FiRefreshCw /> Reset
              </button>
              <button
                type="submit"
                className="save-btn py-3 px-8 rounded-full font-semibold bg-green-500 text-white hover:bg-green-600 hover:-translate-y-0.5 hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                <FiSave /> Save Changes
              </button>
            </div>
          </form>
        </div>
        
        {/* Profile Card */}
        <div className="profile-card bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 shadow-sm text-center sticky top-24">
          <div className="profile-avatar-large w-28 h-28 rounded-full overflow-hidden mx-auto mb-4 border-3 border-green-500 shadow-md">
            <img src={photoPreview || user.avatar} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <h3 className="text-xl font-bold text-[var(--text)] mb-1">{formData.fullName}</h3>
          <div className="designation text-xs text-[var(--muted)] mb-5">{user.role}</div>
          
          <div className="info-row flex justify-between py-3 border-b border-[var(--border)] text-left">
            <span className="info-label text-xs font-semibold text-[var(--muted)] flex items-center gap-1"><FiBriefcase /> Department</span>
            <span className="info-value text-xs font-medium text-[var(--text)]">{user.department}</span>
          </div>
          <div className="info-row flex justify-between py-3 border-b border-[var(--border)] text-left">
            <span className="info-label text-xs font-semibold text-[var(--muted)] flex items-center gap-1"><FiUser /> Employee ID</span>
            <span className="info-value text-xs font-medium text-[var(--text)]">{user.employeeId}</span>
          </div>
          <div className="info-row flex justify-between py-3 border-b border-[var(--border)] text-left">
            <span className="info-label text-xs font-semibold text-[var(--muted)] flex items-center gap-1"><FiCalendar /> Joined</span>
            <span className="info-value text-xs font-medium text-[var(--text)]">{user.joinedDate}</span>
          </div>
          <div className="info-row flex justify-between py-3 border-b border-[var(--border)] text-left">
            <span className="info-label text-xs font-semibold text-[var(--muted)] flex items-center gap-1"><FiUsers /> Gender</span>
            <span className="info-value text-xs font-medium text-[var(--text)]">{user.gender}</span>
          </div>
          <div className="info-row flex justify-between py-3 text-left">
            <span className="info-label text-xs font-semibold text-[var(--muted)] flex items-center gap-1"><FiCheckCircle /> Status</span>
            <span className="info-value text-xs font-medium text-green-500">Active</span>
          </div>
          
          <button
            onClick={() => document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' })}
            className="edit-profile-btn w-full mt-5 py-3 bg-green-500 rounded-full text-white font-semibold flex items-center justify-center gap-2 hover:bg-green-600 hover:-translate-y-0.5 transition-all"
          >
            <FiEdit2 /> Edit Personal Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;