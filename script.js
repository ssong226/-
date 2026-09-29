/* script.js */
/* ============================================================
 * 校园跑腿平台 · 交互脚本
 * hash路由、登录注册、跑腿大厅、二手集市、外卖大厅、个人中心
 * ============================================================ */
(() => {
'use strict';
const $ = (id) => document.getElementById(id);
const REG_LINKS = { student: '', merchant: '' };

// ====================== 模拟业务数据 ======================
//跑腿任务（包含配送时间段）
const TASK_DATA = [
  {id:1,type:'express',title:'快递代取',desc:'从北门快递站取3个快递送到3号宿舍楼302',reward:6,from:'北门快递站',to:'3号宿舍楼302',publisher:'张同学',timeSlot:'今天 12:00-14:00'},
  {id:2,type:'doc',title:'资料代送',desc:'打印好的复习资料送到教学楼A203教室',reward:8,from:'二食堂打印店',to:'教学楼A203',publisher:'李同学',timeSlot:'今天 14:00-16:00'},
  {id:3,type:'buy',title:'代买零食饮料',desc:'超市买可乐、薯片送到5栋411宿舍',reward:7,from:'校内超市',to:'5栋411',publisher:'王同学',timeSlot:'今天 18:00-19:00'},
  {id:4,type:'digital',title:'取送数码配件',desc:'维修店取回充电器送到1栋201',reward:9,from:'校园数码维修店',to:'1栋201',publisher:'赵同学',timeSlot:'今天 16:00-17:00'},
  {id:5,type:'send',title:'代发快递',desc:'把衣物拿到快递点寄回家里，已经打包完毕',reward:10,from:'7栋608',to:'南门快递驿站',publisher:'刘同学',timeSlot:'今天 17:00-18:00'},
  {id:6,type:'express',title:'大件快递代取',desc:'北门取一个大箱子，搬到6栋504，重物',reward:12,from:'北门快递站',to:'6栋504',publisher:'陈同学',timeSlot:'今天 19:00-20:00'},
  {id:7,type:'buy',title:'代买早餐',desc:'一食堂买豆浆包子送到4栋105，早上8点前送到',reward:5,from:'一食堂',to:'4栋105',publisher:'周同学',timeSlot:'明天 07:00-08:00'},
  {id:8,type:'doc',title:'试卷代交',desc:'作业试卷交到行政楼205办公室',reward:6,from:'2栋307',to:'行政楼205',publisher:'吴同学',timeSlot:'明天 09:00-10:00'}
];
//任务类型中文标签
const TASK_TYPE_NAME = {
  express:"快递代取", doc:"资料代送", buy:"代买代办", digital:"数码取送", send:"代发快递"
};

//跑腿配送小助手 · 待配送外卖订单数据（全部为外卖订单）
const DELIVERY_ORDERS = [
  {id:'D001',type:'外卖配送',shop:'校园一号快餐',item:'红烧鸡腿饭 x1 + 可乐 x1',route:'校园一号快餐店 → 5栋 411',distance:'约 420 米',fee:4.80,publisher:'王同学 · 159****5678',deadline:'12:15 前送达',remain:'剩余 20 分钟'},
  {id:'D002',type:'外卖配送',shop:'茶小甜奶茶店',item:'珍珠奶茶大杯 x2 + 杨枝甘露 x1',route:'茶小甜奶茶店 → 3号宿舍楼 302',distance:'约 650 米',fee:5.50,publisher:'张同学 · 138****1234',deadline:'14:30 前送达',remain:'剩余 35 分钟'},
  {id:'D003',type:'外卖配送',shop:'香锅麻辣拌',item:'单人麻辣拌套餐 x1 + 牛肉香锅 x1',route:'香锅麻辣拌店 → 7栋 608',distance:'约 880 米',fee:7.20,publisher:'李同学 · 186****3344',deadline:'18:00 前送达',remain:'剩余 1 小时 10 分'},
  {id:'D004',type:'外卖配送',shop:'煎饼果子早餐铺',item:'经典煎饼果子 x2 + 豆浆 x2',route:'煎饼果子早餐铺 → 1栋 201',distance:'约 530 米',fee:4.50,publisher:'周同学 · 177****9012',deadline:'21:00 前送达',remain:'剩余 2 小时'},
  {id:'D005',type:'外卖配送',shop:'校园一号快餐',item:'鱼香肉丝盖饭 x1 + 番茄鸡蛋面 x1',route:'校园一号快餐店 → 6栋 504',distance:'约 760 米',fee:6.00,publisher:'赵同学 · 135****6677',deadline:'17:30 前送达',remain:'剩余 50 分钟'}
];

//二手商品
const SECOND_DATA = [
  {id:1,name:'大学高等数学教材第七版',price:22,quality:'8成新',category:'教材书籍',desc:'无缺页，少量笔记，高数课本'},
  {id:2,name:'小米无线蓝牙耳机',price:89,quality:'9成新',category:'数码电子',desc:'配件齐全，功能完好'},
  {id:3,name:'篮球7号标准比赛球',price:45,quality:'7成新',category:'运动器材',desc:'正常使用，轻微磨损'},
  {id:4,name:'宿舍床上书桌小桌子',price:28,quality:'全新',category:'生活用品',desc:'未拆封，宿舍神器'},
  {id:5,name:'四级英语真题全套',price:15,quality:'8成新',category:'教材书籍',desc:'部分题目做过'},
  {id:6,name:'机械键盘青轴87键',price:110,quality:'9成新',category:'数码电子',desc:'按键全部正常'},
  {id:7,name:'秋冬连帽卫衣',price:32,quality:'8成新',category:'服饰鞋帽',desc:'尺码XL，无破损'},
  {id:8,name:'收纳整理箱大号',price:20,quality:'7成新',category:'生活用品',desc:'结实耐用'}
];

//外卖商家菜品
const FOOD_DATA = [
  {shopId:1,shopName:'校园一号快餐',score:4.6,deliveryTime:'25‑35分钟',minPrice:12,
   foods:[{fname:'红烧鸡腿饭',price:14.5},{fname:'鱼香肉丝盖饭',price:13},{fname:'番茄鸡蛋面',price:11}]},
  {shopId:2,shopName:'茶小甜奶茶店',score:4.8,deliveryTime:'20‑30分钟',minPrice:10,
   foods:[{fname:'珍珠奶茶大杯',price:9},{fname:'杨枝甘露',price:13},{fname:'柠檬红茶',price:7.5}]},
  {shopId:3,shopName:'香锅麻辣拌',score:4.4,deliveryTime:'30‑40分钟',minPrice:15,
   foods:[{fname:'单人麻辣拌套餐',price:16},{fname:'牛肉香锅',price:21},{fname:'方便面加菜',price:8}]},
  {shopId:4,shopName:'煎饼果子早餐铺',score:4.7,deliveryTime:'15‑25分钟',minPrice:8,
   foods:[{fname:'经典煎饼果子',price:7},{fname:'烤肠煎饼',price:9},{fname:'豆浆',price:3}]}
];

/* ========== 角色与登录 ========== */
const ROLES = {
  student: {
    title: '学生注册',
    sub: '注册成为平台学生用户，发布任务、买卖二手、点餐取件。',
    fields: [
      { k: 'name', label: '昵称', ph: '请输入昵称' },
      { k: 'phone', label: '手机号', ph: '11 位手机号', tel: true },
      { k: 'studentId', label: '学号', ph: '用于校园身份认证' },
      { k: 'campus', label: '常用校区', ph: '如：本部校区 / 东校区' }
    ]
  },
  merchant: {
    title: '商家注册',
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
  student: { name: '学生', icon: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5a9 9 0 0 1 8 .9 9 9 0 0 1 8-.9V19a9 9 0 0 0-8 .9A9 9 0 0 0 4 19z" /><path d="M12 6.4V19" /></svg>' },
  merchant: { name: '商家', icon: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h16l-1.5 11a2 2 0 0 1-2 1.8h-9A2 2 0 0 1 5.5 19z" /><path d="M4 8l2.3-4h11.4L20 8" /><path d="M9 11v3M15 11v3" /></svg>' }
};
const ACCENT = {
  student: { c: '#12B3A6', deep: '#0D8F84', soft: 'rgba(18,179,166,.10)' },
  merchant: { c: '#5B6CF0', deep: '#4653C9', soft: 'rgba(91,108,240,.10)' }
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function doRegister(role, data) {
  await sleep(700);
  return { ok: true, role: role, data: data, ts: Date.now() };
}
function registerStudent(data)  { return doRegister('student', data); }
function registerMerchant(data) { return doRegister('merchant', data); }
async function doLogin(data) {
  await sleep(600);
  return { ok: true, data: data, ts: Date.now() };
}

function validate(role, values) {
  const errors = {};
  (ROLES[role] ? ROLES[role].fields : []).forEach((f) => {
    const v = (values[f.k] || '').trim();
    if (!v) { errors[f.k] = '该项不能为空'; }
    else if (f.tel && !/^1\d{10}$/.test(v)) { errors[f.k] = '请输入 11 位有效手机号'; }
  });
  return errors;
}
function validateLogin(values) {
  const errors = {};
  if (!(values.account || '').trim()) { errors.account = '请输入手机号或学号'; }
  if (!(values.password || '').trim()) { errors.password = '请输入密码'; }
  return errors;
}

/* ========== 当前用户 & 用户数据（localStorage 持久化） ========== */
const USER_KEY = 'campus_runner_current_user';
const USER_DATA_KEY = 'campus_runner_user_data';

function getCurrentUser() {
  try { const raw = localStorage.getItem(USER_KEY); return raw ? JSON.parse(raw) : null; }
  catch (e) { return null; }
}
function setCurrentUser(user) { localStorage.setItem(USER_KEY, JSON.stringify(user)); }
function clearCurrentUser() { localStorage.removeItem(USER_KEY); }

function getEmptyUserData() {
  return { myTasks: [], myGoods: [], myDeliveries: [], myPublished: [], cart: [] };
}
function loadUserData() {
  try {
    const raw = localStorage.getItem(USER_DATA_KEY);
    return raw ? Object.assign(getEmptyUserData(), JSON.parse(raw)) : getEmptyUserData();
  } catch (e) { return getEmptyUserData(); }
}
function saveUserData(data) { localStorage.setItem(USER_DATA_KEY, JSON.stringify(data)); }

let userData = loadUserData();

/* ========== 导航栏个人中心入口状态 ========== */
function updateNavAuth() {
  const link = $('authNavLink');
  const user = getCurrentUser();
  if (user) {
    link.textContent = '个人中心';
    link.setAttribute('href', '#/profile');
    link.dataset.nav = 'profile';
    link.classList.remove('enter');
  } else {
    link.textContent = '注册登录';
    link.setAttribute('href', '#/auth/login');
    link.dataset.nav = 'auth';
    link.classList.add('enter');
  }
}

/* ========== 页面渲染 ========== */
function renderTaskList(filterType='all'){
  const box = $('taskList');
  let list = TASK_DATA;
  if(filterType !== 'all') list = TASK_DATA.filter(t=>t.type === filterType);
  if(list.length === 0){ box.innerHTML = '<div class="empty-tip">暂无该类型任务</div>'; return; }
  const acceptedIds = userData.myTasks.map(t => t.id);
  box.innerHTML = list.map(item=>`
    <div class="task-item">
      <div class="task-left">
        <span class="task-type-tag">${TASK_TYPE_NAME[item.type]}</span>
        <div class="task-title">${item.title}</div>
        <div class="task-desc">${item.desc}</div>
        <div class="task-addr">📍${item.from} → ${item.to}</div>
        <div class="task-time">🕐 期望配送时段：${item.timeSlot || '面议'}</div>
        <div class="task-pub">发布人：${item.publisher}</div>
      </div>
      <div class="task-right">
        <div class="task-reward">赏金 ¥${item.reward}</div>
        <button class="task-accept-btn" data-tid="${item.id}" ${acceptedIds.includes(item.id) ? 'disabled' : ''}>
          ${acceptedIds.includes(item.id) ? '已接单' : '立即接单'}
        </button>
      </div>
    </div>
  `).join('');
  box.querySelectorAll('.task-accept-btn').forEach(btn=>{
    if (btn.disabled) return;
    btn.onclick = function(){
      const tid = Number(this.dataset.tid);
      const t = TASK_DATA.find(x=>x.id===tid);
      if (!getCurrentUser()) { toast('请先登录后再接单'); location.hash = '#/auth/login'; return; }
      if (!userData.myTasks.find(x=>x.id===t.id)) {
        userData.myTasks.unshift(Object.assign({}, t, {acceptedAt: Date.now(), status:'配送中'}));
        saveUserData(userData);
      }
      toast(`✅已接单：${t.title}，请尽快完成配送！`);
      this.textContent='已接单';
      this.disabled=true;
    }
  })
}

function renderSecondList(min=null,max=null,quality='all',cat='all'){
  let arr = [...SECOND_DATA];
  if(min!==null && min!=='') arr = arr.filter(x=>x.price >= Number(min));
  if(max!==null && max!=='') arr = arr.filter(x=>x.price <= Number(max));
  if(quality!=='all') arr = arr.filter(x=>x.quality === quality);
  if(cat!=='all') arr = arr.filter(x=>x.category === cat);

  const box = $('secondList');
  if(arr.length===0){ box.innerHTML = '<div class="empty-tip">没有匹配商品，请修改筛选条件</div>'; return; }
  box.innerHTML = arr.map(good=>`
  <div class="second-item">
    <div class="good-name">${good.name}</div>
    <div class="good-meta">
      <span class="good-quality">${good.quality}</span>
      <span class="good-cat">${good.category}</span>
    </div>
    <div class="good-desc">${good.desc}</div>
    <div class="good-price">¥${good.price}</div>
    <div class="good-btns">
      <button class="cart-add-btn" data-gid="${good.id}">加入购物车</button>
      <button class="buy-now-btn" data-gid="${good.id}">立即下单</button>
    </div>
  </div>
  `).join('');

  box.querySelectorAll('.cart-add-btn').forEach(btn=>{
    btn.onclick=()=>{
      if (!getCurrentUser()) { toast('请先登录后再加入购物车'); location.hash = '#/auth/login'; return; }
      const gid = Number(btn.dataset.gid);
      const g = SECOND_DATA.find(x=>x.id===gid);
      userData.cart.push(Object.assign({}, g, {addedAt: Date.now()}));
      saveUserData(userData);
      $('cartCount').textContent = userData.cart.length;
      toast(`🛒已将【${g.name}】加入购物车`);
    }
  })
  box.querySelectorAll('.buy-now-btn').forEach(btn=>{
    btn.onclick=()=>{
      if (!getCurrentUser()) { toast('请先登录后再下单'); location.hash = '#/auth/login'; return; }
      const gid = Number(btn.dataset.gid);
      const g = SECOND_DATA.find(x=>x.id===gid);
      toast(`📝下单成功！商品：${g.name}，请联系卖家校内交易！`);
    }
  })
}

function renderFoodList(){
  const box = $('foodList');
  box.innerHTML = FOOD_DATA.map(shop=>`
  <div class="food-shop-card">
    <div class="shop-head">
      <h3>${shop.shopName}</h3>
      <div class="shop-info">⭐${shop.score}｜配送${shop.deliveryTime}｜起送¥${shop.minPrice}</div>
    </div>
    <div class="food-items">
      ${shop.foods.map(f=>`
      <div class="food-item-row">
        <span class="fname">${f.fname}</span>
        <span class="fprice">¥${f.price}</span>
        <button class="food-add-btn" data-fname="${f.fname}" data-fprice="${f.price}">+加购</button>
      </div>
      `).join('')}
    </div>
  </div>
  `).join('');
  box.querySelectorAll('.food-add-btn').forEach(btn=>{
    btn.onclick=()=>{
      const name = btn.dataset.fname;
      const p = btn.dataset.fprice;
      toast(`🍔已加购【${name}】¥${p}，可继续选餐后提交订单`);
    }
  })
}

/* ========== 跑腿配送小助手 · 外卖订单渲染 ========== */
function renderDeliveryOrders(){
  const box = $('deliveryOrderList');
  if (!box) return;
  if (DELIVERY_ORDERS.length === 0) {
    box.innerHTML = '<div class="empty-tip">暂无待配送外卖订单，稍后再来看看吧～</div>';
    return;
  }
  const acceptedIds = userData.myDeliveries.map(o => o.id);
  box.innerHTML = DELIVERY_ORDERS.map(order => `
    <div class="delivery-order-item" data-order-id="${order.id}">
      <div class="delivery-order-header">
        <span class="delivery-order-tag">${order.type}</span>
        <span class="delivery-order-time">⏱ 期望 ${order.deadline}</span>
      </div>
      <div class="delivery-order-body">
        <div class="delivery-order-row"><span class="delivery-order-label">🏪 商家：</span><span>${order.shop}</span></div>
        <div class="delivery-order-row"><span class="delivery-order-label">🍱 餐品：</span><span>${order.item}</span></div>
        <div class="delivery-order-row"><span class="delivery-order-label">📍 路线：</span><span>${order.route}</span></div>
        <div class="delivery-order-row"><span class="delivery-order-label">📏 距离：</span><span>${order.distance}</span></div>
        <div class="delivery-order-row"><span class="delivery-order-label">💰 配送费：</span><span class="delivery-fee">¥ ${order.fee.toFixed(2)}</span></div>
        <div class="delivery-order-row"><span class="delivery-order-label">👤 发布人：</span><span>${order.publisher}</span></div>
      </div>
      <div class="delivery-order-footer">
        <span class="delivery-order-deadline">${order.remain}</span>
        <button class="delivery-order-btn ${acceptedIds.includes(order.id)?'accepted':''}" data-order-id="${order.id}" ${acceptedIds.includes(order.id)?'disabled':''}>
          ${acceptedIds.includes(order.id) ? '已接单' : '我要配送'}
        </button>
      </div>
    </div>
  `).join('');

  box.querySelectorAll('.delivery-order-btn').forEach(btn => {
    if (btn.disabled) return;
    btn.onclick = function () {
      if (!getCurrentUser()) { toast('请先登录后再接单'); location.hash = '#/auth/login'; return; }
      const oid = this.dataset.orderId;
      const order = DELIVERY_ORDERS.find(o => o.id === oid);
      if (!order) return;
      if (!userData.myDeliveries.find(o => o.id === order.id)) {
        userData.myDeliveries.unshift(Object.assign({}, order, {acceptedAt: Date.now(), status:'配送中'}));
        saveUserData(userData);
      }
      this.textContent = '已接单';
      this.disabled = true;
      this.classList.add('accepted');
      toast(`✅ 已接单！配送费 ¥${order.fee.toFixed(2)}，请尽快送达 ${order.route.split('→')[1].trim()}`);
    };
  });
}

/* ========== 个人中心渲染 ========== */
function renderProfile() {
  const box = $('profileContent');
  const user = getCurrentUser();

  if (!user) {
    box.innerHTML = `
      <div class="profile-guest">
        <h2>还未登录</h2>
        <p>登录后即可查看你的接单任务、上架商品和购物车</p>
        <button class="btn-submit" style="background:var(--brand)" onclick="location.hash='#/auth/login'">去登录 / 注册</button>
      </div>`;
    return;
  }

  const meta = ROLE_META[user.role] || { name: '用户' };
  const accent = ACCENT[user.role] ? ACCENT[user.role].c : '#FF7A29';
  const name = user.name || '校园用户';
  const avatarChar = name.charAt(0).toUpperCase();
  const phone = user.phone || '未填写';
  const extra = user.role === 'student'
    ? `学号：${user.data.studentId || '—'} ｜ 校区：${user.data.campus || '—'}`
    : `店铺：${user.data.shop || '—'} ｜ 地址：${user.data.address || '—'}`;

  const totalFee = userData.cart.reduce((s, x) => s + Number(x.price), 0);

  box.innerHTML = `
    <div class="profile-card">
      <div class="profile-avatar">${avatarChar}</div>
      <div class="profile-info">
        <h2>${name}</h2>
        <p><span class="profile-role">${meta.name}</span>手机号：${phone}</p>
        <p>${extra}</p>
      </div>
      <button class="profile-logout" id="btnLogout">退出登录</button>
    </div>

    <div class="profile-stats">
      <div class="profile-stat"><b>${userData.myTasks.length}</b><span>我的接单任务</span></div>
      <div class="profile-stat"><b>${userData.myDeliveries.length}</b><span>我的配送订单</span></div>
      <div class="profile-stat"><b>${userData.myGoods.length}</b><span>我的上架商品</span></div>
      <div class="profile-stat"><b>${userData.cart.length}</b><span>购物车商品</span></div>
      <div class="profile-stat"><b>${userData.myPublished.length}</b><span>我发布的任务</span></div>
    </div>

    <div class="profile-section">
      <div class="profile-section-head">
        <h3>🏃 我的接单任务</h3>
        <span class="go-link" onclick="location.hash='#/task'">去跑腿大厅接单 →</span>
      </div>
      <div class="profile-list">
        ${userData.myTasks.length === 0
          ? '<div class="profile-empty-box">还没有接单记录，去跑腿大厅看看有哪些新任务吧～</div>'
          : userData.myTasks.map(t => `
            <div class="profile-list-item" data-kind="task" data-id="${t.id}">
              <div class="item-main">
                <div class="item-title">
                  <span class="item-tag">${TASK_TYPE_NAME[t.type] || t.type}</span>${t.title}
                </div>
                <div class="item-sub">📍 ${t.from} → ${t.to}<br>🕐 期望时段：${t.timeSlot || '面议'} ｜ 发布人：${t.publisher}</div>
              </div>
              <div class="item-price">¥${t.reward}</div>
              <button class="item-btn primary" data-action="finish-task" data-id="${t.id}">完成配送</button>
            </div>`).join('')
        }
      </div>
    </div>

    <div class="profile-section">
      <div class="profile-section-head">
        <h3>🛵 我的配送订单</h3>
        <span class="go-link" onclick="location.hash='#/food'">去外卖大厅接单 →</span>
      </div>
      <div class="profile-list">
        ${userData.myDeliveries.length === 0
          ? '<div class="profile-empty-box">还没有配送订单，去跑腿配送小助手看看待配送外卖吧～</div>'
          : userData.myDeliveries.map(o => `
            <div class="profile-list-item">
              <div class="item-main">
                <div class="item-title"><span class="item-tag blue">外卖配送</span>${o.shop}</div>
                <div class="item-sub">🍱 ${o.item}<br>📍 ${o.route} ｜ 📏 ${o.distance}<br>👤 发布人：${o.publisher}</div>
              </div>
              <div class="item-price">¥${o.fee.toFixed(2)}</div>
              <button class="item-btn primary" data-action="finish-delivery" data-id="${o.id}">送达完成</button>
            </div>`).join('')
        }
      </div>
    </div>

    <div class="profile-section">
      <div class="profile-section-head">
        <h3>🛒 我的上架商品</h3>
        <span class="go-link" onclick="location.hash='#/secondhand'">去二手集市上架 →</span>
      </div>
      <div class="profile-list">
        ${userData.myGoods.length === 0
          ? '<div class="profile-empty-box">还没有上架商品，去二手集市发布你的闲置好物吧～</div>'
          : userData.myGoods.map(g => `
            <div class="profile-list-item">
              <div class="item-main">
                <div class="item-title">${g.name}</div>
                <div class="item-sub"><span class="item-tag orange">${g.quality}</span><span class="item-tag blue">${g.category}</span><br>${g.desc || '暂无描述'}</div>
              </div>
              <div class="item-price">¥${g.price}</div>
              <button class="item-btn" data-action="remove-good" data-id="${g.id}">下架</button>
            </div>`).join('')
        }
      </div>
    </div>

    <div class="profile-section">
      <div class="profile-section-head">
        <h3>📚 我的购物车</h3>
        <span class="go-link" onclick="location.hash='#/secondhand'">去二手集市逛逛 →</span>
      </div>
      <div class="profile-list">
        ${userData.cart.length === 0
          ? '<div class="profile-empty-box">购物车是空的，去二手集市淘点好物吧～</div>'
          : userData.cart.map((g, i) => `
            <div class="profile-list-item">
              <div class="item-main">
                <div class="item-title">${g.name}</div>
                <div class="item-sub"><span class="item-tag orange">${g.quality}</span><span class="item-tag blue">${g.category}</span></div>
              </div>
              <div class="item-price">¥${g.price}</div>
              <button class="item-btn" data-action="remove-cart" data-index="${i}">移除</button>
            </div>`).join('')
        }
      </div>
      ${userData.cart.length > 0 ? `
        <div class="cart-summary">
          <div class="total">共 ${userData.cart.length} 件，合计 <b>¥${totalFee.toFixed(2)}</b></div>
          <div class="acts">
            <button class="btn-clear-cart" id="btnClearCart">清空购物车</button>
            <button class="btn-checkout" id="btnCheckout">结算下单</button>
          </div>
        </div>` : ''}
    </div>

    <div class="profile-section">
      <div class="profile-section-head">
        <h3>📝 我发布的任务</h3>
        <span class="go-link" onclick="location.hash='#/task'">去发布新任务 →</span>
      </div>
      <div class="profile-list">
        ${userData.myPublished.length === 0
          ? '<div class="profile-empty-box">还没有发布过跑腿任务，去跑腿大厅发布吧～</div>'
          : userData.myPublished.map(t => `
            <div class="profile-list-item">
              <div class="item-main">
                <div class="item-title"><span class="item-tag">${TASK_TYPE_NAME[t.type] || t.type}</span>${t.title}</div>
                <div class="item-sub">📍 ${t.from} → ${t.to}<br>🕐 期望时段：${t.timeSlot || '面议'}</div>
              </div>
              <div class="item-price">¥${t.reward}</div>
            </div>`).join('')
        }
      </div>
    </div>
  `;

  // 退出登录
  $('btnLogout').addEventListener('click', () => {
    if (!confirm('确定要退出登录吗？')) return;
    clearCurrentUser();
    updateNavAuth();
    toast('已退出登录');
    location.hash = '#/';
  });

  // 完成配送任务
  box.querySelectorAll('[data-action="finish-task"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      userData.myTasks = userData.myTasks.filter(t => t.id !== id);
      saveUserData(userData);
      toast('🎉 任务已完成，赏金已到账！');
      renderProfile();
    });
  });

  // 完成外卖配送
  box.querySelectorAll('[data-action="finish-delivery"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      userData.myDeliveries = userData.myDeliveries.filter(o => o.id !== id);
      saveUserData(userData);
      toast('🎉 外卖已送达，配送费已到账！');
      renderProfile();
    });
  });

  // 下架商品
  box.querySelectorAll('[data-action="remove-good"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      userData.myGoods = userData.myGoods.filter(g => g.id !== id);
      saveUserData(userData);
      toast('商品已下架');
      renderProfile();
    });
  });

  // 移除购物车项
  box.querySelectorAll('[data-action="remove-cart"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.index);
      userData.cart.splice(idx, 1);
      saveUserData(userData);
      $('cartCount').textContent = userData.cart.length;
      toast('已从购物车移除');
      renderProfile();
    });
  });

  // 清空购物车
  const btnClear = $('btnClearCart');
  if (btnClear) {
    btnClear.addEventListener('click', () => {
      if (!confirm('确定清空购物车吗？')) return;
      userData.cart = [];
      saveUserData(userData);
      $('cartCount').textContent = 0;
      toast('购物车已清空');
      renderProfile();
    });
  }

  // 结算下单
  const btnCheckout = $('btnCheckout');
  if (btnCheckout) {
    btnCheckout.addEventListener('click', () => {
      if (!userData.cart.length) return;
      const total = userData.cart.reduce((s, x) => s + Number(x.price), 0);
      if (!confirm(`共 ${userData.cart.length} 件商品，合计 ¥${total.toFixed(2)}，确认下单？`)) return;
      userData.cart = [];
      saveUserData(userData);
      $('cartCount').textContent = 0;
      toast('🎉 下单成功！请与卖家联系校内交易');
      renderProfile();
    });
  }
}

