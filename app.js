/* =========================================================
   HAFIZ MART - APPLICATION
========================================================= */

const products = [
    {
        id: 1,
        name: "Rice",
        sizes: ["1kg", "5kg", "10kg"],
        price: {
            "1kg": 560,
            "5kg": 2520,
            "10kg": 4760
        }
    },
    {
        id: 2,
        name: "Sugar",
        sizes: ["1kg", "5kg"],
        price: {
            "1kg": 280,
            "5kg": 1120
        }
    },
    {
        id: 3,
        name: "Flour",
        sizes: ["1kg", "5kg"],
        price: {
            "1kg": 420,
            "5kg": 1680
        }
    },
    {
        id: 4,
        name: "Salt",
        sizes: ["500g", "1kg"],
        price: {
            "500g": 140,
            "1kg": 280
        }
    },
    {
        id: 5,
        name: "Cooking Oil",
        sizes: ["1L", "5L"],
        price: {
            "1L": 840,
            "5L": 3360
        }
    },
    {
        id: 6,
        name: "Pasta",
        sizes: ["500g", "1kg"],
        price: {
            "500g": 340,
            "1kg": 700
        }
    },
    {
        id: 7,
        name: "Canned Beans",
        sizes: ["400g"],
        price: {
            "400g": 420
        }
    },
    {
        id: 8,
        name: "Tomato Sauce",
        sizes: ["500g"],
        price: {
            "500g": 560
        }
    },
    {
        id: 9,
        name: "Milk",
        sizes: ["1L"],
        price: {
            "1L": 420
        }
    },
    {
        id: 10,
        name: "Cheese",
        sizes: ["200g"],
        price: {
            "200g": 840
        }
    },
    {
        id: 11,
        name: "Butter",
        sizes: ["250g"],
        price: {
            "250g": 700
        }
    },
    {
        id: 12,
        name: "Yogurt",
        sizes: ["500g"],
        price: {
            "500g": 504
        }
    },
    {
        id: 13,
        name: "Eggs",
        sizes: ["dozen"],
        price: {
            "dozen": 840
        }
    },
    {
        id: 14,
        name: "Chicken",
        sizes: ["1kg"],
        price: {
            "1kg": 1400
        }
    },
    {
        id: 15,
        name: "Beef",
        sizes: ["1kg"],
        price: {
            "1kg": 1960
        }
    },
    {
        id: 16,
        name: "Fish",
        sizes: ["1kg"],
        price: {
            "1kg": 1680
        }
    },
    {
        id: 17,
        name: "Vegetables",
        sizes: ["500g", "1kg"],
        price: {
            "500g": 280,
            "1kg": 504
        }
    },
    {
        id: 18,
        name: "Fruits",
        sizes: ["500g", "1kg"],
        price: {
            "500g": 420,
            "1kg": 700
        }
    },
    {
        id: 19,
        name: "Bread",
        sizes: ["loaf"],
        price: {
            "loaf": 280
        }
    },
    {
        id: 20,
        name: "Snacks",
        sizes: ["200g"],
        price: {
            "200g": 420
        }
    }
];


/* =========================================================
   STORAGE
========================================================= */

const orderStorageKey = "hafizMartOrder";
const cartStorageKey = "hafizMartCart";

let selectedItems = [];
let filteredProducts = [...products];


/* =========================================================
   HELPERS
========================================================= */

function formatCurrency(value) {
    return `PKR ${Number(value).toLocaleString("en-PK")}`;
}


function loadComponent(path) {
    return fetch(path).then(response => {

        if (!response.ok) {
            throw new Error(
                `Unable to load component: ${path}`
            );
        }

        return response.text();
    });
}


/* =========================================================
   COMPONENTS
========================================================= */

async function loadPageComponents() {

    const headerTarget =
        document.getElementById("header") ||
        document.getElementById("header-placeholder");

    const footerTarget =
        document.getElementById("footer") ||
        document.getElementById("footer-placeholder");


    if (headerTarget) {

        const headerHtml =
            await loadComponent("header.html")
                .catch(() => "");

        headerTarget.innerHTML = headerHtml;
    }


    if (footerTarget) {

        const footerHtml =
            await loadComponent("footer.html")
                .catch(() => "");

        footerTarget.innerHTML = footerHtml;
    }
}


