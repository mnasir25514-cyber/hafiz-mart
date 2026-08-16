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


/* =========================================
   ORDER STORAGE
========================================= */

const orderStorageKey = "hafizMartCurrentOrder";

let selectedItems = [];
let filteredProducts = [...products];


/* =========================================
   CURRENCY
========================================= */

function formatCurrency(value) {
    return `PKR ${Number(value).toLocaleString("en-PK")}`;
}


/* =========================================
   LOAD HEADER / FOOTER
========================================= */

function loadComponent(path) {

    return fetch(path)
        .then(response => {

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

        const headerHtml =
            await loadComponent("components/header.html")
                .catch(() => "");

        headerTarget.innerHTML = headerHtml;
    }


    if (footerTarget) {

        const footerHtml =
            await loadComponent("components/footer.html")
                .catch(() => "");

        footerTarget.innerHTML = footerHtml;
    }
}


/* =========================================
   PRODUCT CARDS
========================================= */

function renderProductCards(items = filteredProducts) {

    const productList =
        document.getElementById("product-list");

    if (!productList) return;


    if (items.length === 0) {

        productList.innerHTML = `
            <div class="no-results">
                <h3>No Products Found</h3>
                <p>Try searching for another product.</p>
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

                <div class="product-icon">
                    🛒
                </div>

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
                >
                    🛒 Add to Cart
                </button>

            </article>
        `;

    }).join("");
}


/* =========================================
   FIND PRODUCT
========================================= */

function findProduct(productId) {

    return products.find(
        product => product.id === productId
    );
}


/* =========================================
   UPDATE CART
========================================= */

function updateCartSummary() {

    const cartItemsEl =
        document.getElementById("cart-items");

    const cartTotalEl =
        document.getElementById("cart-total");

    const orderButton =
        document.getElementById("order-button");


    if (!cartItemsEl || !cartTotalEl || !orderButton) {
        return;
    }


    if (selectedItems.length === 0) {

        cartItemsEl.innerHTML = `
            <li class="empty-cart">
                🛒 Your cart is empty.
            </li>
        `;

        cartTotalEl.textContent = "PKR 0";

        orderButton.disabled = true;

        return;
    }


    const total = selectedItems.reduce(
        (sum, item) =>
            sum + item.unitPrice * item.quantity,
        0
    );


    cartItemsEl.innerHTML = selectedItems
        .map((item, index) => {

            const itemTotal =
                item.unitPrice * item.quantity;

            return `
                <li class="cart-item">

                    <div>
                        <strong>${item.name}</strong>

                        <small>
                            ${item.size} × ${item.quantity}
                        </small>
                    </div>

                    <div class="cart-item-right">

                        <strong>
                            ${formatCurrency(itemTotal)}
                        </strong>

                        <button
                            class="remove-item"
                            data-index="${index}"
                            title="Remove item"
                        >
                            ✕
                        </button>

                    </div>

                </li>
            `;

        })
        .join("");


    cartTotalEl.textContent =
        formatCurrency(total);

    orderButton.disabled = false;
}


/* =========================================
   ADD PRODUCT
========================================= */

function addProductToCart(productId) {

    const card =
        document.querySelector(
            `.product-card[data-product-id="${productId}"]`
        );

    if (!card) return;


    const product =
        findProduct(productId);

    if (!product) return;


    const size =
        card.querySelector(".size-select").value;


    const quantity =
        Math.max(
            1,
            parseInt(
                card.querySelector(".quantity-input").value,
                10
            ) || 1
        );


    const unitPrice =
        product.price[size];


    const existingItem =
        selectedItems.find(
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

            size: size,

            quantity: quantity,

            unitPrice: unitPrice

        });

    }


    updateCartSummary();


    /* Scroll to cart */

    const cart =
        document.querySelector(".cart-panel");

    if (cart) {

        cart.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }
}


/* =========================================
   REMOVE ITEM
========================================= */

function removeCartItem(index) {

    selectedItems.splice(index, 1);

    updateCartSummary();
}


/* =========================================
   PRODUCT LIST CLICK
========================================= */

function handleProductListClick(event) {

    const addButton =
        event.target.closest(".add-to-cart");


    if (addButton) {

        const productId =
            Number(addButton.dataset.productId);

        addProductToCart(productId);

        return;
    }


    const removeButton =
        event.target.closest(".remove-item");


    if (removeButton) {

        const index =
            Number(removeButton.dataset.index);

        removeCartItem(index);
    }
}


/* =========================================
   SEARCH
========================================= */

function filterProducts(query) {

    const normalized =
        query.trim().toLowerCase();


    if (!normalized) {

        filteredProducts =
            [...products];

        renderProductCards();

        return;
    }


    filteredProducts =
        products.filter(product =>
            product.name
                .toLowerCase()
                .includes(normalized)
        );


    renderProductCards();
}


