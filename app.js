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
    { id: 20, name: "Snacks", sizes: ["200g"], price: { "200g": 420 } }
];

/* =========================================================
   STORAGE
========================================================= */

const cartStorageKey = "hafizMartCart";
const orderStorageKey = "hafizMartCurrentOrder";

let selectedItems = [];
let filteredProducts = [...products];
let toastTimer = null;

/* =========================================================
   HELPERS
========================================================= */

function formatCurrency(value) {
    const number = Number(value) || 0;
    return `PKR ${number.toLocaleString("en-PK")}`;
}

function calculateCartTotal() {
    return selectedItems.reduce(
        (sum, item) =>
            sum + Number(item.unitPrice) * Number(item.quantity),
        0
    );
}

function calculateCartQuantity() {
    return selectedItems.reduce(
        (sum, item) => sum + Number(item.quantity),
        0
    );
}

/* =========================================================
   HEADER / FOOTER
========================================================= */

function loadComponent(path) {
    return fetch(path).then(response => {
        if (!response.ok) {
            throw new Error(`Unable to load ${path}`);
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

    /* YOUR FILES ARE IN ROOT */
    if (headerTarget) {
        const html = await loadComponent("header.html").catch(error => {
            console.error("Header loading failed:", error);
            return "";
        });

        headerTarget.innerHTML = html;
    }

    if (footerTarget) {
        const html = await loadComponent("footer.html").catch(error => {
            console.error("Footer loading failed:", error);
            return "";
        });

        footerTarget.innerHTML = html;
    }
}

/* =========================================================
   CART STORAGE
========================================================= */

function saveCart() {
    localStorage.setItem(
        cartStorageKey,
        JSON.stringify(selectedItems)
    );
}

function loadCart() {
    try {
        const saved = localStorage.getItem(cartStorageKey);

        if (!saved) {
            selectedItems = [];
            return;
        }

        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
            selectedItems = parsed;
        } else {
            selectedItems = [];
        }
    } catch (error) {
        console.error("Cart loading failed:", error);
        selectedItems = [];
    }
}

/* =========================================================
   PRODUCT CARDS
========================================================= */

function renderProductCards(items = filteredProducts) {
    const productList = document.getElementById("product-list");

    if (!productList) return;

    if (items.length === 0) {
        productList.innerHTML = `
            <div class="no-results">
                <h3>No Products Found</h3>
                <p>Try another search.</p>
            </div>
        `;
        return;
    }

    productList.innerHTML = items.map(product => {
        const sizeOptions = product.sizes
            .map(size => `
                <option value="${size}">
                    ${size} - ${formatCurrency(product.price[size])}
                </option>
            `)
            .join("");

        return `
            <article
                class="product-card"
                data-product-id="${product.id}"
            >
                <div class="product-icon">🛒</div>

                <h3>${product.name}</h3>

                <p class="product-price">
                    Starting at
                    ${formatCurrency(product.price[product.sizes[0]])}
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
                    type="button"
                >
                    🛒 Add to Cart
                </button>
            </article>
        `;
    }).join("");
}

function findProduct(productId) {
    return products.find(product => product.id === productId);
}

/* =========================================================
   MAIN CART
========================================================= */

function updateCartSummary() {
    const cartItemsEl = document.getElementById("cart-items");
    const cartTotalEl = document.getElementById("cart-total");
    const orderButton = document.getElementById("order-button");

    if (!cartItemsEl || !cartTotalEl || !orderButton) return;

    if (selectedItems.length === 0) {
        cartItemsEl.innerHTML = `
            <li class="empty-cart">
                🛒 Your cart is empty.
            </li>
        `;

        cartTotalEl.textContent = "PKR 0";
        orderButton.disabled = true;

        updateFloatingCart();
        updateDrawerCart();
        return;
    }

    cartItemsEl.innerHTML = selectedItems.map((item, index) => `
        <li class="cart-item">

            <div>
                <strong>${item.name}</strong>
                <small>
                    ${item.size} × ${item.quantity}
                </small>
            </div>

            <div class="cart-item-right">

                <strong>
                    ${formatCurrency(
                        item.unitPrice * item.quantity
                    )}
                </strong>

                <button
                    class="remove-item"
                    data-index="${index}"
                    type="button"
                    title="Remove item"
                >
                    ✕
                </button>

            </div>

        </li>
    `).join("");

    cartTotalEl.textContent =
        formatCurrency(calculateCartTotal());

    orderButton.disabled = false;

    updateFloatingCart();
    updateDrawerCart();
}

function addProductToCart(productId) {
    const card = document.querySelector(
        `.product-card[data-product-id="${productId}"]`
    );

    if (!card) return;

    const product = findProduct(productId);

    if (!product) return;

    const sizeSelect = card.querySelector(".size-select");
    const quantityInput = card.querySelector(".quantity-input");

    if (!sizeSelect || !quantityInput) return;

    const size = sizeSelect.value;

    const quantity = Math.max(
        1,
        parseInt(quantityInput.value, 10) || 1
    );

    const unitPrice = product.price[size];

    const existingItem = selectedItems.find(
        item =>
            item.id === productId &&
            item.size === size
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

    saveCart();
    updateCartSummary();
    updateDrawerCart();

    quantityInput.value = 1;

    showToast(`✓ ${product.name} added to cart`);
}

function removeCartItem(index) {
    if (
        !Number.isInteger(index) ||
        index < 0 ||
        index >= selectedItems.length
    ) {
        return;
    }

    const removed = selectedItems[index];

    selectedItems.splice(index, 1);

    saveCart();
    updateCartSummary();
    updateDrawerCart();

    showToast(`${removed.name} removed`);
}

function changeCartQuantity(index, change) {
    const item = selectedItems[index];

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeCartItem(index);
        return;
    }

    saveCart();
    updateCartSummary();
    updateDrawerCart();
}

function clearCart() {
    if (selectedItems.length === 0) {
        showToast("Your cart is already empty");
        return;
    }

    selectedItems = [];

    saveCart();
    updateCartSummary();
    updateDrawerCart();

    showToast("Cart cleared");
}

/* =========================================================
   FLOATING CART
========================================================= */

function updateFloatingCart() {
    const cartCount = document.getElementById("cart-count");

    if (!cartCount) return;

    cartCount.textContent = calculateCartQuantity();
}

function openCart() {
    const drawer = document.getElementById("cart-drawer");
    const overlay = document.getElementById("cart-overlay");

    if (!drawer || !overlay) return;

    updateDrawerCart();

    drawer.classList.add("active");
    overlay.classList.add("active");

    drawer.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";
}

function closeCart() {
    const drawer = document.getElementById("cart-drawer");
    const overlay = document.getElementById("cart-overlay");

    if (!drawer || !overlay) return;

    drawer.classList.remove("active");
    overlay.classList.remove("active");

    drawer.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";
}

function updateDrawerCart() {
    const drawerItems = document.getElementById("drawer-cart-items");
    const drawerTotal = document.getElementById("drawer-cart-total");
    const drawerCount = document.getElementById("drawer-cart-count");

    if (!drawerItems || !drawerTotal || !drawerCount) return;

    const quantity = calculateCartQuantity();

    drawerCount.textContent =
        `${quantity} ${quantity === 1 ? "item" : "items"}`;

    drawerTotal.textContent =
        formatCurrency(calculateCartTotal());

    if (selectedItems.length === 0) {
        drawerItems.innerHTML = `
            <div class="drawer-empty">
                <div style="font-size:3rem;">🛒</div>
                <h3>Your cart is empty</h3>
                <p>Add some groceries to get started.</p>
            </div>
        `;

        updateFloatingCart();
        return;
    }

    drawerItems.innerHTML = selectedItems.map((item, index) => `
        <div class="drawer-item">

            <div>

                <div class="drawer-item-name">
                    ${item.name}
                </div>

                <div class="drawer-item-size">
                    Size: ${item.size}
                </div>

                <div class="drawer-item-price">
                    ${formatCurrency(item.unitPrice)} each
                </div>

                <div class="drawer-item-controls">

                    <button
                        class="quantity-button"
                        type="button"
                        data-action="decrease"
                        data-index="${index}"
                    >
                        −
                    </button>

                    <strong>
                        ${item.quantity}
                    </strong>

                    <button
                        class="quantity-button"
                        type="button"
                        data-action="increase"
                        data-index="${index}"
                    >
                        +
                    </button>

                    <button
                        class="remove-item"
                        type="button"
                        data-action="remove"
                        data-index="${index}"
                    >
                        Remove
                    </button>

                </div>

            </div>

            <div class="drawer-item-total">
                ${formatCurrency(
                    item.unitPrice * item.quantity
                )}
            </div>

        </div>
    `).join("");

    updateFloatingCart();
}

function handleDrawerClick(event) {
    const button = event.target.closest("[data-action]");

    if (!button) return;

    const index = Number(button.dataset.index);
    const action = button.dataset.action;

    if (action === "increase") {
        changeCartQuantity(index, 1);
    }

    if (action === "decrease") {
        changeCartQuantity(index, -1);
    }

    if (action === "remove") {
        removeCartItem(index);
    }
}

/* =========================================================
   SEARCH
========================================================= */

function filterProducts(query) {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
        filteredProducts = [...products];
        renderProductCards();
        updateSearchInfo("");
        return;
    }

    filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(normalized)
    );

    renderProductCards(filteredProducts);
    updateSearchInfo(normalized);
}

