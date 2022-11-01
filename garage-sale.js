var myItems = [];
var items = [];

const formatterPrice = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

const getTemplateItemInCart = (products, isBuyerView = false) => {
  let template = '';

  products.forEach(p => {
    template += `<li id="item-${p.id}" class="list-group-item list-group-item-action d-flex justify-content-between align-items-start ${p.isSold ? 'list-group-item-success' : ''}">
      <div class="w-25">
        <img class="img-fluid" src="${p.photos[0]?.path}" alt="${p.name}">
      </div>
      <div class="ms-2 me-auto">
        <div class="fw-bold">${p.name}</div>
        ${isBuyerView ? `<small>${p.description}</small>` : ''}
        ${formatterPrice.format(p.price)}
      </div>
      ${isBuyerView ? '' : `<button class="btn btn-sm btn-danger"><i class="fa-solid fa-trash" onclick="removeItem(${p.id})"></i></button>`}
    </li>`;
  });

  return template;
}

const listBuyers = () => {
  let searchParams = new URLSearchParams(window.location.search);
  let buyer = searchParams.get('buyer');
  let delivered = searchParams.get('delivered');
  let info = '';

  if (delivered === 'yes') {
    info = getDeliveredItems(true);
    info += getDeliveredItems(false);
  }
  else if (buyer && buyer === 'all-admin') {
    let buyers = new Set();
    items.filter(p => p.buyer).forEach(p => {
      buyers.add(p.buyer);
    });
    buyers.forEach(b => info += getBuyerItems(b));
  }
  else if (buyer) {
    info = getBuyerItems(buyer);
  }

  $('#divBuyerItems').append(`<ul class="list-group">${info}</ul>`);
}

const getBuyerItems = (buyer) => {
  let itemsBuyer = '';
  const filtered = items.filter(i => i.buyer === buyer);
  const value = formatterPrice.format(filtered.reduce((acc, val) => acc += val.price, 0));
  itemsBuyer = `<li class="list-group-item list-group-item-warning d-flex justify-content-between align-items-start"><h5>${buyer}</h5><span>Total: ${value}</span></li>`;
  itemsBuyer += getTemplateItemInCart(filtered, true);
  return itemsBuyer;
}

const getDeliveredItems = (isDelivered) => {
  let itemsBuyer = '';
  const filtered = items.filter(i => i.isDelivered === isDelivered);
  const value = formatterPrice.format(filtered.reduce((acc, val) => acc += val.price, 0));
  itemsBuyer = `<li class="list-group-item list-group-item-warning d-flex justify-content-between align-items-start"><h5>${isDelivered ? 'Entregado' : 'No Entregado'}</h5><span>Total: ${value}</span></li>`;
  itemsBuyer += getTemplateItemInCart(filtered, true);
  return itemsBuyer;
}

toastr.options.preventDuplicates = true;
toastr.options.progressBar = true;

toastr.info(
  `Este sitio web no guarda cookies, al agregar productos al carrito de compras,
  si la página se refresca se pierde el estado del carrito de compras`, 'Anuncio Acerca de Cookies',
  { timeOut: 0, closeButton: true, positionClass: 'toast-top-center' }
);

$.getJSON('info/items.json', (data) => {
  let sold = data.products.filter(p => p.isSold);
  let notSold = data.products.filter(p => !p.isSold);
  sold = sold.sort((a, b) => a.name.localeCompare(b.name));
  notSold = notSold.sort((a, b) => a.name.localeCompare(b.name));

  $('#num-available').text(notSold.length);
  $('#num-sold').text(sold.length);
  
  items = notSold.concat(sold);
  items.forEach((p, i) => drawProducts(i, p));
  
  if (window.location.pathname.includes('garage-buyers.html')) {
    listBuyers();
  }
});