/* ========== 路由与视图 ========== */
const viewHome = $('view-home'),
      viewAuth = $('view-auth'),
      viewTask = $('view-task'),
      viewSecondhand = $('view-secondhand'),
      viewFood = $('view-food'),
      viewProfile = $('view-profile');

function hideAllView(){
  [viewHome, viewAuth, viewTask, viewSecondhand, viewFood, viewProfile].forEach(v => v.classList.remove('show'));
}
function setNav(key) {
  document.querySelectorAll('#nav a[data-nav]').forEach((a) => {
    a.classList.toggle('active', a.dataset.nav === key);
  });
}
function showHome() { hideAllView(); viewHome.classList.add('show'); setNav('home'); }
function showAuth(view) { hideAllView(); viewAuth.classList.add('show'); setNav('auth'); renderAuth(view); }
function showTask(){ hideAllView(); viewTask.classList.add('show'); setNav('task'); renderTaskList('all'); }
function showSecondhand(){
  hideAllView(); viewSecondhand.classList.add('show'); setNav('secondhand');
  $('cartCount').textContent = userData.cart.length;
  renderSecondList();
}
function showFood(){
  hideAllView(); viewFood.classList.add('show'); setNav('food');
  renderFoodList(); renderDeliveryOrders();
}
function showProfile(){
  hideAllView(); viewProfile.classList.add('show'); setNav('profile');
  renderProfile();
}

