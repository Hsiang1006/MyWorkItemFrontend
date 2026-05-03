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
      // 假設後端回傳格式包含 token
      // 這裡根據您的規範，我們將 token, user, role 存入 slice
      dispatch(
        setCredentials({
          user: result.username || data.username,
          token: result.token,
          role: result.role || 'User', // 預設角色，或從後端獲取
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