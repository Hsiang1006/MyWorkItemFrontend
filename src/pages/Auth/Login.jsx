import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSchema } from '../../schemas/authSchema';
import { useLoginMutation } from '../../features/auth/authApi';
import { setCredentials } from '../../features/auth/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const result = await login(data).unwrap();
      
      // 直接從後端回傳的 result.roles 陣列中提取角色
      // 假設 roles 陣列中包含至少一個角色，取第一個作為主要角色
      const role = result.roles && result.roles.length > 0 ? result.roles[0] : 'User';

      dispatch(
        setCredentials({
          user: result.username || data.username, // 假設後端也回傳 username 或用登入的 username
          token: result.token,
          role: role,
        })
      );
      navigate('/work-items');
    } catch (err) {
      alert('登入失敗: ' + (err.data?.message || '請檢查帳號密碼'));
    }
  };

  return (
    <div className="row justify-content-center align-items-center vh-100 mx-0">
      <div className="col-md-4">
        <div className="card shadow border-0">
          <div className="card-body p-5">
            <h2 className="text-center mb-4 fw-bold">My Work Item</h2>
            <p className="text-muted text-center mb-4">請輸入您的帳號密碼進行登入</p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label className="form-label">使用者名稱</label>
                <input
                  type="text"
                  className={`form-control form-control-lg ${errors.username ? 'is-invalid' : ''}`}
                  placeholder="Username"
                  {...register('username')}
                />
                <div className="invalid-feedback">{errors.username?.message}</div>
              </div>

              <div className="mb-4">
                <label className="form-label">密碼</label>
                <input
                  type="password"
                  className={`form-control form-control-lg ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="Password"
                  {...register('password')}
                />
                <div className="invalid-feedback">{errors.password?.message}</div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg w-100 shadow-sm"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="spinner-border spinner-border-sm me-2"></span>
                ) : null}
                登入
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;