$.getJSON("info/items.json", data => {
  data.products.forEach((p, i) => drawProducts(i, p));
});

function drawProducts(index, product) {
  let buttonsImg = "";
  let images = "";
  const target = `ci-${index}`;
  const vendida = '<span class="position-absolute top-0 start-50 translate-middle badge rounded-pill bg-success">Vendida</span>';
  
  product.photos.forEach((p, i) => {
    buttonsImg += `<button type="button" data-bs-target="#${target}" data-bs-slide-to="${i}" class="active" aria-current="true" aria-label="Foto ${i+1}"></button>`;
    images += `<div class="carousel-item ${i === 0 ? 'active' : ''}"><img src="${p.path}" class="d-block ${p.style}" alt="${product.name}"></div>`;
  });

  const cardProduct = `
  <div class="col">
    <div class="card h-100 ${product.isSelled ? 'border-success' : ''}">
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
          ${product.isSelled ? vendida : ''}
        </h5>
        <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">${product.description}</p>
          <p class="card-text ${product.isSelled ? 'text-decoration-line-through' : ''}"><span class="fw-bold">Precio:</span> ${product.price}</p>
        </div>
    </div>
  </div>`;

  $("#root").append(cardProduct);
}
