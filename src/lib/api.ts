const BASE_URL = '/api';

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem('green_node_token', token);
  } else {
    localStorage.removeItem('green_node_token');
  }
}

export function getAuthToken(): string | null {
  if (!authToken) {
    authToken = localStorage.getItem('green_node_token');
  }
  return authToken;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(data.error || `API error: ${res.status}`);
  }

  return res.json();
}

export interface AuthUser {
  id: string;
  role: 'user' | 'collector' | 'admin';
  name: string;
  trustLevel: string;
  points: number;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export const api = {
  health: () => request<any>('/health'),

  healthConfig: (mode?: string) => {
    const qs = mode ? `?mode=${mode}` : '';
    return request<any>(`/health/config${qs}`);
  },

  login: (role: string) => request<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ role }),
  }),

  getMe: () => request<AuthUser>('/auth/me'),

  getCases: (params?: { userId?: string; status?: string }) => {
    const query = new URLSearchParams();
    if (params?.userId) query.set('userId', params.userId);
    if (params?.status) query.set('status', params.status);
    const qs = query.toString();
    return request<any[]>(`/cases${qs ? '?' + qs : ''}`);
  },

  getCase: (id: string) => request<any>(`/cases/${id}`),

  createCase: (data: any) => request<any>('/cases', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  updateCase: (id: string, data: any) => request<any>(`/cases/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),

  uploadEvidence: (caseId: string, file: File, kind: string = 'photo') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('kind', kind);
    return request<any>(`/cases/${caseId}/evidence`, {
      method: 'POST',
      body: formData,
    });
  },

  rateCase: (caseId: string, data: { fromRole: string; stars: number; issues?: string[] }) =>
    request<any>(`/cases/${caseId}/rate`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getCollectors: () => request<any[]>('/collectors'),

  updateCollector: (id: string, data: any) => request<any>(`/collectors/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),

  getRewards: () => request<any[]>('/rewards'),

  redeemReward: (userId: string, rewardId: string) => request<any>('/rewards/redeem', {
    method: 'POST',
    body: JSON.stringify({ userId, rewardId }),
  }),

  updatePoints: (delta: number) => request<{ points: number }>('/auth/points', {
    method: 'PATCH',
    body: JSON.stringify({ delta }),
  }),

  getCenters: () => request<any[]>('/centers'),

  classifyWaste: (imageUrls: string[], context?: any) => request<any>('/ai/classify', {
    method: 'POST',
    body: JSON.stringify({ imageUrls, context }),
  }),

  recommendCollectors: (caseDraft: any) => request<any>('/ai/recommend-collectors', {
    method: 'POST',
    body: JSON.stringify({ caseDraft }),
  }),
};
