import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import styles from './Navbar.module.css';

function Navbar({ onCreateTask }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out!');
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <header className={styles.nav}>
      <div className={styles.inner}>
        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.logo}>TF</div>
          <span className={styles.wordmark}>TaskFlow</span>
        </div>

        {/* Right side */}
        <div className={styles.right}>
          {/* User menu */}
          <div className={styles.userMenu} onClick={() => setMenuOpen(!menuOpen)}>
            <div className={styles.avatar}>{initials}</div>
            <span className={styles.userName}>{user?.name}</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={menuOpen ? styles.chevronOpen : ''}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>

            {menuOpen && (
              <div className={styles.dropdown}>
                <div className={styles.dropdownUser}>
                  <div className={styles.dropdownAvatar}>{initials}</div>
                  <div>
                    <p className={styles.dropdownName}>{user?.name}</p>
                    <p className={styles.dropdownEmail}>{user?.email}</p>
                  </div>
                </div>
                <hr className={styles.divider} />
                <button className={styles.dropdownItem} onClick={handleLogout}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
