const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`API Error ${res.status}: ${path}`);
  }
  const json = await res.json();
  return json.data ?? json;
}

// ─── 프로젝트 ───────────────────────────────────────────────
export const projectsApi = {
  list: () => apiFetch<Project[]>('/api/projects'),
  get: (id: string) => apiFetch<Project>(`/api/projects/${id}`),
  create: (data: CreateProjectRequest) =>
    apiFetch<Project>('/api/projects', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<CreateProjectRequest>) =>
    apiFetch<Project>(`/api/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  sync: (id: string) =>
    apiFetch<{ status: string }>(`/api/projects/${id}/sync`, { method: 'POST' }),
};

// ─── 컴포넌트 ───────────────────────────────────────────────
export const componentsApi = {
  list: (projectId: string) =>
    apiFetch<Component[]>(`/api/projects/${projectId}/components`),
  get: (componentId: string) =>
    apiFetch<Component>(`/api/components/${componentId}`),
  resolve: (data: ResolveRequest) =>
    apiFetch<Component>('/api/components/resolve', { method: 'POST', body: JSON.stringify(data) }),
  scan: (projectId: string, data: ScanData) =>
    apiFetch<{ scanId: string }>(`/api/projects/${projectId}/scan`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ─── 정책 ───────────────────────────────────────────────────
export const policiesApi = {
  listByComponent: (componentId: string) =>
    apiFetch<Policy[]>(`/api/components/${componentId}/policies`),
  search: (query: string) =>
    apiFetch<Policy[]>(`/api/policies/search?q=${encodeURIComponent(query)}`),
  create: (data: CreatePolicyRequest) =>
    apiFetch<Policy>('/api/policies', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: UpdatePolicyRequest) =>
    apiFetch<Policy>(`/api/policies/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    apiFetch<void>(`/api/policies/${id}`, { method: 'DELETE' }),
  history: (id: string) =>
    apiFetch<PolicyVersion[]>(`/api/policies/${id}/history`),
};

// ─── 변경 요청 ───────────────────────────────────────────────
export const changeRequestsApi = {
  list: () => apiFetch<ChangeRequest[]>('/api/change-requests'),
  get: (id: string) => apiFetch<ChangeRequest>(`/api/change-requests/${id}`),
  create: (data: CreateChangeRequestRequest) =>
    apiFetch<ChangeRequest>('/api/change-requests', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: UpdateChangeRequestRequest) =>
    apiFetch<ChangeRequest>(`/api/change-requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  analyze: (id: string) =>
    apiFetch<{ queueId: string }>(`/api/change-requests/${id}/analyze`, { method: 'POST' }),
  status: (id: string) =>
    apiFetch<{ status: string; queueId?: string }>(`/api/change-requests/${id}/status`),
};

// ─── TODO ────────────────────────────────────────────────────
export const todosApi = {
  list: (filter?: { status?: string; projectId?: string }) => {
    const params = new URLSearchParams();
    if (filter?.status) params.set('status', filter.status);
    if (filter?.projectId) params.set('projectId', filter.projectId);
    return apiFetch<Todo[]>(`/api/todos?${params.toString()}`);
  },
  update: (id: string, data: { status: string }) =>
    apiFetch<Todo>(`/api/todos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  getPrompt: (id: string) =>
    apiFetch<{ prompt: string; targetFiles: string[] }>(`/api/todos/${id}/prompt`),
};

// ─── AI 정책 추천 ─────────────────────────────────────────────
export const aiApi = {
  recommendPolicyType: (description: string): Promise<PolicyTypeRecommendation> =>
    apiFetch('/api/ai/recommend-policy-type', {
      method: 'POST',
      body: JSON.stringify({ description }),
    }),
};

// ─── 타입 정의 ───────────────────────────────────────────────
export interface Project {
  projectId: string;
  projectName: string;
  projectDesc?: string;
  repoUrl?: string;
  baseUrl?: string;
  framework: string;
  status: string;
  syncStatus: string;
  lastSyncedAt?: string;
  repoBranch: string;
}

export interface Component {
  componentId: string;
  pbId: string;
  componentName: string;
  componentType: string;
  elementTag?: string;
  elementRole?: string;
  currentText?: string;
  currentSpec?: string;
  depthLevel: number;
  treePath?: string;
  status: string;
  children?: Component[];
}

export interface Policy {
  policyId: string;
  policyType: string;
  policyTitle: string;
  policyContent: string;
  scope: string;
  tags?: string;
  currentVersion: number;
  status: string;
  createdBy: string;
  createdAt: string;
}

export interface PolicyVersion {
  versionId: string;
  versionNo: number;
  policyContent: string;
  changeReason?: string;
  createdBy: string;
  createdAt: string;
}

export interface ChangeRequest {
  requestId: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  requestedBy: string;
  aiAnalysis?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Todo {
  todoId: string;
  title: string;
  prompt: string;
  targetFiles?: string;
  complexity: string;
  sortOrder: number;
  status: string;
  completedBy?: string;
  completedAt?: string;
  createdAt: string;
}

export interface PolicyTypeRecommendation {
  recommendedType: string;
  confidence: number;
  reason: string;
  alternatives: Array<{ type: string; reason: string }>;
}

export interface CreateProjectRequest {
  projectName: string;
  projectDesc?: string;
  repoUrl?: string;
  baseUrl?: string;
  framework?: string;
  repoBranch?: string;
  repoToken?: string;
}

export interface ResolveRequest {
  pbId?: string;
  componentName?: string;
  cssSelector?: string;
  pageRoute: string;
  projectId: string;
}

export interface ScanData {
  pageRoute: string;
  pageTitle?: string;
  components: Array<{
    pbId: string;
    componentName: string;
    componentType: string;
    cssSelector?: string;
    elementTag?: string;
    elementRole?: string;
    currentProps?: string;
    currentText?: string;
    parentPbId?: string;
    reactHierarchy?: string;
  }>;
  scannedBy?: string;
}

export interface CreatePolicyRequest {
  projectId: string;
  scope: string;
  pageId?: string;
  componentId?: string;
  policyType: string;
  policyTitle: string;
  policyContent: string;
  tags?: string;
  createdBy: string;
}

export interface UpdatePolicyRequest {
  policyTitle?: string;
  policyContent?: string;
  tags?: string;
  changeReason?: string;
  updatedBy: string;
}

export interface CreateChangeRequestRequest {
  componentId: string;
  requestedBy: string;
  title: string;
  description: string;
  currentState?: string;
  desiredState?: string;
  priority?: string;
}

export interface UpdateChangeRequestRequest {
  status?: string;
  priority?: string;
  title?: string;
  description?: string;
}
