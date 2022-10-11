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
    buttonsImg += `<button type="button" data-bs-target="#${target}" data-bs-slide-to="${i}" class="active" aria-current="true" aria-label="Foto ${
      i + 1
    }"></button>`;
    images += `<div class="carousel-item ${
      i === 0 ? "active" : ""
    }"><img src="${p.path}" class="d-block ${p.style}" alt="${
      product.name
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
            ${
              product.isSelled
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
  setNumberItems();
}

function setNumberItems() {
  if (myItems.length > 0) {
    $("#spItems").removeClass("invisible");
    $("#spItems").text(myItems.length);
  } else {
    $("#spItems").addClass("invisible");
  }
}

function displayMyItems() {
  let items = myItems.length > 0 ? "A continuación se listan sus productos:" : "";
  myItems.forEach((p, i) => {
    items += `<p><strong>${i + 1})</strong> ${p.name} (${p.price})</p>`;
  });

  if (items) {
    toastr.success(items);
  }
}