/* =========================================================
   LOCAL STORAGE CART
========================================================= */

function saveCart() {

    localStorage.setItem(
        cartStorageKey,
        JSON.stringify(selectedItems)
    );
}


function loadCart() {

    try {

        const savedCart =
            localStorage.getItem(cartStorageKey);

        if (!savedCart) return;

        const parsedCart =
            JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {

            selectedItems = parsedCart;
        }

    } catch (error) {

        console.error(
            "Unable to load cart:",
            error
        );

        selectedItems = [];
    }
}


/* =========================================================
   PRODUCT CARDS
========================================================= */

function renderProductCards(items = filteredProducts) {

    const productList =
        document.getElementById("product-list");

    if (!productList) return;


    if (items.length === 0) {

        productList.innerHTML = `
            <p class="no-results">
                No products matched your search.
            </p>
        `;

        return;
    }


    productList.innerHTML = items
        .map(product => {

            const sizeOptions =
                product.sizes
                    .map(size => `
                        <option value="${size}">
                            ${size} -
                            ${formatCurrency(
                                product.price[size]
                            )}
                        </option>
                    `)
                    .join("");


            return `
                <article
                    class="product-card"
                    data-product-id="${product.id}"
                >

                    <h3>
                        ${product.name}
                    </h3>

                    <p class="product-price">
                        Starting at
                        ${formatCurrency(
                            product.price[
                                product.sizes[0]
                            ]
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
                        🛒 Add to Cart
                    </button>

                </article>
            `;
        })
        .join("");
}


function findProduct(productId) {

    return products.find(
        product => product.id === productId
    );
}


/* =========================================================
   CART TOTAL
========================================================= */

function calculateCartTotal() {

    return selectedItems.reduce(
        (sum, item) =>
            sum + (
                Number(item.unitPrice) *
                Number(item.quantity)
            ),
        0
    );
}


function calculateCartQuantity() {

    return selectedItems.reduce(
        (sum, item) =>
            sum + Number(item.quantity),
        0
    );
}


/* =========================================================
   MAIN CART SUMMARY
========================================================= */

function updateCartSummary() {

    const cartItemsEl =
        document.getElementById("cart-items");

    const cartTotalEl =
        document.getElementById("cart-total");

    const orderButton =
        document.getElementById("order-button");


    if (!cartItemsEl ||
        !cartTotalEl ||
        !orderButton) {

        return;
    }


    if (selectedItems.length === 0) {

        cartItemsEl.innerHTML = `
            <li class="empty-cart-message">
                Your cart is empty.
            </li>
        `;

        cartTotalEl.textContent = "PKR 0";

        orderButton.disabled = true;

        updateFloatingCart();

        return;
    }


    cartItemsEl.innerHTML =
        selectedItems
            .map(item => `
                <li>
                    <strong>
                        ${item.name}
                    </strong>

                    <br>

                    ${item.size}
                    ×
                    ${item.quantity}

                    —
                    ${formatCurrency(
                        item.unitPrice *
                        item.quantity
                    )}
                </li>
            `)
            .join("");


    cartTotalEl.textContent =
        formatCurrency(
            calculateCartTotal()
        );


    orderButton.disabled = false;

    updateFloatingCart();
}


/* =========================================================
   ADD TO CART
========================================================= */

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
        card.querySelector(
            ".size-select"
        ).value;


    const quantityInput =
        card.querySelector(
            ".quantity-input"
        );


    let quantity =
        parseInt(
            quantityInput.value,
            10
        );


    if (!quantity || quantity < 1) {
        quantity = 1;
    }


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


    saveCart();

    updateCartSummary();

    updateDrawerCart();

    showToast(
        `✓ ${product.name} added to cart`
    );


    quantityInput.value = 1;
}


