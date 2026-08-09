const products = [
    { id: 1, name: "Rice", sizes: ["1kg", "5kg", "10kg"], price: { "1kg": 560, "5kg": 2520, "10kg": 4760 } },
    { id: 2, name: "Sugar", sizes: ["1kg", "5kg"], price: { "1kg": 280, "5kg": 1120 } },
    { id: 3, name: "Flour", sizes: ["1kg", "5kg"], price: { "1kg": 420, "5kg": 1680 } },
    { id: 4, name: "Salt", sizes: ["500g", "1kg"], price: { "500g": 140, "1kg": 280 } },
    { id: 5, name: "Cooking Oil", sizes: ["1L", "5L"], price: { "1L": 840, "5L": 3360 } },
    { id: 6, name: "Pasta", sizes: ["500g", "1kg"], price: { "500g": 340, "1kg": 700 } },
    { id: 7, name: "Canned Beans", sizes: ["400g"], price: { "400g": 420 } },
    { id: 8, name: "Tomato Sauce", sizes: ["500g"], price: { "500g": 560 } },
    { id: 9, name: "Milk", sizes: ["1L"], price: { "1L": 420 } },
    { id: 10, name: "Cheese", sizes: ["200g"], price: { "200g": 840 } },
    { id: 11, name: "Butter", sizes: ["250g"], price: { "250g": 700 } },
    { id: 12, name: "Yogurt", sizes: ["500g"], price: { "500g": 504 } },
    { id: 13, name: "Eggs", sizes: ["dozen"], price: { "dozen": 840 } },
    { id: 14, name: "Chicken", sizes: ["1kg"], price: { "1kg": 1400 } },
    { id: 15, name: "Beef", sizes: ["1kg"], price: { "1kg": 1960 } },
    { id: 16, name: "Fish", sizes: ["1kg"], price: { "1kg": 1680 } },
    { id: 17, name: "Vegetables", sizes: ["500g", "1kg"], price: { "500g": 280, "1kg": 504 } },
    { id: 18, name: "Fruits", sizes: ["500g", "1kg"], price: { "500g": 420, "1kg": 700 } },
    { id: 19, name: "Bread", sizes: ["loaf"], price: { "loaf": 280 } },
    { id: 20, name: "Snacks", sizes: ["200g"], price: { "200g": 420 } },
];

const orderStorageKey = "hafizMartOrder";
let selectedItems = [];
let filteredProducts = [...products];

function formatCurrency(value) {
    return `PKR ${value.toLocaleString("en-PK")}`;
}

function loadComponent(path) {
    return fetch(path).then(response => {
        if (!response.ok) {
            throw new Error(`Unable to load component: ${path}`);
        }

        return response.text();
    });
}

async function loadPageComponents() {
    const headerTarget =
        document.getElementById("header") ||
        document.getElementById("header-placeholder");

    const footerTarget =
        document.getElementById("footer") ||
        document.getElementById("footer-placeholder");

    if (headerTarget) {
        const headerHtml = await loadComponent("header.html").catch(() => "");
        headerTarget.innerHTML = headerHtml;
    }

    if (footerTarget) {
        const footerHtml = await loadComponent("footer.html").catch(() => "");
        footerTarget.innerHTML = footerHtml;
    }
}

function renderProductCards(items = filteredProducts) {
    const productList = document.getElementById("product-list");

    if (!productList) return;

    if (items.length === 0) {
        productList.innerHTML =
            '<p class="no-results">No products matched your search.</p>';
        return;
    }

    productList.innerHTML = items.map(product => {
        const sizeOptions = product.sizes
            .map(
                size =>
                    `<option value="${size}">${size} - ${formatCurrency(
                        product.price[size]
                    )}</option>`
            )
            .join("");

        return `
            <article class="product-card" data-product-id="${product.id}">
                <h3>${product.name}</h3>

                <p class="product-price">
                    Starting at ${formatCurrency(
                        product.price[product.sizes[0]]
                    )}
                </p>

                <div class="product-controls">
                    <label>
                        Size
                        <select class="size-select">
                            ${sizeOptions}
                        </select>
                    </label>

                    <label>
                        Quantity
                        <input
                            type="number"
                            class="quantity-input"
                            min="1"
                            value="1"
                        >
                    </label>
                </div>

                <button
                    class="button add-to-cart"
                    data-product-id="${product.id}"
                >
                    Add to Cart
                </button>
            </article>
        `;
    }).join("");
}

function findProduct(productId) {
    return products.find(product => product.id === productId);
}

function updateCartSummary() {
    const cartItemsEl = document.getElementById("cart-items");
    const cartTotalEl = document.getElementById("cart-total");
    const orderButton = document.getElementById("order-button");

    if (!cartItemsEl || !cartTotalEl || !orderButton) return;

    if (selectedItems.length === 0) {
        cartItemsEl.innerHTML = "<li>No items added yet.</li>";
        cartTotalEl.textContent = "PKR 0";
        orderButton.disabled = true;
        return;
    }

    const total = selectedItems.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0
    );

    cartItemsEl.innerHTML = selectedItems
        .map(
            item =>
                `<li>${item.name} - ${item.size} x ${
                    item.quantity
                } = ${formatCurrency(
                    item.unitPrice * item.quantity
                )}</li>`
        )
        .join("");

    cartTotalEl.textContent = formatCurrency(total);
    orderButton.disabled = false;
}

