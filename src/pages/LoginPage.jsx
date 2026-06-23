// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useUser } from '../context/UserContext';

export default function LoginPage() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('男');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'register') {
        await api.register(username, password, name, gender);
      }
      const res = await api.login(username, password);
      login({ userId: res.userId, username: res.username, token: res.token });
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-[#1a1a2e] border border-gold/30 rounded-2xl p-8">
        <h1 className="text-2xl font-light text-center text-gold mb-1">奇门遁甲 AI</h1>
        <p className="text-center text-xs text-gray-400 mb-6">古法奇门 × 人工智能</p>

        <div className="flex mb-6 rounded-lg overflow-hidden border border-gold/20">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-sm ${mode === 'login' ? 'bg-gold/20 text-gold' : 'text-gray-400'}`}
          >
            登录
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2 text-sm ${mode === 'register' ? 'bg-gold/20 text-gold' : 'text-gray-400'}`}
          >
            注册
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full bg-[#0f0f1a] border border-gold/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-gold/60"
          />
          <input
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-[#0f0f1a] border border-gold/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-gold/60"
          />
          {mode === 'register' && (
            <>
              <input
                type="text"
                placeholder="姓名（测算用）"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0f0f1a] border border-gold/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-gold/60"
              />
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-[#0f0f1a] border border-gold/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-gold/60"
              >
                <option value="男">男</option>
                <option value="女">女</option>
              </select>
            </>
          )}

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold/90 hover:bg-gold text-[#1a1a2e] font-medium rounded-lg py-2 text-sm transition disabled:opacity-50"
          >
            {loading ? '处理中...' : mode === 'login' ? '登录' : '注册并登录'}
          </button>
        </form>
      </div>
    </div>
  );
}