function route() {
  const h = location.hash.replace(/^#\/?/, '');
  if (h === 'auth/login') { showAuth('login'); return; }
  const m = h.match(/^auth\/register\/(student|merchant)$/);
  if (m) { showAuth('register/' + m[1]); return; }
  if (h === 'auth' || h.startsWith('auth')) { showAuth('login'); return; }
  if (h === 'task'){ showTask(); return; }
  if (h === 'secondhand'){ showSecondhand(); return; }
  if (h === 'food'){ showFood(); return; }
  if (h === 'profile'){ showProfile(); return; }
  showHome();
}
window.addEventListener('hashchange', route);

/* ========== 首页卡片跳转 ========== */
document.querySelectorAll('.btn-apply[data-go]').forEach((btn) => {
  btn.addEventListener('click', () => { location.hash = '#/' + btn.dataset.go; });
});

//跑腿筛选
document.querySelectorAll('.task-filter').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.task-filter').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    renderTaskList(btn.dataset.type);
  })
});

//二手筛选
$('filterSecondBtn').addEventListener('click',()=>{
  renderSecondList($('priceMin').value, $('priceMax').value, $('qualitySel').value, $('catSel').value);
});

/* ========== 外卖大厅双tab切换 ========== */
document.querySelectorAll('.food-tab-item').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.food-tab-item').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const target = tab.dataset.foodtab;
    const shopPanel = $('foodShopPanel'), deliveryPanel = $('foodDeliveryPanel');
    if (target === 'shop') {
      shopPanel.classList.remove('hidden'); deliveryPanel.classList.add('hidden');
    } else {
      shopPanel.classList.add('hidden'); deliveryPanel.classList.remove('hidden');
      renderDeliveryOrders();
    }
  });
});

