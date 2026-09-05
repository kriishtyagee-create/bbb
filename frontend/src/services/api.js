const API_BASE = '/api';

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('sih_auth_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error || data.message || 'API request failed');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

export const authAPI = {
  login: (email, password) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (payload) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  demoLogin: (role) => apiFetch('/auth/demo-login', { method: 'POST', body: JSON.stringify({ role }) }),
  getMe: () => apiFetch('/auth/me'),
};

export const skillsAPI = {
  getAll: (params = '') => apiFetch(`/skills${params}`),
  getCategories: () => apiFetch('/skills/categories'),
  create: (payload) => apiFetch('/skills', { method: 'POST', body: JSON.stringify(payload) }),
  getCareerRoles: () => apiFetch('/career-roles'),
};

export const studentAPI = {
  getProfile: () => apiFetch('/students/profile'),
  updateProfile: (payload) => apiFetch('/students/profile', { method: 'PUT', body: JSON.stringify(payload) }),
  getSkills: () => apiFetch('/students/skills'),
  addSkill: (payload) => apiFetch('/students/skills', { method: 'POST', body: JSON.stringify(payload) }),
  deleteSkill: (id) => apiFetch(`/students/skills/${id}`, { method: 'DELETE' }),
  getSkillGap: (targetRole = '') => apiFetch(`/students/skill-gap?target_role=${encodeURIComponent(targetRole)}`),
  getRecommendations: (type = '') => apiFetch(`/students/recommendations${type ? `?type=${type}` : ''}`),
  getApplications: () => apiFetch('/students/applications'),
};

export const opportunitiesAPI = {
  getAll: (params = '') => apiFetch(`/opportunities${params}`),
  getById: (id) => apiFetch(`/opportunities/${id}`),
  create: (payload) => apiFetch('/opportunities', { method: 'POST', body: JSON.stringify(payload) }),
  apply: (id, coverNote) => apiFetch(`/opportunities/${id}/apply`, { method: 'POST', body: JSON.stringify({ cover_note: coverNote }) }),
  calculateMatch: (payload) => apiFetch('/match/calculate', { method: 'POST', body: JSON.stringify(payload) }),
};

export const industryAPI = {
  getDashboard: () => apiFetch('/industry/dashboard'),
  getPostings: () => apiFetch('/industry/postings'),
  getCandidates: (params = '') => apiFetch(`/industry/candidates${params}`),
  getApplications: (params = '') => apiFetch(`/industry/applications${params}`),
  updateAppStatus: (id, status) => apiFetch(`/industry/applications/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  scheduleInterview: (id, payload) => apiFetch(`/industry/applications/${id}/schedule-interview`, { method: 'POST', body: JSON.stringify(payload) }),
};

export const academicianAPI = {
  getDashboard: () => apiFetch('/academician/dashboard'),
  getStudents: (params = '') => apiFetch(`/academician/students${params}`),
  getSkillAnalytics: () => apiFetch('/academician/skill-analytics'),
  getIndustryDemand: () => apiFetch('/academician/industry-demand'),
  getCurriculumInsights: () => apiFetch('/academician/curriculum-insights'),
};

export const collaborationsAPI = {
  getAll: (params = '') => apiFetch(`/collaborations${params}`),
  create: (payload) => apiFetch('/collaborations', { method: 'POST', body: JSON.stringify(payload) }),
  updateStatus: (id, payload) => apiFetch(`/collaborations/${id}/status`, { method: 'PUT', body: JSON.stringify(payload) }),
  getPartners: () => apiFetch('/collaborations/partners'),
};

export const notificationsAPI = {
  getAll: () => apiFetch('/notifications'),
  markRead: (id) => apiFetch(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllRead: () => apiFetch('/notifications/read-all', { method: 'PUT' }),
};

export const adminAPI = {
  getStats: () => apiFetch('/admin/statistics'),
  getUsers: (params = '') => apiFetch(`/admin/users${params}`),
  getOpportunities: () => apiFetch('/admin/opportunities'),
};
