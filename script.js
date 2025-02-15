const productsContainer = document.getElementById("products");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutTotal = document.getElementById("checkout-total");
const clearCartButton = document.getElementById("clear-cart");
const checkoutButton = document.getElementById("checkout");
let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

async function fetchProducts() {
    const res = await fetch("https://fakestoreapi.com/products");
    const products = await res.json();
    displayProducts(products);
}

function displayProducts(products) {
    productsContainer.innerHTML = "";
    products.forEach(product => {
        const productElement = document.createElement("div");
        productElement.classList.add("col");

        productElement.innerHTML = `
            <div class="product-card p-3">
                <h6>${product.title}</h6>
                <img src="${product.image}" class="img-fluid" alt="${product.title}">
                <div class="btn-group mt-2">
                    <button class="btn btn-info btn-sm" onclick="showDetails('${product.title}', '${product.description}')">
                        Description
                    </button>
                </div>
                <p class="fw-bold mt-2">$${product.price}</p>
                <button class="btn btn-primary btn-sm w-100" onclick="addToCart(${product.id}, '${product.title}', ${product.price})">
                    Add to Cart
                </button>
            </div>
        `;
        productsContainer.appendChild(productElement);
    });
}

function showDetails(title, description) {
    document.getElementById("modalProductTitle").innerText = title;
    document.getElementById("modalProductDescription").innerText = description;
    const productModal = new bootstrap.Modal(document.getElementById("productModal"));
    productModal.show();
}

function addToCart(id, title, price) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, title, price, quantity: 1 });
    }
    updateCart();
}

function updateCart() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;

        const truncatedTitle = item.title.length > 12 ? item.title.substring(0, 12) + "..." : item.title;

        const cartItem = document.createElement("li");
        cartItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
        cartItem.innerHTML = `
            <span>${truncatedTitle} - $${item.price} x ${item.quantity}</span>
            <div>
                <button class="btn btn-sm btn-secondary" onclick="changeQuantity(${index}, -1)">-</button>
                <span class="mx-2">${item.quantity}</span>
                <button class="btn btn-sm btn-secondary" onclick="changeQuantity(${index}, 1)">+</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    cartTotal.innerText = total.toFixed(2);
    checkoutTotal.innerText = total.toFixed(2);
    sessionStorage.setItem("cart", JSON.stringify(cart));
}


function changeQuantity(index, change) {
    if (cart[index].quantity + change > 0) {
        cart[index].quantity += change;
    } else {
        cart.splice(index, 1);
    }
    updateCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function showCheckout() {
    const checkoutItemsContainer = document.getElementById("checkout-items");
    checkoutItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;

        const checkoutItem = document.createElement("li");
        checkoutItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
        checkoutItem.innerHTML = `
            <span>${item.title} - $${item.price} x ${item.quantity}</span>
        `;
        checkoutItemsContainer.appendChild(checkoutItem);
    });

    document.getElementById("checkout-total").innerText = total.toFixed(2);
}

checkoutButton.addEventListener("click", showCheckout);

clearCartButton.addEventListener("click", () => {
    cart = [];
    updateCart();
});

fetchProducts();
updateCart();