/* ========== 发布任务弹窗 ========== */
$('openTaskPublishBtn').addEventListener('click', () => {
  if (!getCurrentUser()) { toast('请先登录后再发布任务'); location.hash = '#/auth/login'; return; }
  $('dialogPublishTask').showModal();
});
$('closeTaskDlg').addEventListener('click', () => $('dialogPublishTask').close());
$('dialogPublishTask').addEventListener('click', (e) => {
  if (e.target === $('dialogPublishTask')) $('dialogPublishTask').close();
});
$('publishTaskForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const f = e.target;
  const v = {
    taskType: f.taskType.value,
    title: f.title.value.trim(),
    desc: f.desc.value.trim(),
    fromAddr: f.fromAddr.value.trim(),
    toAddr: f.toAddr.value.trim(),
    reward: Number(f.reward.value) || 0,
    timeSlot: f.timeSlot.value.trim() || '面议',
    publisher: f.publisher.value.trim()
  };
  if (!v.title || !v.fromAddr || !v.toAddr || !v.publisher || v.reward < 1) {
    toast('请完整填写任务信息（赏金至少1元）'); return;
  }
  const newTask = {
    id: Date.now(),
    type: v.taskType,
    title: v.title,
    desc: v.desc,
    reward: v.reward,
    from: v.fromAddr,
    to: v.toAddr,
    publisher: v.publisher,
    timeSlot: v.timeSlot
  };
  TASK_DATA.unshift(newTask);
  userData.myPublished.unshift(newTask);
  saveUserData(userData);
  $('dialogPublishTask').close();
  f.reset();
  toast('✅ 任务发布成功！');
  renderTaskList('all');
});