function updateSearchInfo(query) {
    const resultInfo =
        document.getElementById("search-result-info");

    if (!resultInfo) return;

    if (!query) {
        resultInfo.textContent = "";
        return;
    }

    resultInfo.textContent =
        `${filteredProducts.length} ${
            filteredProducts.length === 1
                ? "product"
                : "products"
        } found`;
}

/* =========================================================
   TOAST
========================================================= */

function showToast(message) {
    const toast = document.getElementById("toast");

    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2200);
}

/* =========================================================
   CHECKOUT
========================================================= */

function scrollToCheckout() {
    const checkout =
        document.getElementById("checkout-section");

    if (!checkout) return;

    checkout.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

/* =========================================================
   SUBMIT ORDER
========================================================= */

function submitOrder() {
    const addressInput =
        document.getElementById("delivery-address");

    const contactInput =
        document.getElementById("contact-number");

    const messageEl =
        document.getElementById("form-message");

    if (!addressInput || !contactInput || !messageEl) {
        return;
    }

    const address = addressInput.value.trim();
    const contact = contactInput.value.trim();

    messageEl.textContent = "";

    if (selectedItems.length === 0) {
        messageEl.textContent =
            "Please add at least one product to your cart.";

        openCart();
        return;
    }

    if (!address) {
        messageEl.textContent =
            "Please enter your delivery address.";

        addressInput.focus();
        return;
    }

    if (!contact) {
        messageEl.textContent =
            "Please enter your contact number.";

        contactInput.focus();
        return;
    }

    const cleanedContact =
        contact.replace(/[\s()-]/g, "");

    if (
        cleanedContact.length < 10 ||
        cleanedContact.length > 15
    ) {
        messageEl.textContent =
            "Please enter a valid contact number.";

        contactInput.focus();
        return;
    }

    const order = {
        orderNumber:
            "HM-" +
            Date.now().toString().slice(-8),

        items: selectedItems.map(item => ({
            ...item
        })),

        total: calculateCartTotal(),

        address,

        contact,

        createdAt:
            new Date().toISOString()
    };

    /* Current order only */
    sessionStorage.setItem(
        orderStorageKey,
        JSON.stringify(order)
    );

    /* Go to receipt */
    window.location.href = "receipt.html";
}

/* =========================================================
   INDEX PAGE
========================================================= */

function initIndexPage() {
    loadCart();

    renderProductCards();

    updateCartSummary();
    updateDrawerCart();
    updateFloatingCart();

    const productList =
        document.getElementById("product-list");

    const orderButton =
        document.getElementById("order-button");

    const searchInput =
        document.getElementById("search-input");

    const clearSearch =
        document.getElementById("clear-search");

    const floatingCart =
        document.getElementById("floating-cart");

    const closeCartButton =
        document.getElementById("close-cart");

    const overlay =
        document.getElementById("cart-overlay");

    const drawerItems =
        document.getElementById("drawer-cart-items");

    const clearCartButton =
        document.getElementById("clear-cart");

    const drawerCheckout =
        document.getElementById("drawer-checkout");

    const shopNowButton =
        document.getElementById("shop-now-button");

    /* Product clicks */
    if (productList) {
        productList.addEventListener(
            "click",
            event => {
                const addButton =
                    event.target.closest(".add-to-cart");

                if (!addButton) return;

                const productId =
                    Number(addButton.dataset.productId);

                addProductToCart(productId);

                const messageEl =
                    document.getElementById("form-message");

                if (messageEl) {
                    messageEl.textContent = "";
                }
            }
        );
    }

    /* Cart remove buttons in checkout */
    const checkoutCart =
        document.getElementById("cart-items");

    if (checkoutCart) {
        checkoutCart.addEventListener(
            "click",
            event => {
                const button =
                    event.target.closest(".remove-item");

                if (!button) return;

                removeCartItem(
                    Number(button.dataset.index)
                );
            }
        );
    }

    /* Order */
    if (orderButton) {
        orderButton.addEventListener(
            "click",
            submitOrder
        );
    }

    /* Search */
    if (searchInput) {
        searchInput.addEventListener(
            "input",
            event => {
                const value = event.target.value;

                filterProducts(value);

                if (clearSearch) {
                    clearSearch.style.display =
                        value ? "block" : "none";
                }
            }
        );
    }

    /* Clear search */
    if (clearSearch) {
        clearSearch.addEventListener(
            "click",
            () => {
                if (!searchInput) return;

                searchInput.value = "";

                filterProducts("");

                clearSearch.style.display = "none";

                searchInput.focus();
            }
        );
    }

    /* Floating cart */
    if (floatingCart) {
        floatingCart.addEventListener(
            "click",
            openCart
        );
    }

    /* Close cart */
    if (closeCartButton) {
        closeCartButton.addEventListener(
            "click",
            closeCart
        );
    }

    /* Overlay */
    if (overlay) {
        overlay.addEventListener(
            "click",
            closeCart
        );
    }

    /* Drawer actions */
    if (drawerItems) {
        drawerItems.addEventListener(
            "click",
            handleDrawerClick
        );
    }

    /* Clear cart */
    if (clearCartButton) {
        clearCartButton.addEventListener(
            "click",
            clearCart
        );
    }

    /* Checkout from drawer */
    if (drawerCheckout) {
        drawerCheckout.addEventListener(
            "click",
            () => {
                closeCart();
                scrollToCheckout();
            }
        );
    }

    /* Shop now */
    if (shopNowButton) {
        shopNowButton.addEventListener(
            "click",
            () => {
                const productList =
                    document.getElementById("product-list");

                if (productList) {
                    productList.scrollIntoView({
                        behavior: "smooth"
                    });
                }
            }
        );
    }

    /* Escape closes drawer */
    document.addEventListener(
        "keydown",
        event => {
            if (event.key === "Escape") {
                closeCart();
            }
        }
    );

    initBackToTop();
}

/* =========================================================
   BACK TO TOP
========================================================= */

function initBackToTop() {
    const button =
        document.getElementById("back-to-top");

    if (!button) return;

    window.addEventListener(
        "scroll",
        () => {
            if (window.scrollY > 450) {
                button.classList.add("show");
            } else {
                button.classList.remove("show");
            }
        }
    );

    button.addEventListener(
        "click",
        () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    );
}

/* =========================================================
   RECEIPT
========================================================= */

function buildReceiptHtml(order) {
    const date = new Date(order.createdAt);

    const formattedDate =
        date.toLocaleString("en-PK", {
            dateStyle: "medium",
            timeStyle: "short"
        });

    const itemsHtml = order.items.map(item => `
        <div class="receipt-item">

            <div class="receipt-item-info">

                <strong>${item.name}</strong>

                <span>
                    ${item.size} × ${item.quantity}
                </span>

            </div>

            <strong>
                ${formatCurrency(
                    item.unitPrice * item.quantity
                )}
            </strong>

        </div>
    `).join("");

    return `
        <div class="receipt-top">

            <div>
                <span class="receipt-label">
                    ORDER NUMBER
                </span>

                <strong class="order-number">
                    ${order.orderNumber}
                </strong>
            </div>

            <div class="receipt-date">
                <span class="receipt-label">
                    ORDER DATE
                </span>

                <strong>
                    ${formattedDate}
                </strong>
            </div>

        </div>

        <div class="receipt-divider"></div>

        <h2>Order Summary</h2>

        <div class="receipt-items">
            ${itemsHtml}
        </div>

        <div class="receipt-total">

            <span>Total Amount</span>

            <strong>
                ${formatCurrency(order.total)}
            </strong>

        </div>

        <div class="customer-details">

            <h3>Delivery Information</h3>

            <div class="detail-row">
                <span>Address</span>
                <strong>${order.address}</strong>
            </div>

            <div class="detail-row">
                <span>Contact</span>
                <strong>${order.contact}</strong>
            </div>

            <div class="detail-row">
                <span>Payment</span>
                <strong>Cash on Delivery</strong>
            </div>

        </div>
    `;
}

function initReceiptPage() {
    const receiptDetails =
        document.getElementById("receipt-details");

    const whatsappButton =
        document.getElementById("whatsapp-button");

    if (!receiptDetails || !whatsappButton) {
        return;
    }

    /*
       Only retrieve the order created during
       this current browsing session.
    */
    const storedOrder =
        sessionStorage.getItem(orderStorageKey);

    let order = null;

    try {
        order = storedOrder
            ? JSON.parse(storedOrder)
            : null;
    } catch (error) {
        console.error(
            "Receipt data is invalid:",
            error
        );
    }

    /* No current order */
    if (
        !order ||
        !Array.isArray(order.items) ||
        order.items.length === 0
    ) {
        receiptDetails.innerHTML = `
            <div class="no-active-order">

                <div class="no-order-icon">
                    🛒
                </div>

                <h2>No Active Order</h2>

                <p>
                    There is no recent order to display.
                    Please place an order from HAFIZ MART first.
                </p>

                <button
                    class="button"
                    type="button"
                    id="go-to-shop-button"
                >
                    🛍️ Go to HAFIZ MART
                </button>

            </div>
        `;

        whatsappButton.style.display = "none";

        const shopButton =
            document.getElementById(
                "go-to-shop-button"
            );

        if (shopButton) {
            shopButton.addEventListener(
                "click",
                () => {
                    window.location.href = "index.html";
                }
            );
        }

        return;
    }

    /* Show current receipt */
    receiptDetails.innerHTML =
        buildReceiptHtml(order);

    whatsappButton.disabled = false;

    /*
       IMPORTANT:
       This click directly opens WhatsApp.
       That helps avoid popup blockers.
    */
    whatsappButton.addEventListener(
        "click",
        () => {
            const phoneNumber = "923141322340";

            const message =
                buildWhatsAppMessage(order);

            const whatsappUrl =
                `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

            const popup =
                window.open(
                    whatsappUrl,
                    "_blank",
                    "noopener,noreferrer"
                );

            /*
               If popup was successfully opened,
               mark this order as completed.
            */
            if (popup) {
                sessionStorage.removeItem(
                    orderStorageKey
                );

                whatsappButton.disabled = true;
                whatsappButton.textContent =
                    "✓ WhatsApp Opened";
            } else {
                /*
                   Popup blocked:
                   don't delete the order.
                */
                showToast(
                    "WhatsApp was blocked. Please allow pop-ups and try again."
                );
            }
        }
    );
}

/* =========================================================
   WHATSAPP MESSAGE
========================================================= */

function buildWhatsAppMessage(order) {
    let message =
        "🛒 HAFIZ MART - NEW ORDER\n\n";

    message +=
        `Order Number: ${order.orderNumber}\n`;

    message +=
        "------------------------------\n\n";

    order.items.forEach(item => {
        const itemTotal =
            Number(item.unitPrice) *
            Number(item.quantity);

        message +=
            `Product: ${item.name}\n`;

        message +=
            `Size: ${item.size}\n`;

        message +=
            `Quantity: ${item.quantity}\n`;

        message +=
            `Price: PKR ${itemTotal.toLocaleString("en-PK")}\n\n`;
    });

    message +=
        "------------------------------\n";

    message +=
        `TOTAL: PKR ${Number(order.total).toLocaleString("en-PK")}\n\n`;

    message +=
        "DELIVERY INFORMATION\n";

    message +=
        `Address: ${order.address}\n`;

    message +=
        `Contact: ${order.contact}\n`;

    message +=
        "Payment: Cash on Delivery\n\n";

    message +=
        "Thank you for ordering from HAFIZ MART!";

    return message;
}

/* =========================================================
   INITIALIZATION
========================================================= */

function init() {
    loadPageComponents()
        .then(() => {

            if (
                document.getElementById(
                    "product-list"
                )
            ) {
                initIndexPage();
            }

            if (
                document.getElementById(
                    "receipt-details"
                )
            ) {
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

document.addEventListener(
    "DOMContentLoaded",
    init
);
