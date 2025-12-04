const items = [
  {id:1,img:"https://i.imgur.com/LYh8Prs.jpeg",name:"Burger",price:50000},
  {id:2,img:"https://i.imgur.com/o43iU1J.jpeg",name:"Cheeseburger",price:42000},
  {id:3,img:"https://i.imgur.com/7J7w3cP.jpeg",name:"Hamburger",price:45000},
  {id:4,img:"https://i.imgur.com/LYh8Prs.jpeg",name:"Double Cheeseburger",price:35000},
  {id:5,img:"https://i.imgur.com/LYh8Prs.jpeg",name:"Pepsi",price:10000},
  {id:6,img:"https://i.imgur.com/o43iU1J.jpeg",name:"Coca-Cola",price:10000}
];

const list = document.getElementById('list');

items.forEach((it,i)=>{
  const card = document.createElement('div');
  card.className = 'card';
  card.style.animationDelay = `${i*0.08}s`;
  card.innerHTML = `
    <img src="${it.img}" alt="">
    <div class="info">
      <div class="name">${it.name}</div>
      <div class="price">${it.price.toLocaleString()} so‘m</div>
      <button class="btn" onclick="sendItem('${it.name}')">Tanlash</button>
    </div>`;
  list.appendChild(card);
});

function sendItem(name){
  if(window.Telegram && window.Telegram.WebApp){
    Telegram.WebApp.sendData(JSON.stringify({action:"select",item:name}));
  }else{
    alert("Tanlandi (test): "+name);
  }
}

/* ---------- xavfsiz expand ---------- */
if(window.Telegram && window.Telegram.WebApp){
  Telegram.WebApp.ready();
  const params = new URLSearchParams(window.location.search);
  phone = params.get("phone");
  Telegram.WebApp.expand();
}