/* ========== 上架商品弹窗 ========== */
$('openSellGoodsBtn').addEventListener('click', () => {
  if (!getCurrentUser()) { toast('请先登录后再上架商品'); location.hash = '#/auth/login'; return; }
  $('dialogSellGoods').showModal();
});
$('closeSellDlg').addEventListener('click', () => $('dialogSellGoods').close());
$('dialogSellGoods').addEventListener('click', (e) => {
  if (e.target === $('dialogSellGoods')) $('dialogSellGoods').close();
});
$('sellGoodsForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const f = e.target;
  const v = {
    name: f.gname.value.trim(),
    category: f.gcat.value,
    quality: f.gquality.value,
    price: Number(f.gprice.value),
    desc: f.gdesc.value.trim()
  };
  if (!v.name || !(v.price > 0)) { toast('请填写商品名称和有效售价'); return; }
  const newGood = {
    id: Date.now(),
    name: v.name,
    price: v.price,
    quality: v.quality,
    category: v.category,
    desc: v.desc
  };
  SECOND_DATA.unshift(newGood);
  userData.myGoods.unshift(newGood);
  saveUserData(userData);
  $('dialogSellGoods').close();
  f.reset();
  toast('✅ 商品已上架！');
  renderSecondList();
});

/* ========== 注册登录视图渲染 ========== */
const AUTH_TABS = [
  { key: 'login', label: '登录' },
  { key: 'register/student', label: '学生注册' },
  { key: 'register/merchant', label: '商家注册' }
];
function renderAuth(view) {
  const box = $('authBox');
  const tabsHtml = AUTH_TABS.map((t) =>
    '<button type="button" class="auth-tab' + (t.key === view ? ' active' : '') + '" data-tab="' + t.key + '">' + t.label + '</button>'
  ).join('');
  let bodyHtml = '';
  if (view === 'login') {
    bodyHtml =
      '<div class="auth-body">' +
        '<p class="auth-sub">登录后可发布跑腿任务、浏览二手集市、点校外卖。</p>' +
        '<form id="authForm" novalidate>' +
          '<div class="form-item" data-k="account"><label>手机号 / 学号</label><input type="text" name="account" placeholder="请输入手机号或学号" maxlength="20"><div class="err"></div></div>' +
          '<div class="form-item" data-k="password"><label>密码</label><input type="password" name="password" placeholder="请输入密码" maxlength="30"><div class="err"></div></div>' +
          '<button type="submit" class="btn-submit" style="background:var(--brand)">登 录</button>' +
        '</form>' +
        '<p class="auth-note">演示环境：任意非空账号密码均可登录（若已有注册记录，将自动匹配）。</p>' +
      '</div>';
  } else {
    const role = view.split('/')[1];
    const def = ROLES[role], ac = ACCENT[role];
    const fieldsHtml = def.fields.map((f) =>
      '<div class="form-item" data-k="' + f.k + '">' +
        '<label>' + f.label + '</label>' +
        '<input type="' + (f.tel ? 'tel' : 'text') + '" name="' + f.k + '" placeholder="' + f.ph + '" maxlength="' + (f.tel ? 11 : 40) + '">' +
        '<div class="err"></div>' +
      '</div>'
    ).join('');
    bodyHtml =
      '<div class="auth-body">' +
        '<p class="auth-sub">' + def.sub + '</p>' +
        '<form id="authForm" novalidate>' + fieldsHtml +
          '<button type="submit" class="btn-submit" style="background:' + ac.c + '">提交注册</button>' +
        '</form>' +
      '</div>';
  }
  box.innerHTML = '<div class="auth-tabs">' + tabsHtml + '</div>' + bodyHtml;
  box.querySelectorAll('.auth-tab').forEach((tab) => {
    tab.addEventListener('click', () => { location.hash = '#/auth/' + tab.dataset.tab; });
  });
  const form = $('authForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const values = {};
    form.querySelectorAll('input').forEach((inp) => { values[inp.name] = inp.value; });
    if (view === 'login') { submitLogin(form, values); return; }
    submitRegister(form, values, view.split('/')[1]);
  });
}