function addProductToCart(productId) {
    const card = document.querySelector(
        `.product-card[data-product-id="${productId}"]`
    );

    if (!card) return;

    const product = findProduct(productId);

    if (!product) return;

    const size = card.querySelector(".size-select").value;

    const quantity =
        parseInt(card.querySelector(".quantity-input").value, 10) || 1;

    const unitPrice = product.price[size];

    const existingItem = selectedItems.find(
        item => item.id === productId && item.size === size
    );

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        selectedItems.push({
            id: productId,
            name: product.name,
            size,
            quantity,
            unitPrice
        });
    }

    updateCartSummary();
}

function handleIndexPageClick(event) {
    const button = event.target.closest(".add-to-cart");

    if (!button) return;

    const productId = Number(button.dataset.productId);

    addProductToCart(productId);

    const messageEl = document.getElementById("form-message");

    if (messageEl) {
        messageEl.textContent = "";
    }
}

function submitOrder() {
    const addressInput = document.getElementById("delivery-address");
    const contactInput = document.getElementById("contact-number");
    const messageEl = document.getElementById("form-message");

    if (!addressInput || !contactInput || !messageEl) return;

    const address = addressInput.value.trim();
    const contact = contactInput.value.trim();

    if (selectedItems.length === 0) {
        messageEl.textContent =
            "Please add at least one product to your cart.";
        return;
    }

    if (!address || !contact) {
        messageEl.textContent =
            "Delivery address and contact number are required.";
        return;
    }

    const order = {
        items: selectedItems,
        total: selectedItems.reduce(
            (sum, item) => sum + item.unitPrice * item.quantity,
            0
        ),
        address,
        contact,
        createdAt: new Date().toISOString()
    };

    localStorage.setItem(orderStorageKey, JSON.stringify(order));

    window.location.href = "receipt.html";
}

function filterProducts(query) {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
        filteredProducts = [...products];
        renderProductCards();
        return;
    }

    filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(normalized)
    );

    renderProductCards();
}

function initIndexPage() {
    renderProductCards();

    const productList = document.getElementById("product-list");
    const orderButton = document.getElementById("order-button");

    // Supports both possible search input IDs
    const searchInput =
        document.getElementById("search-input") ||
        document.getElementById("searchInput");

    if (!productList || !orderButton || !searchInput) return;

    productList.addEventListener("click", handleIndexPageClick);

    orderButton.addEventListener("click", submitOrder);

    searchInput.addEventListener("input", event => {
        filterProducts(event.target.value);
    });

    updateCartSummary();
}

function buildReceiptHtml(order) {
    return `
        <div class="receipt-card">
            <h2>Order Summary</h2>

            <ul>
                ${order.items
                    .map(
                        item =>
                            `<li>${item.name} - ${item.size} x ${
                                item.quantity
                            } = ${formatCurrency(
                                item.unitPrice * item.quantity
                            )}</li>`
                    )
                    .join("")}
            </ul>

            <p>
                <strong>Total Amount:</strong>
                ${formatCurrency(order.total)}
            </p>

            <p>
                <strong>Delivery Address:</strong>
                ${order.address}
            </p>

            <p>
                <strong>Contact Number:</strong>
                ${order.contact}
            </p>
        </div>
    `;
}

function initReceiptPage() {
    const receiptDetails = document.getElementById("receipt-details");
    const whatsappButton = document.getElementById("whatsapp-button");

    if (!receiptDetails || !whatsappButton) return;

    const storedOrder = localStorage.getItem(orderStorageKey);

    const order = storedOrder
        ? JSON.parse(storedOrder)
        : null;

    if (
        !order ||
        !Array.isArray(order.items) ||
        order.items.length === 0
    ) {
        receiptDetails.innerHTML =
            '<p class="empty-receipt">No order found. Please place an order first.</p>';

        whatsappButton.disabled = true;

        return;
    }

    receiptDetails.innerHTML = buildReceiptHtml(order);

    whatsappButton.disabled = false;

    whatsappButton.addEventListener("click", () => {
        if (
            typeof window.sendWhatsAppMessage === "function"
        ) {
            window.sendWhatsAppMessage(
                order.items,
                order.total,
                order.address,
                order.contact
            );

            return;
        }

        const fallbackMessage = `Order Details:
${order.items
    .map(
        item =>
            `${item.name} - ${item.size} x ${
                item.quantity
            } = ${formatCurrency(
                item.unitPrice * item.quantity
            )}`
    )
    .join("\n")}

Total Amount: ${formatCurrency(order.total)}
Delivery Address: ${order.address}
Contact Number: ${order.contact}`;

        const whatsappUrl =
            `https://api.whatsapp.com/send?text=${encodeURIComponent(
                fallbackMessage
            )}`;

        window.open(whatsappUrl, "_blank");
    });
}

function init() {
    loadPageComponents()
        .then(() => {
            if (document.getElementById("product-list")) {
                initIndexPage();
            }

            if (document.getElementById("receipt-details")) {
                initReceiptPage();
            }
        })
        .catch(error => {
            console.error(
                "Page initialization failed:",
                error
            );
        });
}

document.addEventListener("DOMContentLoaded", init);
