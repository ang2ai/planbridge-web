// sidepanel.js — PlanBridge Side Panel Logic

(function() {
  'use strict';

  // ─── State ───
  let selectedElement = null;
  let inspectorActive = false;
  let autoScanActive = true;
  let policies = [];
  let todos = [];
  let scanData = null;
  let editingPolicyId = null;
  let editingTodoId = null;
  let currentTags = [];

  const STORAGE_KEY = 'planbridge_policies';
  const TODO_STORAGE_KEY = 'planbridge_todos';

  // ─── 목업 정책 조회 (mock-policies.js에서 로드) ───
  function getMockPolicies(pbId) {
    if (!pbId || typeof MOCK_POLICY_MAP === 'undefined') return { applied: [], inherited: [], global: [] };
    const applied = MOCK_POLICY_MAP[pbId] || [];
    const parts = pbId.split('.');
    const inherited = [];
    for (let i = 1; i < parts.length; i++) {
      const parentId = parts.slice(0, i).join('.');
      if (MOCK_POLICY_MAP[parentId]) inherited.push(...MOCK_POLICY_MAP[parentId]);
    }
    const rootKey = parts[0];
    const global = (rootKey !== pbId && MOCK_POLICY_MAP[rootKey]) ? MOCK_POLICY_MAP[rootKey] : [];
    return { applied, inherited, global };
  }

  // ─── Init ───
  async function init() {
    await loadPolicies();
    await loadTodos();
    setupEventListeners();
    setupMessageListener();
    renderTodoList();
  }

  // ─── Storage ───
  async function loadPolicies() {
    return new Promise(resolve => {
      chrome.storage.local.get(STORAGE_KEY, (result) => {
        policies = result[STORAGE_KEY] || [];
        resolve();
      });
    });
  }
  async function savePolicies() {
    return new Promise(resolve => {
      chrome.storage.local.set({ [STORAGE_KEY]: policies }, resolve);
    });
  }
  async function loadTodos() {
    return new Promise(resolve => {
      chrome.storage.local.get(TODO_STORAGE_KEY, (result) => {
        todos = result[TODO_STORAGE_KEY] || [];
        resolve();
      });
    });
  }
  async function saveTodos() {
    return new Promise(resolve => {
      chrome.storage.local.set({ [TODO_STORAGE_KEY]: todos }, resolve);
    });
  }

  // ─── Event Listeners ───
  function setupEventListeners() {
    document.getElementById('btnInspect').addEventListener('click', toggleInspector);
    document.getElementById('btnScan').addEventListener('click', scanPage);

    const btnAutoScan = document.getElementById('btnAutoScan');
    if (btnAutoScan) {
      btnAutoScan.addEventListener('click', toggleAutoScan);
      updateAutoScanButton();
    }

    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    // Policy modal
    document.getElementById('btnAddPolicy').addEventListener('click', () => openPolicyModal());
    document.getElementById('btnCancelPolicy').addEventListener('click', closePolicyModal);
    document.getElementById('btnSavePolicy').addEventListener('click', savePolicy);
    document.getElementById('policyModal').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closePolicyModal();
    });

    document.getElementById('tagInputField').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.value.trim()) {
        e.preventDefault();
        addTag(e.target.value.trim());
        e.target.value = '';
      }
    });

    // TODO modal
    document.getElementById('btnAddTodo').addEventListener('click', () => openTodoModal());
    document.getElementById('btnCancelTodo').addEventListener('click', closeTodoModal);
    document.getElementById('btnSaveTodo').addEventListener('click', saveTodo);
    document.getElementById('todoModal').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closeTodoModal();
    });

    // Search (component text search)
    let searchTimeout;
    document.getElementById('searchInput').addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => searchComponents(e.target.value), 200);
    });
  }

  // ─── Message Listener ───
  function setupMessageListener() {
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === 'ELEMENT_SELECTED') {
        selectedElement = message.data;
        renderSelectedElement();
        switchTab('policies');
      }
      if (message.type === 'SCAN_RESULT') {
        scanData = message.data;
        renderScanResult();
        if (!scanData._auto) switchTab('tree');
        const policyNote = scanData.hasPolicyData ? ' (정책 감지)' : '';
        showToast(`스캔 완료: ${scanData.componentCount}개${policyNote}`);
      }
      if (message.type === 'INSPECTOR_DEACTIVATED') {
        inspectorActive = false;
        const btn = document.getElementById('btnInspect');
        btn.classList.remove('active');
        btn.textContent = '🎯 선택';
      }
      if (message.type === 'INSPECTOR_ACTIVATED') {
        inspectorActive = true;
        const btn = document.getElementById('btnInspect');
        btn.classList.add('active');
        btn.textContent = '🎯 선택 중...';
      }
    });
  }

  // ─── Inspector / Scan / AutoScan ───
  function toggleInspector() {
    inspectorActive = !inspectorActive;
    const btn = document.getElementById('btnInspect');
    btn.classList.toggle('active', inspectorActive);
    btn.textContent = inspectorActive ? '🎯 선택 중...' : '🎯 선택';
    chrome.runtime.sendMessage({ type: 'TOGGLE_INSPECTOR' });
  }

  function scanPage() {
    document.getElementById('btnScan').textContent = '📡 스��� 중...';
    chrome.runtime.sendMessage({ type: 'SCAN_PAGE' });
    setTimeout(() => { document.getElementById('btnScan').textContent = '📡 스캔'; }, 2000);
  }

  function toggleAutoScan() {
    autoScanActive = !autoScanActive;
    updateAutoScanButton();
    chrome.runtime.sendMessage({ type: autoScanActive ? 'START_DOM_OBSERVER' : 'STOP_DOM_OBSERVER' });
    showToast(autoScanActive ? 'DOM 자동 스캔 ON' : 'DOM 자동 스캔 OFF');
  }
  function updateAutoScanButton() {
    const btn = document.getElementById('btnAutoScan');
    if (!btn) return;
    btn.classList.toggle('active', autoScanActive);
    btn.textContent = autoScanActive ? '🔄 자동' : '🔄 수동';
  }

  // ─── Tab Switching ───
  function switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.querySelector(`.tab[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`panel-${tabName}`).classList.add('active');
  }

  // ─── Render Selected Element ───
  function renderSelectedElement() {
    document.getElementById('noSelection').style.display = 'none';
    document.getElementById('selectionView').style.display = 'block';

    const el = selectedElement;
    const infoEl = document.getElementById('elementInfo');

    let tagType = 'dom', tagLabel = el.tagName, displayName = el.cssSelector?.split(' > ').slice(-1)[0] || '';
    if (el.pbId) { tagType = 'pbid'; tagLabel = 'pb-id'; displayName = el.pbId; }
    else if (el.componentName) { tagType = 'react'; tagLabel = 'React'; displayName = el.componentName; }

    let hierarchyHtml = '';
    if (el.reactHierarchy?.length > 0) {
      const crumbs = el.reactHierarchy.map((name, i) =>
        `<span class="crumb ${i === el.reactHierarchy.length - 1 ? 'current' : ''}">${name}</span>`
      ).join('<span class="sep">›</span>');
      hierarchyHtml = `<div class="hierarchy">${crumbs}</div>`;
    }

    infoEl.innerHTML = `
      <div class="el-header">
        <span class="el-tag ${tagType}">${tagLabel}</span>
        <span class="el-name">${displayName}</span>
      </div>
      <div class="el-meta">
        <span class="meta-chip"><span class="label">태그</span> &lt;${el.tagName}&gt;</span>
        ${el.pbType ? `<span class="meta-chip"><span class="label">pb-type</span> ${el.pbType}</span>` : ''}
        ${el.innerText ? `<span class="meta-chip"><span class="label">텍스트</span> ${el.innerText.substring(0, 30)}${el.innerText.length > 30 ? '...' : ''}</span>` : ''}
        <span class="meta-chip"><span class="label">경로</span> ${el.pageRoute}</span>
      </div>
      ${hierarchyHtml}
    `;

    renderPoliciesForElement();
    renderTodosForElement();
  }

  // ─── Render Policies ───
  function renderPoliciesForElement() {
    if (!selectedElement) return;
    const el = selectedElement;
    const elementKey = el.pbId || el.componentName || el.cssSelector;
    const pageRoute = el.pageRoute;

    const userApplied = policies.filter(p => p.elementKey === elementKey && (p.scope === 'ELEMENT' || p.scope === 'COMPONENT'));
    const userInherited = policies.filter(p => (p.scope === 'GLOBAL' && p.projectId === 'default-project') || (p.scope === 'PAGE' && p.pageRoute === pageRoute));
    // content.js 전달 ���이터 대신 sidepanel에서 직접 목업 정책 조회
    const pagePolicies = getMockPolicies(el.pbId);

    const totalApplied = userApplied.length + pagePolicies.applied.length;
    const totalInherited = userInherited.length + pagePolicies.inherited.length + pagePolicies.global.length;

    document.getElementById('appliedCount').textContent = totalApplied;
    document.getElementById('inheritedCount').textContent = totalInherited;
    document.getElementById('policyCount').textContent = totalApplied + totalInherited;

    const appliedContainer = document.getElementById('appliedPolicies');
    let appliedHtml = pagePolicies.applied.map(p => renderPagePolicyCard(p)).join('');
    appliedHtml += userApplied.map(p => renderPolicyCard(p, false)).join('');
    appliedContainer.innerHTML = appliedHtml || '<div style="color:var(--text-muted);font-size:12px;padding:8px 0;">등록된 정책이 없습니다</div>';

    const inheritedContainer = document.getElementById('inheritedPolicies');
    let inheritedHtml = '';
    if (pagePolicies.inherited.length > 0) { inheritedHtml += `<div style="font-size:10px;color:var(--text-muted);margin:4px 0 6px;font-weight:600;">▸ 상위 컴포넌트</div>` + pagePolicies.inherited.map(p => renderPagePolicyCard(p, true)).join(''); }
    if (pagePolicies.global.length > 0) { inheritedHtml += `<div style="font-size:10px;color:var(--text-muted);margin:8px 0 6px;font-weight:600;">▸ 글로벌</div>` + pagePolicies.global.map(p => renderPagePolicyCard(p, true)).join(''); }
    if (userInherited.length > 0) { inheritedHtml += `<div style="font-size:10px;color:var(--text-muted);margin:8px 0 6px;font-weight:600;">▸ 사용자 등록</div>` + userInherited.map(p => renderPolicyCard(p, true)).join(''); }
    inheritedContainer.innerHTML = inheritedHtml || '<div style="color:var(--text-muted);font-size:12px;padding:8px 0;">상속된 정책이 없습니다</div>';

    // policy card action handlers
    document.querySelectorAll('.policy-card[data-policy-id]').forEach(card => {
      card.querySelector('.btn-edit')?.addEventListener('click', (e) => { e.stopPropagation(); openPolicyModal(card.dataset.policyId); });
      card.querySelector('.btn-delete')?.addEventListener('click', (e) => { e.stopPropagation(); deletePolicy(card.dataset.policyId); });
    });
  }

  // ── 정책 탭 내 해당 요소 TODO 표시 ──
  function renderTodosForElement() {
    const section = document.getElementById('elementTodoSection');
    const container = document.getElementById('elementTodos');
    const badge = document.getElementById('elementTodoCount');
    if (!selectedElement) { section.style.display = 'none'; return; }

    const elementKey = selectedElement.pbId || selectedElement.componentName || selectedElement.cssSelector;
    const elementTodos = todos.filter(t => t.elementKey === elementKey);

    if (elementTodos.length === 0) { section.style.display = 'none'; return; }

    section.style.display = 'block';
    badge.textContent = elementTodos.length;
    container.innerHTML = elementTodos.map(t => renderTodoItem(t, true)).join('');
    bindTodoActions(container);
  }

  function renderPagePolicyCard(policy, isInherited) {
    const type = policy.policyType || policy.type || 'UI_SPEC';
    const scope = policy.scope || 'ELEMENT';
    const title = policy.title || policy.policyTitle || '';
    const content = policy.content || policy.policyContent || '';
    const version = policy.version || 1;
    let metaHtml = '';
    if (policy.tableMapping) metaHtml += `<div class="pc-meta-item">🗄️ <span class="mono">${policy.tableMapping}</span></div>`;
    if (policy.apiSpec) metaHtml += `<div class="pc-meta-item">🔌 <span class="mono">${policy.apiSpec}</span></div>`;
    if (policy.approvedBy) metaHtml += `<div class="pc-meta-item">✅ ${policy.approvedBy} (${policy.approvedAt || ''})</div>`;
    if (policy.policyId) metaHtml += `<div class="pc-meta-item" style="color:var(--text-muted);">ID: ${policy.policyId}</div>`;
    return `
      <div class="policy-card page-policy ${isInherited ? 'inherited' : ''}">
        <div class="pc-header"><div style="display:flex;align-items:center;gap:6px;"><span class="policy-type ${type}">${type}</span><span class="inherited-badge">${scope}</span></div><span class="pc-version">v${version}</span></div>
        <div class="pc-title">${title}</div>
        <div class="pc-content">${content}</div>
        ${metaHtml ? `<div class="pc-meta">${metaHtml}</div>` : ''}
      </div>`;
  }

  function renderPolicyCard(policy, isInherited) {
    const tagsHtml = policy.tags?.length ? `<div class="pc-tags">${policy.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : '';
    return `
      <div class="policy-card" data-policy-id="${policy.id}">
        <div class="pc-header"><div style="display:flex;align-items:center;gap:6px;"><span class="policy-type ${policy.type}">${policy.type}</span>${isInherited ? `<span class="inherited-badge">${policy.scope}</span>` : ''}</div><span class="pc-version">v${policy.version}</span></div>
        <div class="pc-title">${policy.title}</div>
        <div class="pc-content">${policy.content}</div>
        ${tagsHtml}
        <div class="pc-actions"><button class="btn btn-sm btn-ghost btn-edit">✏️ 수정</button><button class="btn btn-sm btn-ghost btn-delete">🗑 삭제</button></div>
      </div>`;
  }

  // ─── Policy CRUD ───
  function openPolicyModal(policyId = null) {
    editingPolicyId = policyId; currentTags = [];
    const title = document.getElementById('modalTitle');
    if (policyId) {
      const p = policies.find(x => x.id === policyId); if (!p) return;
      title.textContent = '정책 수정';
      document.getElementById('policyType').value = p.type;
      document.getElementById('policyTitle').value = p.title;
      document.getElementById('policyContent').value = p.content;
      const r = document.querySelector(`input[name="scope"][value="${p.scope}"]`); if (r) r.checked = true;
      currentTags = [...(p.tags || [])];
    } else {
      title.textContent = '새 정책 추가';
      document.getElementById('policyType').value = 'UI_SPEC';
      document.getElementById('policyTitle').value = '';
      document.getElementById('policyContent').value = '';
      document.querySelector('input[name="scope"][value="ELEMENT"]').checked = true;
    }
    renderTags();
    document.getElementById('policyModal').classList.add('open');
  }
  function closePolicyModal() { document.getElementById('policyModal').classList.remove('open'); editingPolicyId = null; currentTags = []; }

  async function savePolicy() {
    const type = document.getElementById('policyType').value;
    const scope = document.querySelector('input[name="scope"]:checked').value;
    const title = document.getElementById('policyTitle').value.trim();
    const content = document.getElementById('policyContent').value.trim();
    if (!title) { showToast('제목을 입력해주세요', 'warning'); return; }
    if (!content) { showToast('내용을 입력해주세요', 'warning'); return; }
    if (editingPolicyId) {
      const idx = policies.findIndex(p => p.id === editingPolicyId);
      if (idx >= 0) policies[idx] = { ...policies[idx], type, scope, title, content, tags: [...currentTags], version: policies[idx].version + 1, updatedAt: new Date().toISOString() };
    } else {
      const elementKey = selectedElement?.pbId || selectedElement?.componentName || selectedElement?.cssSelector || 'unknown';
      policies.push({ id: 'pol-' + Date.now() + '-' + Math.random().toString(36).substr(2,5), projectId: 'default-project', elementKey: (scope === 'GLOBAL' || scope === 'PAGE') ? null : elementKey, elementName: selectedElement?.displayId || 'Unknown', pageRoute: selectedElement?.pageRoute || '/', type, scope, title, content, tags: [...currentTags], version: 1, status: 'ACTIVE', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), createdBy: '기획자' });
    }
    await savePolicies(); closePolicyModal(); renderPoliciesForElement();
    showToast(editingPolicyId ? '정책이 수정되었습니다' : '정책이 등록되었습니다');
  }

  async function deletePolicy(policyId) {
    if (!confirm('이 정책을 삭제하시겠습니까?')) return;
    policies = policies.filter(p => p.id !== policyId);
    await savePolicies(); renderPoliciesForElement(); showToast('정책이 삭제되었습니다');
  }

  function addTag(tag) { if (!currentTags.includes(tag)) { currentTags.push(tag); renderTags(); } }
  function removeTag(tag) { currentTags = currentTags.filter(t => t !== tag); renderTags(); }
  function renderTags() {
    const container = document.getElementById('tagInput');
    const input = document.getElementById('tagInputField');
    container.querySelectorAll('.tag').forEach(el => el.remove());
    currentTags.forEach(tag => { const t = document.createElement('span'); t.className = 'tag'; t.innerHTML = `${tag} <span class="remove" data-tag="${tag}">×</span>`; container.insertBefore(t, input); });
    container.querySelectorAll('.remove').forEach(el => { el.addEventListener('click', () => removeTag(el.dataset.tag)); });
  }

  // =========================================================
  // ─── TODO CRUD ───
  // =========================================================
  function openTodoModal(todoId = null) {
    editingTodoId = todoId;
    const title = document.getElementById('todoModalTitle');
    if (todoId) {
      const t = todos.find(x => x.id === todoId); if (!t) return;
      title.textContent = 'TODO 수정';
      document.getElementById('todoTitle').value = t.title;
      document.getElementById('todoDesc').value = t.description || '';
      const r = document.querySelector(`input[name="todoPriority"][value="${t.priority}"]`); if (r) r.checked = true;
    } else {
      title.textContent = '변경 TODO 추가';
      document.getElementById('todoTitle').value = '';
      document.getElementById('todoDesc').value = '';
      document.querySelector('input[name="todoPriority"][value="MEDIUM"]').checked = true;
    }
    // 연결 요소 표시
    const elDisplay = document.getElementById('todoElementDisplay');
    if (selectedElement?.pbId || selectedElement?.componentName) {
      elDisplay.textContent = selectedElement.pbId || selectedElement.componentName;
      elDisplay.style.color = 'var(--info)';
    } else {
      elDisplay.textContent = '선택된 요소 없음 (정책 탭에서 요소를 먼저 선택하세요)';
      elDisplay.style.color = 'var(--text-muted)';
    }
    document.getElementById('todoModal').classList.add('open');
  }
  function closeTodoModal() { document.getElementById('todoModal').classList.remove('open'); editingTodoId = null; }

  async function saveTodo() {
    const title = document.getElementById('todoTitle').value.trim();
    const description = document.getElementById('todoDesc').value.trim();
    const priority = document.querySelector('input[name="todoPriority"]:checked').value;
    if (!title) { showToast('제목을 입력해주세요', 'warning'); return; }

    if (editingTodoId) {
      const idx = todos.findIndex(t => t.id === editingTodoId);
      if (idx >= 0) todos[idx] = { ...todos[idx], title, description, priority, updatedAt: new Date().toISOString() };
    } else {
      todos.push({
        id: 'todo-' + Date.now() + '-' + Math.random().toString(36).substr(2,5),
        elementKey: selectedElement?.pbId || selectedElement?.componentName || null,
        elementName: selectedElement?.displayId || null,
        pageRoute: selectedElement?.pageRoute || window.location?.pathname || '/',
        title, description, priority,
        done: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    await saveTodos(); closeTodoModal(); renderTodoList(); renderTodosForElement();
    showToast(editingTodoId ? 'TODO가 수정되었습니다' : 'TODO가 등록되었습니다');
  }

  async function deleteTodo(todoId) {
    if (!confirm('이 TODO를 삭제하시겠습니까?')) return;
    todos = todos.filter(t => t.id !== todoId);
    await saveTodos(); renderTodoList(); renderTodosForElement(); showToast('TODO가 삭제되었습니다');
  }

  async function toggleTodoDone(todoId) {
    const t = todos.find(x => x.id === todoId);
    if (t) { t.done = !t.done; t.updatedAt = new Date().toISOString(); }
    await saveTodos(); renderTodoList(); renderTodosForElement();
  }

  function renderTodoItem(todo, compact) {
    return `
      <div class="todo-item ${todo.done ? 'done' : ''}" data-todo-id="${todo.id}">
        <div class="todo-header">
          <input type="checkbox" class="todo-check" ${todo.done ? 'checked' : ''}>
          <div class="todo-body">
            <div class="todo-title">${todo.title}</div>
            ${!compact && todo.description ? `<div class="todo-desc">${todo.description}</div>` : ''}
            <div class="todo-meta">
              <span class="todo-priority ${todo.priority}">${todo.priority}</span>
              ${todo.elementName ? `<span class="todo-element" data-key="${todo.elementKey}">${todo.elementName}</span>` : ''}
              <span>${timeAgo(todo.createdAt)}</span>
            </div>
          </div>
        </div>
        <div class="todo-actions">
          <button class="btn btn-sm btn-ghost btn-todo-edit">✏️</button>
          <button class="btn btn-sm btn-ghost btn-todo-delete">🗑</button>
        </div>
      </div>`;
  }

  function renderTodoList() {
    const container = document.getElementById('todoList');
    document.getElementById('todoCount').textContent = todos.filter(t => !t.done).length;

    if (todos.length === 0) {
      container.innerHTML = `<div class="empty-state" style="padding:32px;"><div class="icon">��</div><strong>변경 TODO가 없습니다</strong><p>화면에 변경할 내용을 등록하세요.</p></div>`;
      return;
    }

    const pending = todos.filter(t => !t.done);
    const done = todos.filter(t => t.done);
    let html = '';
    if (pending.length) { html += pending.map(t => renderTodoItem(t, false)).join(''); }
    if (done.length) {
      html += `<div style="font-size:10px;color:var(--text-muted);margin:12px 0 6px;font-weight:600;">✅ 완료 (${done.length})</div>`;
      html += done.map(t => renderTodoItem(t, false)).join('');
    }
    container.innerHTML = html;
    bindTodoActions(container);
  }

  function bindTodoActions(container) {
    container.querySelectorAll('.todo-item').forEach(item => {
      const id = item.dataset.todoId;
      item.querySelector('.todo-check')?.addEventListener('change', () => toggleTodoDone(id));
      item.querySelector('.btn-todo-edit')?.addEventListener('click', (e) => { e.stopPropagation(); openTodoModal(id); });
      item.querySelector('.btn-todo-delete')?.addEventListener('click', (e) => { e.stopPropagation(); deleteTodo(id); });
      // 요소 이름 클릭 → 페이지에서 하이라이트
      item.querySelector('.todo-element')?.addEventListener('click', (e) => {
        const key = e.target.dataset.key;
        if (scanData?.components) {
          const comp = scanData.components.find(c => c.pbId === key || c.componentName === key);
          if (comp) chrome.runtime.sendMessage({ type: 'HIGHLIGHT_ELEMENT', cssSelector: comp.cssSelector });
        }
      });
    });
  }

  function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return '방금';
    if (m < 60) return `${m}분 전`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}시간 전`;
    return `${Math.floor(h / 24)}일 전`;
  }

  // =========================================================
  // ─── 검색: 화면 텍스트 기반 컴포넌트 찾기 ───
  // =========================================================
  function searchComponents(query) {
    const resultsEl = document.getElementById('searchResults');
    if (!query.trim()) {
      resultsEl.innerHTML = `<div class="empty-state" style="padding:32px;"><div class="icon">🔍</div><strong>텍스트로 컴포넌�� 찾기</strong><p>화면에 보이는 텍스트(버튼명, 라벨 등)를<br>입력하면 해당 컴포넌트를 찾아줍니다</p></div>`;
      return;
    }

    if (!scanData?.components?.length) {
      resultsEl.innerHTML = `<div class="empty-state" style="padding:32px;"><p>먼저 📡 스캔을 실행하세요</p></div>`;
      return;
    }

    const q = query.toLowerCase();
    const results = scanData.components.filter(c => {
      const text = (c.innerText || '').toLowerCase();
      const name = (c.componentName || '').toLowerCase();
      const pbId = (c.pbId || '').toLowerCase();
      return text.includes(q) || name.includes(q) || pbId.includes(q);
    });

    if (results.length === 0) {
      resultsEl.innerHTML = `<div class="empty-state" style="padding:32px;"><p>"${query}" 에 해당하는 컴포넌트가 없습니다</p></div>`;
      return;
    }

    resultsEl.innerHTML = `<div style="font-size:11px;color:var(--text-muted);margin-bottom:8px;">${results.length}개 컴포넌트 발견</div>` +
      results.map(c => {
        const badge = c.pbId ? '🏷' : c.componentName ? '⚛️' : '📌';
        const name = c.pbId || c.componentName || c.tagName;
        const text = (c.innerText || '').substring(0, 80);
        const highlighted = text ? highlightText(text, query) : '<span style="color:var(--text-muted);">(텍스트 없음)</span>';
        const mockPol = getMockPolicies(c.pbId);
        const policyCount = mockPol.applied.length;
        const policyBadge = policyCount > 0 ? `<span style="color:var(--accent);">${policyCount} 정책</span>` : '';
        return `
          <div class="search-result-item" data-selector="${encodeURIComponent(c.cssSelector)}" data-pb-id="${c.pbId || ''}">
            <div class="sr-name">${badge} ${highlightText(name, query)}</div>
            <div class="sr-text">${highlighted}</div>
            <div class="sr-meta">
              <span>&lt;${c.tagName}&gt;</span>
              ${c.pbType ? `<span>[${c.pbType}]</span>` : ''}
              ${policyBadge}
            </div>
          </div>`;
      }).join('');

    // 클릭 → 페이지 하이라이트 + 정책 탭 전환
    resultsEl.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        const selector = decodeURIComponent(item.dataset.selector);
        chrome.runtime.sendMessage({ type: 'HIGHLIGHT_ELEMENT', cssSelector: selector });
        const pbId = item.dataset.pbId;
        if (pbId) {
          const comp = scanData.components.find(c => c.pbId === pbId);
          if (comp) {
            selectedElement = {
              pbId: comp.pbId, componentName: comp.componentName, cssSelector: comp.cssSelector,
              tagName: comp.tagName, pbType: comp.pbType, innerText: comp.innerText,
              reactHierarchy: comp.reactHierarchy, reactProps: {},
              pageRoute: scanData.pageRoute, pageTitle: scanData.pageTitle, pageUrl: scanData.pageUrl,
              pagePolicies: comp.pagePolicies, displayId: comp.pbId, timestamp: new Date().toISOString()
            };
            renderSelectedElement();
            switchTab('policies');
          }
        }
      });
    });
  }

  // ─── Scan Result ───
  function renderScanResult() {
    if (!scanData) return;
    document.getElementById('noTree').style.display = 'none';
    document.getElementById('treeView').style.display = 'block';
    document.getElementById('treeCount').textContent = scanData.componentCount;

    const reactCount = scanData.components.filter(c => c.componentName).length;
    const pbIdCount = scanData.components.filter(c => c.pbId).length;
    const policyCount = scanData.components.filter(c => getMockPolicies(c.pbId).applied.length > 0).length;

    document.getElementById('scanStats').innerHTML = `
      <div class="stat"><div class="stat-value">${scanData.componentCount}</div><div class="stat-label">전체 요소</div></div>
      <div class="stat"><div class="stat-value">${reactCount}</div><div class="stat-label">React</div></div>
      <div class="stat"><div class="stat-value">${pbIdCount}</div><div class="stat-label">PB-ID</div></div>
      <div class="stat"><div class="stat-value">${policyCount}</div><div class="stat-label">정책</div></div>`;

    const grouped = {};
    scanData.components.forEach(comp => {
      let group;
      if (comp.pbId) { const p = comp.pbId.split('.'); group = p.length > 1 ? p.slice(0,2).join('.') : p[0]; }
      else { group = comp.reactHierarchy?.length > 1 ? comp.reactHierarchy[comp.reactHierarchy.length - 2] : '_root'; }
      if (!grouped[group]) grouped[group] = [];
      grouped[group].push(comp);
    });

    let treeHtml = '';
    Object.entries(grouped).forEach(([group, items]) => {
      const icon = group === '_root' ? '📄' : '📦';
      treeHtml += `<div class="scan-group"><div class="scan-group-header">${icon} ${group === '_root' ? 'Root' : group} (${items.length})</div><div class="scan-group-children">${items.map(item => {
        const name = item.pbId || item.componentName || item.tagName;
        const badge = item.pbId ? '🏷' : item.componentName ? '⚛️' : '📌';
        const itemPol = getMockPolicies(item.pbId);
        const pc = itemPol.applied.length ? `<span class="scan-policy-count">${itemPol.applied.length}</span>` : '';
        const pt = item.pbType ? `<span class="detail">[${item.pbType}]</span>` : '';
        return `<div class="scan-item" data-selector="${encodeURIComponent(item.cssSelector)}" data-pb-id="${item.pbId || ''}"><span class="icon">${badge}</span><span class="name">${name}</span>${pt}<span class="detail">&lt;${item.tagName}&gt;</span>${pc}</div>`;
      }).join('')}</div></div>`;
    });
    document.getElementById('scanTree').innerHTML = treeHtml;

    document.querySelectorAll('.scan-item').forEach(item => {
      item.addEventListener('click', () => {
        chrome.runtime.sendMessage({ type: 'HIGHLIGHT_ELEMENT', cssSelector: decodeURIComponent(item.dataset.selector) });
        const pbId = item.dataset.pbId;
        if (pbId) {
          const comp = scanData.components.find(c => c.pbId === pbId);
          if (comp) {
            selectedElement = { pbId: comp.pbId, componentName: comp.componentName, cssSelector: comp.cssSelector, tagName: comp.tagName, pbType: comp.pbType, innerText: comp.innerText, reactHierarchy: comp.reactHierarchy, reactProps: {}, pageRoute: scanData.pageRoute, pageTitle: scanData.pageTitle, pageUrl: scanData.pageUrl, pagePolicies: comp.pagePolicies, displayId: comp.pbId, timestamp: new Date().toISOString() };
            renderSelectedElement(); switchTab('policies');
          }
        }
      });
    });
  }

  function highlightText(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark style="background:rgba(233,69,96,0.3);color:inherit;border-radius:2px;padding:0 1px;">$1</mark>');
  }

  function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.background = type === 'warning' ? 'var(--warning)' : 'var(--success)';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  }

  init();
})();