function submitLogin(form, values) {
  const errors = validateLogin(values);
  form.querySelectorAll('.form-item').forEach((item) => {
    const k = item.dataset.k;
    const errEl = item.querySelector('.err');
    item.classList.toggle('bad', !!errors[k]);
    errEl.textContent = errors[k] || '';
  });
  if (Object.keys(errors).length) { toast('请检查登录信息'); return; }
  const btn = form.querySelector('.btn-submit');
  btn.disabled = true;
  btn.textContent = '登录中…';
  doLogin(values).then(() => {
    // 尝试从注册记录中匹配
    const account = values.account.trim();
    const recs = loadRecords();
    let user = null;
    for (const r of recs) {
      if (r.data.phone === account || r.data.studentId === account) {
        user = {
          role: r.role,
          data: r.data,
          name: r.data.name || r.data.shop || r.data.owner || '校园用户',
          phone: r.data.phone || account
        };
        break;
      }
    }
    if (!user) {
      user = {
        role: 'student',
        data: { name: account, phone: account },
        name: account,
        phone: account
      };
    }
    setCurrentUser(user);
    updateNavAuth();
    toast('登录成功，欢迎回来！');
    location.hash = '#/profile';
  });
}

function submitRegister(form, values, role) {
  const errors = validate(role, values);
  form.querySelectorAll('.form-item').forEach((item) => {
    const k = item.dataset.k;
    const errEl = item.querySelector('.err');
    item.classList.toggle('bad', !!errors[k]);
    errEl.textContent = errors[k] || '';
  });
  if (Object.keys(errors).length) { toast('请检查表单填写'); return; }
  const btn = form.querySelector('.btn-submit');
  btn.disabled = true;
  btn.textContent = '提交中…';
  const fn = { student: registerStudent, merchant: registerMerchant }[role];
  fn(values).then(() => {
    saveRecord(role, values);
    // 自动登录
    setCurrentUser({
      role: role,
      data: values,
      name: values.name || values.shop || values.owner || '校园用户',
      phone: values.phone
    });
    updateNavAuth();
    renderSuccess(role);
  });
}

