const products = [
  {
    name: "Bicicleta Todo Terreno",
    description:
      "Bicicleta marco STL en aluminio, cambios shimano, frenos de disco, cableado interno",
    price: "$ 1.000.000",
    photos: [
      {
        path: "img/bici/bici-01.jpg",
        style: "w-100",
      },
      {
        path: "img/bici/bici-02.jpg",
        style: "w-100",
      },
      {
        path: "img/bici/bici-03.jpg",
        style: "w-100",
      },
      {
        path: "img/bici/bici-04.jpg",
        style: "w-100",
      },
      {
        path: "img/bici/bici-05.jpg",
        style: "w-25",
      },
    ],
  },
];

products.forEach((product) => drawProducts(product));

function drawProducts(product) {
  let buttonsImg = "";
  let images = "";
  
  product.photos.forEach((p, i) => {
    buttonsImg += `<button type="button" data-bs-target="#ci" data-bs-slide-to="${i}" class="active" aria-current="true" aria-label="Foto ${i+1}"></button>`;
    images += `<div class="carousel-item ${i === 0 ? 'active' : ''}"><img src="${p.path}" class="d-block ${p.style}" alt="${product.name}"></div>`;
  });

  const cardProduct = `
    <div class="card mb-3">
        <h5 class="card-header">
            <div id="ci" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-indicators">
                    ${buttonsImg}
                </div>
                <div class="carousel-inner">
                    ${images}
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#ci"
                    data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#ci"
                    data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
        </h5>
        <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">${product.description}</p>
            <p class="card-text"><span class="fw-bold">Precio:</span> ${product.price}</p>
        </div>
    </div>`;

  $("#root").append(cardProduct);
}
