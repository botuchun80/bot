const items = [
  {id:1,img:"https://i.imgur.com/LYh8Prs.jpeg",name:"Burger",price:50000},
  {id:2,img:"https://i.imgur.com/o43iU1J.jpeg",name:"Cheeseburger",price:42000},
  {id:3,img:"https://i.imgur.com/7J7w3cP.jpeg",name:"Hamburger",price:45000},
  {id:4,img:"https://i.imgur.com/LYh8Prs.jpeg",name:"Double Cheeseburger",price:35000},
  {id:5,img:"https://i.imgur.com/LYh8Prs.jpeg",name:"Pepsi",price:10000},
  {id:6,img:"https://i.imgur.com/o43iU1J.jpeg",name:"Coca-Cola",price:10000}
];

let cart = {};          // {id: qty}
let phone   = null;     // telefon
let userLoc = null;     // {lat, lon}

const list      = document.getElementById('list');
const cartBar   = document.getElementById('cartBar');
const cartCount = document.getElementById('cartBarCount');
const cartSum   = document.getElementById('cartBarSum');
const overlay   = document.getElementById('cartOverlay');
const cartList  = document.getElementById('cartList');
const cartSumModal = document.getElementById('cartSum');

/* ---------- parallax ovqatlar -------------------- */
items.forEach((it,i)=>{
  const card = document.createElement('div');
  card.className = 'card';
  card.style.animationDelay = `${i*0.08}s`;
  card.innerHTML = `
    <img src="${it.img}" alt="">
    <div class="info">
      <div class="name">${it.name}</div>
      <div class="price">${it.price.toLocaleString()} so‘m</div>
      <button class="btn" onclick="addToCart(${it.id})">➕ Qo'shish</button>
    </div>`;
  list.appendChild(card);
});

/* ---------- savatga qo‘shish (diamond) ---------- */
function addToCart(id){
  cart[id] = (cart[id]||0)+1;
  renderCartBar();
  showSnack(items.find(i=>i.id===id).name+" qo'shildi ✨");
}

/* ---------- diamond cart bar ---------- */
function renderCartBar(){
  const totalQty = Object.values(cart).reduce((a,b)=>a+b,0);
  const totalSum = Object.entries(cart).reduce((sum,[id,q])=>{
    return sum + items.find(i=>i.id==id).price * q;
  },0);
  cartBar.classList.toggle('hidden', totalQty===0);
  cartCount.textContent = totalQty;
  cartSum.textContent = totalSum.toLocaleString()+" so‘m";
}
renderCartBar();

/* ---------- diamond ikonka bosilganda ---------- */
cartBar.addEventListener('click', openCart);

function openCart(){
  if(Object.keys(cart).length===0) return;
  updateCartModal();
  overlay.classList.remove('hidden');
}
function closeCart(){
  overlay.classList.add('hidden');
}

function updateCartModal(){
  cartList.innerHTML='';
  let total = 0;
  for(const id in cart){
    const {name,price} = items.find(i=>i.id==id);
    const qty = cart[id];
    total += price*qty;
    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `
      <span>${name} ×${qty}</span>
      <span>${(price*qty).toLocaleString()} so‘m
        <span class="cart-item-remove" onclick="removeFromCart(${id})">✖</span>
      </span>`;
    cartList.appendChild(li);
  }
  cartSumModal.textContent = total.toLocaleString()+" so‘m";
}
function removeFromCart(id){
  if(--cart[id]<=0) delete cart[id];
  renderCartBar();
  updateCartModal();
  if(Object.keys(cart).length===0) closeCart();
}

/* ---------- joylashuv (champagne) ---------- */
function checkLocation(){
  if(!window.Telegram.WebApp){
    alert("Joylashuv (test): 41.311151, 69.279737");
    userLoc = {latitude:41.311151,longitude:69.279737};
    sendOrder();
    return;
  }
  Telegram.WebApp.requestLocation(loc=>{
    if(!loc){
      alert("Iltimos, joylashuvni yoqing.");
      return;
    }
    userLoc = loc;
    sendOrder();
  });
}

/* ---------- buyurtma yuborish (diamond) ---------- */
function sendOrder(){
  if(Object.keys(cart).length===0) return;
  const order = Object.entries(cart).map(([id,q])=>{
    const {name,price} = items.find(i=>i.id==id);
    return {name,qty:q,sub:price*q};
  });
  const payload = {
    action:"order",
    phone:phone,
    items:order,
    location:userLoc
  };
  if(window.Telegram.WebApp){
    Telegram.WebApp.sendData(JSON.stringify(payload));
    Telegram.WebApp.close();
  }else{
    alert("Buyurtma (test)\n"+JSON.stringify(payload,null,2));
  }
}

/* ---------- telefon raqamni URL parametridan olish ---------- */
if(window.Telegram.WebApp){
  Telegram.WebApp.ready();
  const params = new URLSearchParams(window.location.search);
  phone = params.get("phone");
  Telegram.WebApp.expand();
}

/* ---------- glass snackbar ---------- */
function showSnack(text){
  const bar = document.getElementById('snack')||createSnack();
  bar.textContent=text;
  bar.classList.add('show');
  setTimeout(()=>bar.classList.remove('show'),2000);
}
function createSnack(){
  const s=document.createElement('div');
  s.id='snack';
  document.body.appendChild(s);
  return s;
}