function drawProducts(index, product) {
  let buttonsImg = '';
  let images = '';
  let carouselButtons = '';
  let imgOrVideo = '';

  const target = `ci-${index}`;
  const vendida = '<div class="overlay-sold"><div class="text-sold position-absolute top-50 start-50 fs-2 badge rounded-pill bg-success shadow-lg">Producto Vendido</div></div>';
  product.id = index;

  product.photos.forEach((p, i) => {
    buttonsImg += `<button type="button" data-bs-target="#${target}" data-bs-slide-to="${i}" class="active" aria-current="true" aria-label="Foto ${i + 1}"></button>`;
    images += `<div class="carousel-item ${i === 0 ? "active" : ""}"><img src="${p.path}" class="d-block ${p.style}" alt="${product.name}"></div>`;
  });

  if (product.photos.length > 1) {
    carouselButtons = `
    <button class="carousel-control-prev" type="button" data-bs-target="#${target}" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#${target}" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>`;
  }
  else {
    buttonsImg = '';
  }

  imgOrVideo = `
    <div id="${target}" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-indicators">${buttonsImg}</div>
      <div class="carousel-inner">${images}</div>
      ${carouselButtons}
    </div>`;

  if (product.video) {
    imgOrVideo = product.video;
  }

  const cardProduct = `
  <div class="col">
    <div class="card h-100 ${product.isSold ? "border-success" : ""}">
        <h5 class="card-header">
          ${imgOrVideo}
          ${product.isSold ? vendida : ""}
        </h5>
        <div class="card-body">
          <h5 class="card-title">
            ${product.name}
          </h5>
          <div class="card-text">
            <span class="float-start">
              ${product.description ? `${product.description}<br />` : ''}
              <span ${product.isSold ? 'class="text-decoration-line-through' : ''}"><span class="fw-bold">Precio:</span> ${formatterPrice.format(product.price)}</span>
            </span>
            ${product.isSold ? "" : `<button onclick="addItem(${product.id})" class="btn btn-success float-end"><i class="fa-solid fa-cart-plus"></i></button>`}
          </div>
        </div>
    </div>
  </div>`;

  $('#root').append(cardProduct);
}

function addItem(id) {
  let myItem = myItems.find((i) => i.id === id);
  let item = items.find((i) => i.id === id);

  if (!myItem && item) {
    myItems.push(item);
    setNumberItems();
    toastr.info(`El artículo <strong>${item.name}</strong> se ha agregado al carrito!`);
  } else {
    toastr.warning(`El artículo <strong>${myItem.name}</strong> ya se encuentra en el carrito!`);
  }
}

function removeItem(id) {
  myItems = myItems.filter((i) => i.id !== id);
  $(`#item-${id}`).remove();
  setVisibleFooter();
  setNumberItems();
}

function setNumberItems() {
  if (myItems.length > 0) {
    $('#spItems').removeClass('invisible');
    $('#spItems').text(myItems.length);
  } else {
    $('#spItems').addClass('invisible');
    setEmptyMessage();
  }
}

function displayMyItems() {
  setVisibleFooter();
  $('#divItemsInCart').empty();
  let template = getTemplateItemInCart(myItems);

  if (template) {
    $('#divItemsInCart').append(`<ul class="list-group">${template}</ul>`);
  }
  else {
    setEmptyMessage();
  }
}

function setEmptyMessage() {
  $('#divItemsInCart').empty();
  $('#divItemsInCart').text('No hay artículos en el carrito');
}

function setVisibleFooter() {
  if (myItems) {
    myItems.length > 0 ? $('#modalFooter').removeClass('invisible') : $('#modalFooter').addClass('invisible');
    $('#totalPrice').text(formatterPrice.format(myItems.reduce((acc, val) => acc += val.price, 0)));
  }
  else {
    $('#modalFooter').removeClass('invisible');
  }
}

function downloadItems() {
  let downloadItems = '';

  myItems.forEach((p, i) => {
    downloadItems += `${i + 1})\t${formatterPrice.format(p.price).padStart(10, ' ')}\t${p.name}\n`;
  });

  if (downloadItems) {
    let fileName = `my-products-${(new Date()).toISOString().replace(":", "").replace(".", "")}.txt`;
    let btnDownload = document.createElement('a');
    btnDownload.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(items)}`);
    btnDownload.setAttribute('download', fileName);
    btnDownload.style.display = 'none';
    document.body.appendChild(btnDownload);
    btnDownload.click();
    document.body.removeChild(btnDownload);
    toastr.success(`Se ha creado el archivo <strong>${fileName}</strong> con los artículos agregados al carrito, ahora puedes enviarme un mensaje con los artículos deseados!`, '', { timeOut: 0, closeButton: true });
  }
}
