// src/pages/CreateChartPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useUser } from '../context/UserContext';

const QUESTION_TYPES = ['事业', '财富', '感情', '健康', '选择判断'];

export default function CreateChartPage() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [birthDate, setBirthDate] = useState('');
  const [birthTimeStr, setBirthTimeStr] = useState('');
  const [location, setLocation] = useState('');
  const [questionType, setQuestionType] = useState('事业');
  const [questionText, setQuestionText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!birthDate || !birthTimeStr || !location) {
      setError('请填写完整的出生日期、时间和地点');
      return;
    }

    setLoading(true);
    try {
      const birthTime = `${birthDate}T${birthTimeStr}:00`;
      const res = await api.createChart({
        userId: user.userId,
        birthTime,
        location,
        questionType,
        questionText,
      });
      // 起局成功（即使AI报告失败，排盘数据已经保存），跳转到结果页
      navigate(`/result/${res.recordId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-10 max-w-md mx-auto">
      <h1 className="text-xl text-gold mb-6 text-center">起局信息</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-400 block mb-1">出生日期</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
              className="w-full bg-[#0f0f1a] border border-gold/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-gold/60"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">出生时间</label>
            <input
              type="time"
              value={birthTimeStr}
              onChange={(e) => setBirthTimeStr(e.target.value)}
              required
              className="w-full bg-[#0f0f1a] border border-gold/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-gold/60"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-400 block mb-1">出生地点</label>
          <input
            type="text"
            placeholder="例如：上海市"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="w-full bg-[#0f0f1a] border border-gold/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-gold/60"
          />
        </div>

        <div>
          <label className="text-xs text-gray-400 block mb-2">问题类型</label>
          <div className="grid grid-cols-3 gap-2">
            {QUESTION_TYPES.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setQuestionType(q)}
                className={`py-2 rounded-lg text-sm border ${
                  questionType === q
                    ? 'border-gold bg-gold/20 text-gold'
                    : 'border-gold/20 text-gray-400'
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-400 block mb-1">具体问题（选填）</label>
          <textarea
            placeholder="例如：今年适合创业吗？"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            rows={3}
            className="w-full bg-[#0f0f1a] border border-gold/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-gold/60 resize-none"
          />
        </div>

        {error && <p className="text-red-400 text-xs">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gold/90 hover:bg-gold text-[#1a1a2e] font-medium rounded-lg py-3 text-sm transition disabled:opacity-50"
        >
          {loading ? '起局中...' : '开始起局'}
        </button>
      </form>
    </div>
  );
}
