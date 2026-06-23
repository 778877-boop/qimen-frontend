// src/pages/ResultPage.jsx
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client';

const PALACE_LAYOUT = [
  '巽四宫', '离九宫', '坤二宫',
  '震三宫', '中五宫', '兑七宫',
  '艮八宫', '坎一宫', '乾六宫',
];

export default function ResultPage() {
  const { recordId } = useParams();
  const navigate = useNavigate();

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retrying, setRetrying] = useState(false);

  const loadRecord = useCallback(async () => {
    try {
      const data = await api.getRecord(recordId);
      setRecord(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [recordId]);

  useEffect(() => {
    loadRecord();
  }, [loadRecord]);

  const handleRetry = async () => {
    setRetrying(true);
    try {
      await api.retryReport(recordId);
      await loadRecord();
    } catch (err) {
      setError(err.message);
    } finally {
      setRetrying(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">加载中...</div>;
  }

  if (error || !record) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        {error || '记录不存在'}
      </div>
    );
  }

  const palaceMap = {};
  record.palaces.forEach((p) => {
    palaceMap[p.palace_name] = p;
  });

  return (
    <div className="min-h-screen px-4 py-10 max-w-2xl mx-auto">
      <h1 className="text-xl text-gold mb-1 text-center">
        奇门盘 · {record.yin_yang_dun}{record.ju_number}局
      </h1>
      <p className="text-center text-xs text-gray-500 mb-6">
        值符：{record.zhi_fu} ｜ 值使：{record.zhi_shi}
      </p>

      {/* 九宫盘 */}
      <div className="grid grid-cols-3 gap-2 max-w-md mx-auto mb-8">
        {PALACE_LAYOUT.map((name) => {
          const p = palaceMap[name];
          if (!p) return <div key={name} />;
          const highlight = p.is_zhi_fu || p.is_zhi_shi;
          return (
            <div
              key={name}
              className={`rounded-lg p-3 text-center border ${
                highlight ? 'border-gold bg-gold/10' : 'border-gold/20 bg-[#1a1a2e]'
              }`}
            >
              <p className="text-xs text-gray-500 mb-1">{name}</p>
              <p className="text-sm text-gold">{p.ba_men}</p>
              <p className="text-xs text-gray-400">{p.jiu_xing} · {p.ba_shen}</p>
            </div>
          );
        })}
      </div>

      {/* 格局总结 */}
      {record.summary && (
        <div className="bg-[#1a1a2e] border border-gold/20 rounded-xl p-4 mb-8 text-sm">
          <p className="text-gold mb-1">
            {record.summary.pattern_type}（{record.summary.auspicious_level}）
          </p>
          <p className="text-gray-400">{record.summary.core_conclusion}</p>
        </div>
      )}

      {/* AI报告 */}
      <div className="border-t border-gold/20 pt-6">
        <p className="text-center text-xs text-gray-500 tracking-widest mb-4">
          ━━━ 奇门分析报告 ━━━
        </p>

        {record.ai_result ? (
          <div className="text-sm leading-7 whitespace-pre-wrap text-gray-200">
            {record.ai_result}
          </div>
        ) : (
          <div className="text-center text-sm text-gray-400 space-y-3">
            <p>排盘已完成，AI报告生成失败或尚未生成</p>
            <button
              onClick={handleRetry}
              disabled={retrying}
              className="px-6 py-2 rounded-lg border border-gold/50 text-gold hover:bg-gold/10 transition disabled:opacity-50"
            >
              {retrying ? '生成中...' : '重新生成报告'}
            </button>
          </div>
        )}
      </div>

      <div className="text-center mt-10">
        <button onClick={() => navigate('/')} className="text-xs text-gray-500 underline hover:text-gold">
          返回首页
        </button>
      </div>
    </div>
  );
}