function renderSuccess(role) {
  const def = ROLES[role], ac = ACCENT[role], meta = ROLE_META[role];
  const link = REG_LINKS[role];
  const box = $('authBox');
  box.innerHTML =
    '<div class="auth-body">' +
      '<div class="success" style="--ac:' + ac.c + ';--ac-deep:' + ac.deep + '">' +
        '<div class="ok-icon">' +
          '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 12 9 17 20 6" /></svg>' +
        '</div>' +
        '<h2>' + meta.name + '注册成功！</h2>' +
        '<p>你的' + def.title + '信息已提交，并已自动保存到本机浏览器' + (link ? '，即将为你打开官方注册链接' : '，点击下方按钮进入个人中心') + '。</p>' +
        '<button class="btn-success" id="btnSuccess" style="background:' + ac.c + '">进入个人中心</button>' +
        '<a class="back-link" href="#/">← 返回首页</a>' +
      '</div>' +
    '</div>';
  $('btnSuccess').addEventListener('click', () => {
    if (link) { window.open(link, '_blank', 'noopener'); toast('已打开注册链接'); }
    location.hash = '#/profile';
  });
}

let toastTimer;
function toast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2000);
}

/* ========== localStorage 注册记录 ========== */
const STORE_KEY = 'campus_runner_registry';
function loadRecords() {
  try { const raw = localStorage.getItem(STORE_KEY); return raw ? JSON.parse(raw) : []; }
  catch (e) { return []; }
}
function saveRecord(role, data) {
  const recs = loadRecords();
  recs.unshift({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    role: role, ts: Date.now(), data: data
  });
  localStorage.setItem(STORE_KEY, JSON.stringify(recs.slice(0, 50)));
  renderStoreStats();
}
function removeRecord(id) {
  localStorage.setItem(STORE_KEY, JSON.stringify(loadRecords().filter((r) => r.id !== id)));
  renderStoreStats(); renderStoreList();
}
function clearRecords() {
  localStorage.removeItem(STORE_KEY);
  renderStoreStats(); renderStoreList();
}
function fmtTime(ts) {
  const d = new Date(ts);
  const p = (n) => String(n).padStart(2, '0');
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
}
function renderStoreStats() { $('storeCount').textContent = loadRecords().length; }
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
    main.appendChild(t); main.appendChild(sub);
    const del = document.createElement('button');
    del.type = 'button'; del.className = 'store-del'; del.textContent = '删除';
    del.addEventListener('click', () => removeRecord(r.id));
    item.appendChild(tag); item.appendChild(main); item.appendChild(del);
    list.appendChild(item);
  });
}

/* ========== 启动 ========== */
$('btnViewStore').addEventListener('click', () => { renderStoreList(); $('storeDialog').showModal(); });
$('btnCloseStore').addEventListener('click', () => $('storeDialog').close());
$('storeDialog').addEventListener('click', (e) => { if (e.target === $('storeDialog')) $('storeDialog').close(); });
$('btnClearStore').addEventListener('click', () => {
  if (!loadRecords().length) { toast('暂无记录可清空'); return; }
  if (confirm('确定清空全部本地注册记录吗？')) { clearRecords(); toast('本地注册记录已清空'); }
});

renderStoreStats();
updateNavAuth();
route();
})();