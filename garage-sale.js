var myItems = [];
var items = [];
toastr.options.preventDuplicates = true;
toastr.options.progressBar = true;
toastr.options.positionClass = "toast-bottom-center";

$.getJSON("info/items.json", (data) => {
  data.products.forEach((p, i) => drawProducts(i, p));
  items = data.products;
});

function drawProducts(index, product) {
  let buttonsImg = "";
  let images = "";
  const target = `ci-${index}`;
  const vendida =
    '<span class="position-absolute top-0 start-50 translate-middle badge rounded-pill bg-success">Vendida</span>';
  product.id = index;

  product.photos.forEach((p, i) => {
    buttonsImg += `<button type="button" data-bs-target="#${target}" data-bs-slide-to="${i}" class="active" aria-current="true" aria-label="Foto ${i + 1
      }"></button>`;
    images += `<div class="carousel-item ${i === 0 ? "active" : ""
      }"><img src="${p.path}" class="d-block ${p.style}" alt="${product.name
      }"></div>`;
  });

  const cardProduct = `
  <div class="col">
    <div class="card h-100 ${product.isSelled ? "border-success" : ""}">
        <h5 class="card-header">
          <div id="${target}" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-indicators">
              ${buttonsImg}
            </div>
            <div class="carousel-inner">
              ${images}
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#${target}" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#${target}" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
          ${product.isSelled ? vendida : ""}
        </h5>
        <div class="card-body">
          <h5 class="card-title">
            ${product.name}
          </h5>
          <div class="card-text">
            <span class="float-start">
              ${product.description} <br />
              <span ${product.isSelled ? "text-decoration-line-through" : ""}"><span class="fw-bold">Precio:</span> ${product.price}</span>
            </span>
            ${product.isSelled
      ? ""
      : `<button onclick="addItem(${product.id})" class="btn btn-success float-end"><i class="fa-solid fa-cart-plus"></i></button>`
    }
          </div>
        </div>
    </div>
  </div>`;

  $("#root").append(cardProduct);
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
    $("#spItems").removeClass("invisible");
    $("#spItems").text(myItems.length);
  } else {
    $("#spItems").addClass("invisible");
    setEmptyMessage();
  }
}

function displayMyItems() {
  setVisibleFooter();
  $("#divItemsInCart").empty();
  let items = "";
  myItems.forEach((p, i) => {
    items += `<li id="item-${p.id}" class="list-group-item list-group-item-action d-flex justify-content-between align-items-start">
      <div class="w-25">
        <img class="img-fluid" src="${p.photos[0].path}" alt="${p.name}">
      </div>
      <div class="ms-2 me-auto">
        <div class="fw-bold">${p.name}</div> ${p.price}
      </div>
      <button class="btn btn-sm btn-danger">
        <i class="fa-solid fa-trash" onclick="removeItem(${p.id})"></i>
      </button>
    </li>`;
  });

  if (items) {
    $("#divItemsInCart").append(`<ul class="list-group">${items}</ul>`);
  }
  else {
    setEmptyMessage();
  }
}

function setEmptyMessage() {
  $("#divItemsInCart").empty();
  $("#divItemsInCart").text("No hay artículos en el carrito");
}

function setVisibleFooter() {
  if (myItems) {
    myItems.length > 0 ? $("#modalFooter").removeClass("invisible") : $("#modalFooter").addClass("invisible");
  }
  else {
    $("#modalFooter").removeClass("invisible");
  }
}

function downloadItems() {
  let items = '';

  myItems.forEach((p, i) => {
    items += `${i + 1}) ${p.name} (${p.price}) \n`;
  });

  if (items) {
    let element = document.createElement('a');
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(items));
    element.setAttribute("download", `my-products-${(new Date()).toISOString().replace(":", "").replace(".", "") }.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toastr.success(`Se ha creado un archivo con los artículos agregados al carrito, ahora puedes enviarme un mensaje con los artículos deseados!`);
  }
}