/* =========================================
   SUBMIT ORDER
========================================= */

function submitOrder() {

    const addressInput =
        document.getElementById("delivery-address");

    const contactInput =
        document.getElementById("contact-number");

    const messageEl =
        document.getElementById("form-message");


    if (!addressInput ||
        !contactInput ||
        !messageEl) {

        return;
    }


    const address =
        addressInput.value.trim();

    const contact =
        contactInput.value.trim();


    if (selectedItems.length === 0) {

        messageEl.textContent =
            "Please add at least one product to your cart.";

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


    const total =
        selectedItems.reduce(
            (sum, item) =>
                sum + item.unitPrice * item.quantity,
            0
        );


    /* Generate order number */

    const orderNumber =
        "HM-" +
        Date.now().toString().slice(-8);


    const order = {

        orderNumber,

        items: selectedItems,

        total,

        address,

        contact,

        createdAt:
            new Date().toISOString()

    };


    /*
       IMPORTANT:
       sessionStorage means this order is temporary.
       Old customers' orders won't remain forever.
    */

    sessionStorage.setItem(
        orderStorageKey,
        JSON.stringify(order)
    );


    /* Move to receipt */

    window.location.href =
        "receipt.html";
}


/* =========================================
   INDEX PAGE
========================================= */

function initIndexPage() {

    renderProductCards();


    const productList =
        document.getElementById("product-list");

    const orderButton =
        document.getElementById("order-button");

    const searchInput =
        document.getElementById("search-input");


    if (!productList ||
        !orderButton ||
        !searchInput) {

        return;
    }


    productList.addEventListener(
        "click",
        handleProductListClick
    );


    orderButton.addEventListener(
        "click",
        submitOrder
    );


    searchInput.addEventListener(
        "input",
        event =>
            filterProducts(
                event.target.value
            )
    );


    updateCartSummary();
}


/* =========================================
   RECEIPT HTML
========================================= */

function buildReceiptHtml(order) {

    const orderDate =
        new Date(order.createdAt);


    const formattedDate =
        orderDate.toLocaleString(
            "en-PK",
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        );


    const itemsHtml =
        order.items.map(item => {

            const itemTotal =
                item.unitPrice * item.quantity;


            return `
                <div class="receipt-item">

                    <div class="receipt-item-info">

                        <strong>
                            ${item.name}
                        </strong>

                        <span>
                            ${item.size} × ${item.quantity}
                        </span>

                    </div>


                    <strong>
                        ${formatCurrency(itemTotal)}
                    </strong>

                </div>
            `;

        }).join("");


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

            <span>
                Total Amount
            </span>

            <strong>
                ${formatCurrency(order.total)}
            </strong>

        </div>


        <div class="customer-details">

            <h3>Delivery Information</h3>


            <div class="detail-row">

                <span>Address</span>

                <strong>
                    ${order.address}
                </strong>

            </div>


            <div class="detail-row">

                <span>Contact</span>

                <strong>
                    ${order.contact}
                </strong>

            </div>


            <div class="detail-row">

                <span>Payment</span>

                <strong>
                    Cash on Delivery
                </strong>

            </div>

        </div>

    `;
}


/* =========================================
   RECEIPT PAGE
========================================= */

function initReceiptPage() {

    const receiptDetails =
        document.getElementById(
            "receipt-details"
        );

    const whatsappButton =
        document.getElementById(
            "whatsapp-button"
        );


    if (!receiptDetails ||
        !whatsappButton) {

        return;
    }


    /*
       Get ONLY the current session order.
    */

    const storedOrder =
        sessionStorage.getItem(
            orderStorageKey
        );


    const order =
        storedOrder
            ? JSON.parse(storedOrder)
            : null;


    /*
       NO CURRENT ORDER
    */

    if (!order ||
        !Array.isArray(order.items) ||
        order.items.length === 0) {


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
                    onclick="window.location.href='index.html'"
                >
                    🛍️ Go to HAFIZ MART
                </button>

            </div>

        `;


        whatsappButton.style.display =
            "none";


        return;
    }


    /*
       SHOW RECEIPT
    */

    receiptDetails.innerHTML =
        buildReceiptHtml(order);


    whatsappButton.disabled =
        false;


    whatsappButton.addEventListener(
        "click",
        () => {


            if (
                typeof window.sendWhatsAppMessage ===
                "function"
            ) {

                window.sendWhatsAppMessage(
                    order.items,
                    order.total,
                    order.address,
                    order.contact
                );

            }


            /*
               Remove the order after sending.
               This prevents an old customer's receipt
               from appearing later.
            */

            sessionStorage.removeItem(
                orderStorageKey
            );


            whatsappButton.disabled =
                true;


            whatsappButton.textContent =
                "✓ Receipt Sent";


        }
    );
}


/* =========================================
   INITIALIZE
========================================= */

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
