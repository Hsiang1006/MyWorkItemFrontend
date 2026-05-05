import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';

const AccountLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="account-layout min-vh-100 d-flex flex-column bg-light">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/work-items">
            My Work Item
          </Link>
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link 
                  className={`nav-link ${location.pathname.startsWith('/work-items') ? 'active fw-bold' : ''}`} 
                  to="/work-items"
                >
                  待辦事項列表
                </Link>
              </li>
              {/* 如果是 Admin，則顯示管理員列表入口 */}
              {role === 'Admin' && (
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${location.pathname.startsWith('/admin/work-items') ? 'active fw-bold' : ''}`} 
                    to="/admin/work-items"
                  >
                    管理員專區
                  </Link>
                </li>
              )}
            </ul>
            <div className="d-flex align-items-center text-white gap-3">
              <span className="fw-medium">你好, {user || 'User'}</span>
              <button 
                className="btn btn-light btn-sm rounded-pill fw-medium px-3"
                onClick={handleLogout}
              >
                登出
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container py-4 flex-grow-1">
        <Outlet />
      </main>
      
      <footer className="bg-white py-3 text-center text-muted border-top mt-auto">
        <small>&copy; {new Date().getFullYear()} My Work Item. All rights reserved.</small>
      </footer>
    </div>
  );
};

export default AccountLayout;