/* =========================================================
   REMOVE ITEM
========================================================= */

function removeCartItem(index) {

    if (
        index < 0 ||
        index >= selectedItems.length
    ) {
        return;
    }


    const removed =
        selectedItems[index];


    selectedItems.splice(
        index,
        1
    );


    saveCart();

    updateCartSummary();

    updateDrawerCart();

    showToast(
        `${removed.name} removed from cart`
    );
}


/* =========================================================
   CHANGE QUANTITY
========================================================= */

function changeCartQuantity(
    index,
    change
) {

    const item =
        selectedItems[index];

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


/* =========================================================
   CLEAR CART
========================================================= */

function clearCart() {

    if (selectedItems.length === 0) {
        return;
    }


    selectedItems = [];

    saveCart();

    updateCartSummary();

    updateDrawerCart();

    showToast(
        "Cart cleared"
    );
}


/* =========================================================
   DRAWER CART
========================================================= */

function updateDrawerCart() {

    const drawerItems =
        document.getElementById(
            "drawer-cart-items"
        );

    const drawerTotal =
        document.getElementById(
            "drawer-cart-total"
        );

    const drawerCount =
        document.getElementById(
            "drawer-cart-count"
        );


    if (!drawerItems ||
        !drawerTotal ||
        !drawerCount) {

        return;
    }


    const quantity =
        calculateCartQuantity();


    drawerCount.textContent =
        `${quantity} ${
            quantity === 1
                ? "item"
                : "items"
        }`;


    drawerTotal.textContent =
        formatCurrency(
            calculateCartTotal()
        );


    if (selectedItems.length === 0) {

        drawerItems.innerHTML = `
            <div class="drawer-empty">

                <div style="font-size:3rem;">
                    🛒
                </div>

                <h3>
                    Your cart is empty
                </h3>

                <p>
                    Add some groceries to get started.
                </p>

            </div>
        `;

        return;
    }


    drawerItems.innerHTML =
        selectedItems
            .map((item, index) => `

                <div class="drawer-item">

                    <div>

                        <div class="drawer-item-name">
                            ${item.name}
                        </div>

                        <div class="drawer-item-size">
                            Size: ${item.size}
                        </div>

                        <div class="drawer-item-price">
                            ${formatCurrency(
                                item.unitPrice
                            )} each
                        </div>

                        <div class="drawer-item-controls">

                            <button
                                class="quantity-button"
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
                                data-action="increase"
                                data-index="${index}"
                            >
                                +
                            </button>

                            <button
                                class="remove-item"
                                data-action="remove"
                                data-index="${index}"
                            >
                                Remove
                            </button>

                        </div>

                    </div>

                    <div class="drawer-item-total">

                        ${formatCurrency(
                            item.unitPrice *
                            item.quantity
                        )}

                    </div>

                </div>

            `)
            .join("");
}


/* =========================================================
   FLOATING CART
========================================================= */

function updateFloatingCart() {

    const cartCount =
        document.getElementById(
            "cart-count"
        );

    if (!cartCount) return;


    cartCount.textContent =
        calculateCartQuantity();
}


/* =========================================================
   CART DRAWER OPEN/CLOSE
========================================================= */

function openCart() {

    const drawer =
        document.getElementById(
            "cart-drawer"
        );

    const overlay =
        document.getElementById(
            "cart-overlay"
        );


    if (!drawer || !overlay) return;


    updateDrawerCart();

    drawer.classList.add("active");

    overlay.classList.add("active");

    drawer.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";
}


function closeCart() {

    const drawer =
        document.getElementById(
            "cart-drawer"
        );

    const overlay =
        document.getElementById(
            "cart-overlay"
        );


    if (!drawer || !overlay) return;


    drawer.classList.remove("active");

    overlay.classList.remove("active");

    drawer.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow =
        "";
}


/* =========================================================
   CART DRAWER ACTIONS
========================================================= */

function handleDrawerClick(event) {

    const button =
        event.target.closest(
            "[data-action]"
        );

    if (!button) return;


    const index =
        Number(
            button.dataset.index
        );


    const action =
        button.dataset.action;


    if (action === "increase") {

        changeCartQuantity(
            index,
            1
        );

    }


    if (action === "decrease") {

        changeCartQuantity(
            index,
            -1
        );

    }


    if (action === "remove") {

        removeCartItem(index);

    }
}


/* =========================================================
   PRODUCT CLICK
========================================================= */

function handleIndexPageClick(event) {

    const button =
        event.target.closest(
            ".add-to-cart"
        );

    if (!button) return;


    const productId =
        Number(
            button.dataset.productId
        );


    addProductToCart(
        productId
    );
}


/* =========================================================
   SEARCH
========================================================= */

function filterProducts(query) {

    const normalized =
        query
            .trim()
            .toLowerCase();


    if (!normalized) {

        filteredProducts =
            [...products];

    } else {

        filteredProducts =
            products.filter(
                product =>
                    product.name
                        .toLowerCase()
                        .includes(normalized)
            );
    }


    renderProductCards(
        filteredProducts
    );


    updateSearchInfo(
        normalized
    );
}


function updateSearchInfo(query) {

    const resultInfo =
        document.getElementById(
            "search-result-info"
        );


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
   CHECKOUT
========================================================= */

function scrollToCheckout() {

    const checkout =
        document.getElementById(
            "checkout-section"
        );

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
        document.getElementById(
            "delivery-address"
        );

    const contactInput =
        document.getElementById(
            "contact-number"
        );

    const messageEl =
        document.getElementById(
            "form-message"
        );


    if (!addressInput ||
        !contactInput ||
        !messageEl) {

        return;
    }


    const address =
        addressInput.value.trim();


    const contact =
        contactInput.value.trim();


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
        contact.replace(
            /[\s()-]/g,
            ""
        );


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

        orderId:
            "HM-" +
            Date.now()
                .toString()
                .slice(-8),

        items:
            selectedItems.map(item => ({
                ...item
            })),

        total:
            calculateCartTotal(),

        address:

            address,

        contact:
            contact,

        createdAt:
            new Date()
                .toISOString()
    };


    localStorage.setItem(
        orderStorageKey,
        JSON.stringify(order)
    );


    /*
       IMPORTANT:
       We don't clear the cart before receipt.html
       because the receipt needs the saved order.
    */

    window.location.href =
        "receipt.html";
}


/* =========================================================
   TOAST
========================================================= */

let toastTimer;


function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );

    if (!toast) return;


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 2500);
}


