$(document).ready(function () {
  const apiBaseUrl = "https://usman-fake-api.herokuapp.com/api/products";
  const productList = $("#productList");
  const newNameInput = $("#newName");
  const newPriceInput = $("#newPrice");
  const newColorInput = $("#newColor");
  const newTypeInput = $("#newType"); // Corrected ID
  const newDescriptionInput = $("#newDescription");
  const addProductButton = $("#addProduct");

  function resetForm() {
    newNameInput.val("");
    newPriceInput.val("");
    newColorInput.val("");
    newTypeInput.val(""); // Corrected ID
    newDescriptionInput.val("");
    addProductButton.text("Add Product");
  }

  function renderProduct(product) {
    const productItem = $("<li>");
    productItem.html(`
      <strong>Name:</strong> ${product.name}<br>
      <strong>Price:</strong> $${product.price}<br>
      <strong>Color:</strong> ${product.color}<br>
      <strong>Type:</strong> ${product.type}<br>
      <button class="edit" data-id="${product._id}">Edit</button>
      <button class="delete" data-id="${product._id}">Delete</button>
    `);
    productList.append(productItem);
  }

  function fetchProducts() {
    fetch(apiBaseUrl)
      .then((response) => response.json())
      .then((data) => {
        productList.empty();
        data.forEach(renderProduct);
      })
      .catch((error) => console.error("Error fetching products: ", error));
  }

  productList.on("click", ".edit", function () {
    const productId = $(this).data("id");
    fetch(`${apiBaseUrl}/${productId}`)
      .then((response) => response.json())
      .then((product) => {
        newNameInput.val(product.name);
        newPriceInput.val(product.price);
        newColorInput.val(product.color);
        newTypeInput.val(product.type); // Corrected ID
        newDescriptionInput.val(product.description);
        addProductButton
          .text("Update Product")
          .off("click")
          .on("click", function () {
            fetch(`${apiBaseUrl}/${productId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: newNameInput.val(),
                price: newPriceInput.val(),
                color: newColorInput.val(),
                type: newTypeInput.val(), // Corrected ID
                description: newDescriptionInput.val(),
              }),
            })
              .then(() => {
                fetchProducts();
                resetForm();
              })
              .catch((error) =>
                console.error("Error updating product: ", error)
              );
          });
      })
      .catch((error) =>
        console.error("Error fetching product for edit: ", error)
      );
  });

  addProductButton.on("click", function () {
    const newName = newNameInput.val();
    const newPrice = newPriceInput.val();
    const newColor = newColorInput.val();
    const newType = newTypeInput.val(); // Corrected ID
    const newDescription = newDescriptionInput.val();

    fetch(apiBaseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName,
        price: newPrice,
        color: newColor,
        type: newType, // Corrected ID
        description: newDescription,
      }),
    })
      .then(() => {
        fetchProducts();
        resetForm();
      })
      .catch((error) => console.error("Error adding a new product: ", error));
  });

  productList.on("click", ".delete", function () {
    const productId = $(this).data("id");
    fetch(`${apiBaseUrl}/${productId}`, {
      method: "DELETE",
    })
      .then(() => fetchProducts())
      .catch((error) => console.error("Error deleting the product: ", error));
  });

  fetchProducts();
});
