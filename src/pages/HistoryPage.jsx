// src/pages/HistoryPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useUser } from '../context/UserContext';

export default function HistoryPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    api
      .getHistory(user.userId)
      .then(setRecords)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">加载中...</div>;
  }

  return (
    <div className="min-h-screen px-4 py-10 max-w-md mx-auto">
      <h1 className="text-xl text-gold mb-6 text-center">历史记录</h1>

      {error && <p className="text-red-400 text-xs text-center mb-4">{error}</p>}

      {records.length === 0 ? (
        <p className="text-center text-sm text-gray-500">暂无起局记录</p>
      ) : (
        <div className="space-y-3">
          {records.map((r) => (
            <button
              key={r.id}
              onClick={() => navigate(`/result/${r.id}`)}
              className="w-full text-left bg-[#1a1a2e] border border-gold/20 rounded-xl p-4 hover:border-gold/50 transition"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gold">{r.question_type}</span>
                <span className="text-xs text-gray-500">
                  {new Date(r.created_time).toLocaleDateString()}
                </span>
              </div>
              {r.question_text && (
                <p className="text-xs text-gray-400 mb-1">{r.question_text}</p>
              )}
              {r.core_conclusion && (
                <p className="text-xs text-gray-500">
                  {r.auspicious_level} · {r.core_conclusion}
                </p>
              )}
            </button>
          ))}
        </div>
      )}

      <div className="text-center mt-8">
        <button onClick={() => navigate('/')} className="text-xs text-gray-500 underline hover:text-gold">
          返回首页
        </button>
      </div>
    </div>
  );
}