/* =========================================================
   BACK TO TOP
========================================================= */

function initBackToTop() {

    const button =
        document.getElementById(
            "back-to-top"
        );


    if (!button) return;


    window.addEventListener(
        "scroll",
        () => {

            if (window.scrollY > 500) {

                button.classList.add(
                    "show"
                );

            } else {

                button.classList.remove(
                    "show"
                );
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
   INDEX PAGE
========================================================= */

function initIndexPage() {

    loadCart();

    renderProductCards();

    updateCartSummary();

    updateDrawerCart();


    const productList =
        document.getElementById(
            "product-list"
        );


    const searchInput =
        document.getElementById(
            "search-input"
        );


    const clearSearch =
        document.getElementById(
            "clear-search"
        );


    const floatingCart =
        document.getElementById(
            "floating-cart"
        );


    const closeCartButton =
        document.getElementById(
            "close-cart"
        );


    const overlay =
        document.getElementById(
            "cart-overlay"
        );


    const drawerItems =
        document.getElementById(
            "drawer-cart-items"
        );


    const clearCartButton =
        document.getElementById(
            "clear-cart"
        );


    const drawerCheckout =
        document.getElementById(
            "drawer-checkout"
        );


    const orderButton =
        document.getElementById(
            "order-button"
        );


    const shopNowButton =
        document.getElementById(
            "shop-now-button"
        );


    if (productList) {

        productList.addEventListener(
            "click",
            handleIndexPageClick
        );
    }


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            event => {

                const value =
                    event.target.value;

                filterProducts(value);


                if (clearSearch) {

                    clearSearch.style.display =
                        value
                            ? "block"
                            : "none";
                }
            }
        );
    }


    if (clearSearch) {

        clearSearch.addEventListener(
            "click",
            () => {

                searchInput.value = "";

                filterProducts("");

                clearSearch.style.display =
                    "none";

                searchInput.focus();
            }
        );
    }


    if (floatingCart) {

        floatingCart.addEventListener(
            "click",
            openCart
        );
    }


    if (closeCartButton) {

        closeCartButton.addEventListener(
            "click",
            closeCart
        );
    }


    if (overlay) {

        overlay.addEventListener(
            "click",
            closeCart
        );
    }


    if (drawerItems) {

        drawerItems.addEventListener(
            "click",
            handleDrawerClick
        );
    }


    if (clearCartButton) {

        clearCartButton.addEventListener(
            "click",
            clearCart
        );
    }


    if (drawerCheckout) {

        drawerCheckout.addEventListener(
            "click",
            () => {

                closeCart();

                scrollToCheckout();

            }
        );
    }


    if (orderButton) {

        orderButton.addEventListener(
            "click",
            submitOrder
        );
    }


    if (shopNowButton) {

        shopNowButton.addEventListener(
            "click",
            () => {

                const productList =
                    document.getElementById(
                        "product-list"
                    );

                if (productList) {

                    productList.scrollIntoView({
                        behavior: "smooth"
                    });
                }
            }
        );
    }


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
   RECEIPT PAGE
========================================================= */

function buildReceiptHtml(order) {

    return `
        <div class="receipt-card">

            <h2>
                Order Summary
            </h2>

            ${
                order.orderId
                    ? `
                        <p>
                            <strong>
                                Order ID:
                            </strong>
                            ${order.orderId}
                        </p>
                    `
                    : ""
            }

            <ul>

                ${order.items
                    .map(
                        item => `
                            <li>

                                <strong>
                                    ${item.name}
                                </strong>

                                <br>

                                Size:
                                ${item.size}

                                <br>

                                Quantity:
                                ${item.quantity}

                                <br>

                                Price:
                                ${formatCurrency(
                                    item.unitPrice *
                                    item.quantity
                                )}

                            </li>
                        `
                    )
                    .join("")}

            </ul>

            <p>
                <strong>
                    Total Amount:
                </strong>

                ${formatCurrency(
                    order.total
                )}
            </p>

            <p>
                <strong>
                    Delivery Address:
                </strong>

                ${order.address}
            </p>

            <p>
                <strong>
                    Contact Number:
                </strong>

                ${order.contact}
            </p>

        </div>
    `;
}


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


    const storedOrder =
        localStorage.getItem(
            orderStorageKey
        );


    const order =
        storedOrder
            ? JSON.parse(storedOrder)
            : null;


    if (
        !order ||
        !Array.isArray(order.items) ||
        order.items.length === 0
    ) {

        receiptDetails.innerHTML = `
            <p class="empty-receipt">
                No order found.
                Please place an order first.
            </p>
        `;

        whatsappButton.disabled =
            true;

        return;
    }


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

                /*
                   Clear the cart after the
                   WhatsApp button has been used.
                */

                localStorage.removeItem(
                    cartStorageKey
                );

                return;
            }


            const fallbackMessage =
                `HAFIZ MART ORDER

${order.items
    .map(
        item =>
            `${item.name} - ${item.size} x ${item.quantity} = ${formatCurrency(
                item.unitPrice *
                item.quantity
            )}`
    )
    .join("\n")}

Total Amount: ${formatCurrency(
                    order.total
                )}

Delivery Address:
${order.address}

Contact Number:
${order.contact}`;


            const whatsappUrl =
                `https://api.whatsapp.com/send?text=${encodeURIComponent(
                    fallbackMessage
                )}`;


            window.open(
                whatsappUrl,
                "_blank"
            );
        }
    );
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
