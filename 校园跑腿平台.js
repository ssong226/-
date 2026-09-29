/* ============================================================
 * 校园跑腿平台 · 交互脚本
 * 使用方式：在 HTML 的 </body> 前引入
 *   <script src="校园跑腿平台.js"></script>
 * 包含：hash 路由 / 三个注册方法 / 表单校验 / 注册成功视图
 *       本地数据存储（localStorage：保存注册记录，刷新不丢失）
 * ============================================================ */
(() => {
'use strict';
const $ = (id) => document.getElementById(id);

/* ============================================================
 * 注册链接配置区：
 * 把下面三个值替换成你的真实注册链接（例如 'https://platform.example.com/register/rider'），
 * 卡片上的「申请注册」与注册成功后的按钮将直接跳转到对应外部链接；
 * 留空时，按钮跳转到本页内的注册表单视图，注册流程在本页完成演示。
 * ============================================================ */
const REG_LINKS = { rider: '', user: '', merchant: '' };

/* ========== 三角色注册表单字段定义 ========== */
const ROLES = {
  rider: {
    title: '骑手注册',
    sub: '注册成为校园骑手，灵活接单赚零花。',
    fields: [
      { k: 'name', label: '姓名', ph: '请输入真实姓名' },
      { k: 'phone', label: '手机号', ph: '11 位手机号', tel: true },
      { k: 'campus', label: '所在校区', ph: '如：本部校区 / 东校区' },
      { k: 'shift', label: '可接单时段', ph: '如：17:00 - 22:00' }
    ]
  },
  user: {
    title: '用户注册',
    sub: '注册成为平台用户，下单寄取、随时召唤骑手。',
    fields: [
      { k: 'name', label: '昵称', ph: '请输入昵称' },
      { k: 'phone', label: '手机号', ph: '11 位手机号', tel: true },
      { k: 'studentId', label: '学号 / 工号', ph: '用于校园身份认证' },
      { k: 'campus', label: '常用校区', ph: '如：本部校区 / 东校区' }
    ]
  },
  merchant: {
    title: '商家平台注册',
    sub: '入驻校园配送网络，订单直达，店铺流量增长。',
    fields: [
      { k: 'shop', label: '店铺名称', ph: '请输入店铺名称' },
      { k: 'owner', label: '负责人姓名', ph: '请输入负责人姓名' },
      { k: 'phone', label: '手机号', ph: '11 位手机号', tel: true },
      { k: 'address', label: '店铺地址', ph: '如：北门商业街 12 号' }
    ]
  }
};
const ROLE_META = {
  rider: { name: '骑手', icon: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="17" r="2.4"/><circle cx="17" cy="17" r="2.4"/><path d="M6 17h3.5l4.5-7h4l2 3.4a2.4 2.4 0 0 1-1.6 3.6H17"/><path d="M14.8 10l1.4 4.2M4.5 6.5h5l2 3"/><path d="M2 13.5h6"/></svg>' },
  user: { name: '用户', icon: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 9h18"/><path d="M8 14h8M8 17h5"/></svg>' },
  merchant: { name: '商家', icon: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h16l-1.5 11a2 2 0 0 1-2 1.8h-9A2 2 0 0 1 5.5 19z"/><path d="M4 8l2.3-4h11.4L20 8"/><path d="M9 11v3M15 11v3"/></svg>' }
};
const ACCENT = {
  rider: { c: '#12B3A6', deep: '#0D8F84', soft: 'rgba(18,179,166,.10)' },
  user: { c: '#FF7A29', deep: '#E85D14', soft: 'rgba(255,122,41,.10)' },
  merchant: { c: '#5B6CF0', deep: '#4653C9', soft: 'rgba(91,108,240,.10)' }
};

/* ========== 三个注册方法 ==========
 * 分别对应 骑手注册 / 用户注册 / 商家平台注册 三个模块。
 * 当前为演示实现：校验字段 -> 模拟网络请求 700ms -> 返回注册结果。
 * 接入真实后端时，把 doRegister 中的模拟请求替换为
 * fetch(REG_LINKS[role], { method:'POST', body: JSON.stringify(data) }) 即可。
 * ============================================================ */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function doRegister(role, data) {
  await sleep(700); // 模拟提交到注册链接对应接口
  return { ok: true, role: role, data: data, ts: Date.now() };
}

function registerRider(data)  { return doRegister('rider', data); }
function registerUser(data)   { return doRegister('user', data); }
function registerMerchant(data) { return doRegister('merchant', data); }

/* ========== 校验 ========== */
function validate(role, values) {
  const errors = {};
  ROLES[role].fields.forEach((f) => {
    const v = (values[f.k] || '').trim();
    if (!v) { errors[f.k] = '该项不能为空'; }
    else if (f.tel && !/^1\d{10}$/.test(v)) { errors[f.k] = '请输入 11 位有效手机号'; }
  });
  return errors;
}

/* ========== 路由与视图 ========== */
const viewHome = $('view-home'), viewRegister = $('view-register');

function setNav(key) {
  document.querySelectorAll('#nav a[data-nav]').forEach((a) => {
    a.classList.toggle('active', a.dataset.nav === key);
  });
}
function showHome() {
  viewHome.classList.add('show');
  viewRegister.classList.remove('show');
  setNav('home');
}
function showRegister(role) {
  if (!ROLES[role]) { showHome(); return; }
  viewHome.classList.remove('show');
  viewRegister.classList.add('show');
  setNav(role);
  renderRegister(role);
}
function route() {
  const h = location.hash.replace(/^#\/?/, '');
  const m = h.match(/^register\/(rider|user|merchant)$/);
  m ? showRegister(m[1]) : showHome();
}
window.addEventListener('hashchange', route);

/* ========== 卡片注册链接提示 ========== */
function renderHints() {
  ['rider', 'user', 'merchant'].forEach((role) => {
    const link = REG_LINKS[role];
    $('hint-' + role).textContent = link ? '注册链接：' + link.replace(/^https?:\/\//, '') : '注册链接待配置';
  });
}

/* ========== 注册视图渲染 ========== */
function renderRegister(role) {
  const meta = ROLE_META[role], def = ROLES[role], ac = ACCENT[role];
  const box = $('registerBox');
  const fieldsHtml = def.fields.map((f) =>
    '<div class="form-item" data-k="' + f.k + '">' +
      '<label>' + f.label + '</label>' +
      '<input type="' + (f.tel ? 'tel' : 'text') + '" name="' + f.k + '" placeholder="' + f.ph + '" maxlength="' + (f.tel ? 11 : 40) + '">' +
      '<div class="err"></div>' +
    '</div>'
  ).join('');
  box.innerHTML =
    '<div class="register-head" style="--ac:' + ac.c + ';--ac-deep:' + ac.deep + ';--ac-soft:' + ac.soft + '">' +
      '<div class="r-icon">' + meta.icon + '</div>' +
      '<h2>' + def.title + '</h2>' +
      '<p>' + def.sub + '</p>' +
    '</div>' +
    '<form id="regForm" novalidate>' + fieldsHtml +
      '<button type="submit" class="btn-submit" style="background:' + ac.c + '">提交注册</button>' +
    '</form>' +
    '<a class="back-link" href="#/">← 返回首页</a>';
  box.style.setProperty('--ac', ac.c);
  box.style.setProperty('--ac-deep', ac.deep);
  box.style.setProperty('--ac-soft', ac.soft);

  $('regForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const values = {};
    def.fields.forEach((f) => { values[f.k] = box.querySelector('[name="' + f.k + '"]').value; });
    const errors = validate(role, values);
    def.fields.forEach((f) => {
      const item = box.querySelector('.form-item[data-k="' + f.k + '"]');
      const errEl = item.querySelector('.err');
      item.classList.toggle('bad', !!errors[f.k]);
      errEl.textContent = errors[f.k] || '';
    });
    if (Object.keys(errors).length) { toast('请检查表单填写'); return; }

    const btn = box.querySelector('.btn-submit');
    btn.disabled = true;
    btn.textContent = '提交中…';

    const fn = { rider: registerRider, user: registerUser, merchant: registerMerchant }[role];
    fn(values).then(() => {
      saveRecord(role, values);   // 注册成功后写入本地数据存储
      renderSuccess(role);
    });
  });
}

/* ========== 注册成功视图 ========== */
function renderSuccess(role) {
  const def = ROLES[role], ac = ACCENT[role], meta = ROLE_META[role];
  const link = REG_LINKS[role];
  const box = $('registerBox');
  box.innerHTML =
    '<div class="success" style="--ac:' + ac.c + ';--ac-deep:' + ac.deep + '">' +
      '<div class="ok-icon">' +
        '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 12 9 17 20 6"/></svg>' +
      '</div>' +
      '<h2>' + meta.name + '注册成功！</h2>' +
      '<p>你的' + def.title + '信息已提交，并已自动保存到本机浏览器' + (link ? '，即将为你打开官方注册链接' : '，平台审核通过后会通过短信通知你') + '。</p>' +
      '<button class="btn-success" id="btnSuccess">注册成功</button>' +
      '<a class="back-link" href="#/">← 返回首页</a>' +
    '</div>';
  box.style.setProperty('--ac', ac.c);
  box.style.setProperty('--ac-deep', ac.deep);
  $('btnSuccess').addEventListener('click', () => {
    if (link) { window.open(link, '_blank', 'noopener'); toast('已打开注册链接'); }
    else { location.hash = '#/'; toast('注册信息已提交并保存到本机'); }
  });
}

/* ========== Toast ========== */
let toastTimer;
function toast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2000);
}

/* ============================================================
 * 本地数据存储（localStorage）
 * 网页数据存到浏览器本地：注册记录数组，刷新页面不丢失。
 * 存储键：campus_runner_registry（最多保留 50 条）
 * ============================================================ */
const STORE_KEY = 'campus_runner_registry';

function loadRecords() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}
function saveRecord(role, data) {
  const recs = loadRecords();
  recs.unshift({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    role: role,
    ts: Date.now(),
    data: data
  });
  localStorage.setItem(STORE_KEY, JSON.stringify(recs.slice(0, 50)));
  renderStoreStats();
}
function removeRecord(id) {
  localStorage.setItem(STORE_KEY, JSON.stringify(loadRecords().filter((r) => r.id !== id)));
  renderStoreStats();
  renderStoreList();
}
function clearRecords() {
  localStorage.removeItem(STORE_KEY);
  renderStoreStats();
  renderStoreList();
}
function fmtTime(ts) {
  const d = new Date(ts);
  const p = (n) => String(n).padStart(2, '0');
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
}
function renderStoreStats() {
  $('storeCount').textContent = loadRecords().length;
}
function renderStoreList() {
  const recs = loadRecords();
  $('storeEmpty').classList.toggle('hidden', recs.length > 0);
  const list = $('storeList');
  list.innerHTML = '';
  recs.forEach((r) => {
    const meta = ROLE_META[r.role] || { name: r.role };
    const ac = ACCENT[r.role] ? ACCENT[r.role].c : '#67708A';
    const fields = (ROLES[r.role] ? ROLES[r.role].fields : [])
      .map((f) => f.label + '：' + (r.data[f.k] || '')).join(' · ');

    const item = document.createElement('div');
    item.className = 'store-item';
    const tag = document.createElement('span');
    tag.className = 'store-tag';
    tag.style.setProperty('--tag-c', ac);
    tag.textContent = meta.name;
    const main = document.createElement('span');
    main.className = 'store-main';
    const t = document.createElement('b');
    t.textContent = meta.name + '注册';
    const sub = document.createElement('small');
    sub.textContent = fmtTime(r.ts) + ' · ' + fields;
    main.appendChild(t);
    main.appendChild(sub);
    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'store-del';
    del.textContent = '删除';
    del.addEventListener('click', () => removeRecord(r.id));
    item.appendChild(tag);
    item.appendChild(main);
    item.appendChild(del);
    list.appendChild(item);
  });
}

/* ========== 事件绑定与启动 ========== */
document.querySelectorAll('.btn-apply').forEach((btn) => {
  btn.addEventListener('click', () => { location.hash = '#/register/' + btn.dataset.role; });
});
$('btnViewStore').addEventListener('click', () => {
  renderStoreList();
  $('storeDialog').showModal();
});
$('btnCloseStore').addEventListener('click', () => $('storeDialog').close());
$('storeDialog').addEventListener('click', (e) => {
  if (e.target === $('storeDialog')) $('storeDialog').close();
});
$('btnClearStore').addEventListener('click', () => {
  if (!loadRecords().length) { toast('暂无记录可清空'); return; }
  if (confirm('确定清空全部本地注册记录吗？')) {
    clearRecords();
    toast('本地注册记录已清空');
  }
});

renderHints();
renderStoreStats();
route();
})();
//（注：内容由AI生成）
