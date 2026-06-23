// src/api/client.js
// 统一封装与后端的通信，所有请求都走这里。
// 后端地址通过环境变量配置，本地开发默认指向 localhost:3001

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `请求失败：${res.status}`);
  }

  return data;
}

export const api = {
  // ---- 用户相关 ----
  register: (username, password, name, gender) =>
    request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, name, gender }),
    }),

  login: (username, password) =>
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  // ---- 起局相关 ----
  createChart: ({ userId, birthTime, location, questionType, questionText }) =>
    request('/api/qimen/create', {
      method: 'POST',
      body: JSON.stringify({ userId, birthTime, location, questionType, questionText }),
    }),

  retryReport: (recordId) =>
    request('/api/qimen/retry-report', {
      method: 'POST',
      body: JSON.stringify({ recordId }),
    }),

  getRecord: (id) => request(`/api/qimen/record/${id}`),

  getHistory: (userId) => request(`/api/qimen/history?userId=${userId}`),
};
