// src/pages/HomePage.jsx
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { user, logout } = useUser();

  return (
    <div className="min-h-screen px-4 py-10 max-w-2xl mx-auto">
      <div className="flex justify-end mb-6 text-xs text-gray-400">
        {user ? (
          <div className="flex items-center gap-3">
            <span>欢迎，{user.username}</span>
            <button onClick={logout} className="underline hover:text-gold">
              退出
            </button>
          </div>
        ) : (
          <button onClick={() => navigate('/login')} className="underline hover:text-gold">
            登录 / 注册
          </button>
        )}
      </div>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-light text-gold mb-2">奇门遁甲 AI</h1>
        <p className="text-sm text-gray-400 tracking-widest">古法奇门 × 人工智能</p>
      </div>

      <div className="flex justify-center mb-10">
        <button
          onClick={() => navigate(user ? '/create' : '/login')}
          className="px-8 py-3 rounded-lg border border-gold/50 text-gold hover:bg-gold/10 transition"
        >
          开始测算
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { title: '奇门排盘', desc: '起局成盘' },
          { title: 'AI推演', desc: '模型解析' },
          { title: '命理解读', desc: '生成报告' },
        ].map((card) => (
          <div
            key={card.title}
            className="bg-[#1a1a2e] border border-gold/20 rounded-xl p-4 text-center"
          >
            <p className="text-sm text-gold mb-1">{card.title}</p>
            <p className="text-xs text-gray-500">{card.desc}</p>
          </div>
        ))}
      </div>

      {user && (
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/history')}
            className="text-xs text-gray-400 underline hover:text-gold"
          >
            查看历史记录
          </button>
        </div>
      )}
    </div>
  );
}
