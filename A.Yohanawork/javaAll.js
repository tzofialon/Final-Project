// ==================== INVENTORY ====================

// המלאי מגיע מ-MongoDB
const inventory = {};


// טעינת כל המלאי מ-MongoDB
async function loadInventoryFromMongo() {

    try {

        const response = await fetch(
            "http://localhost:3000/products"
        );

        if (!response.ok) {
            throw new Error("Failed to load inventory");
        }

        const products = await response.json();

        products.forEach(product => {
            inventory[product.productId] =
                product.stock ?? 0;
        });

        updateInventoryDisplay();

    } catch (error) {

        console.error(
            "Error loading inventory from MongoDB:",
            error
        );
    }
}


// עדכון המלאי של מוצר ב-MongoDB
async function updateStockInMongo(productId) {

    try {

        const response = await fetch(
            `http://localhost:3000/products/${productId}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    stock: inventory[productId]
                })
            }
        );

        if (!response.ok) {
            throw new Error("Failed to update stock");
        }

    } catch (error) {

        console.error(
            "Error updating stock in MongoDB:",
            error
        );

        throw error;
    }
}


// ======================================================
// SHOPPING CART // עגלת קניות
// ======================================================

let cart = [];


// בדיקה האם המשתמש הוא אורח
function isGuestUser() {

    const username =
        localStorage.getItem("username");

    const role =
        localStorage.getItem("role");

    return !username ||
        username === "Guest" ||
        (
            role !== "customer" &&
            role !== "admin"
        );
}


// ======================================================
// CART - MONGODB
// שמירת עגלת המשתמש ב-MongoDB
// ======================================================
//
// חשוב:
// localStorage משמש כאן רק כדי לדעת
// מי המשתמש המחובר ומה ה-role שלו.
//
// המוצרים שבעגלה עצמה נשמרים ב-MongoDB.
// ======================================================


// ==================== SAVE CART ====================
// UPDATE CART // עדכון העגלה ב-MongoDB

async function saveCart() {

    if (isGuestUser()) {
        return;
    }

    const username =
        localStorage.getItem("username");


    // התאמת מבנה העגלה למבנה
    // שהשרת שומר ב-MongoDB
    const itemsForServer =
        cart.map(item => ({

            productId: item.id,

            name: item.name,

            price: item.price,

            image: item.image,

            quantity: item.quantity

        }));


    const response = await fetch(

        `http://localhost:3000/cart/${encodeURIComponent(username)}`,

        {
            // PUT // עדכון עגלת המשתמש
            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                items: itemsForServer
            })
        }

    );


    if (!response.ok) {

        throw new Error(
            "Failed to save cart in MongoDB"
        );
    }
}


// ==================== LOAD CART ====================
// READ CART // קריאת העגלה מ-MongoDB

async function loadCart() {

    // לאורח אין עגלה ב-MongoDB
    if (isGuestUser()) {

        cart = [];

        updateCart();

        return;
    }


    try {

        const username =
            localStorage.getItem("username");


        // GET // בקשה לקבלת העגלה של המשתמש
        const response = await fetch(

            `http://localhost:3000/cart/${encodeURIComponent(username)}`

        );


        if (!response.ok) {

            throw new Error(
                "Failed to load cart from MongoDB"
            );
        }


        const mongoCart =
            await response.json();


        // השרת שומר productId,
        // אבל ה-Frontend משתמש בשם id.
        // לכן ממירים כאן בין המבנים.
        cart =
            (mongoCart.items || [])
                .map(item => ({

                    id: item.productId,

                    name: item.name,

                    price: item.price,

                    image: item.image,

                    quantity: item.quantity

                }));


        updateCart();

    } catch (error) {

        console.error(
            "Error loading cart from MongoDB:",
            error
        );

        cart = [];

        updateCart();
    }
}


// ======================================================
// INVENTORY DISPLAY
// הצגת המלאי באתר
// ======================================================

function updateInventoryDisplay() {

    for (const productId in inventory) {

        const inventoryElement =
            document.getElementById(
                `inventory_${productId}`
            );

        if (inventoryElement) {

            inventoryElement.textContent =
                `inventory: ${inventory[productId]}`;
        }
    }
}


// ======================================================
// ADD TO CART
// הוספת מוצר לעגלה
// ======================================================

async function addToCart(
    carId,
    carName,
    carPrice,
    carImage
) {

    if (isGuestUser()) {

        alert(
            "Please log in or register before shopping."
        );

        return;
    }


    const existingCar =
        cart.find(
            item => item.id === carId
        );


    const quantityInCart =
        existingCar
            ? existingCar.quantity
            : 0;


    // ==================================================
    // STOCK CHECK
    // בדיקת מלאי בלבד
    // ==================================================
    //
    // בשלב הוספה לעגלה אנחנו לא מורידים
    // שום דבר מהמלאי ב-MongoDB.
    //
    // המלאי יורד רק לאחר תשלום מוצלח.
    // ==================================================

    if (
        quantityInCart >=
        (inventory[carId] ?? 0)
    ) {

        alert(
            "The product is out of stock!"
        );

        return;
    }


    if (existingCar) {

        // אם המוצר כבר בעגלה
        // מעלים את הכמות שלו
        existingCar.quantity++;

    } else {

        // אם המוצר עדיין לא בעגלה
        // מוסיפים אותו
        cart.push({

            id: carId,

            name: carName,

            price: carPrice,

            quantity: 1,

            image: carImage

        });
    }


    // UPDATE MONGODB CART
    // שמירת העגלה המעודכנת במסד הנתונים
    await saveCart();


    // עדכון התצוגה באתר
    updateCart();
}


// ======================================================
// REMOVE FROM CART
// הסרת מוצר מהעגלה
// ======================================================

async function removeFromCart(carId) {

    if (isGuestUser()) {

        alert(
            "Please log in or register before shopping."
        );

        return;
    }


    const index =
        cart.findIndex(
            item => item.id === carId
        );


    if (index !== -1) {

        // מסירים את המוצר מהעגלה בלבד.
        //
        // לא משנים כאן את המלאי של המוצר
        // ב-MongoDB.
        cart.splice(index, 1);


        // UPDATE CART IN MONGODB
        await saveCart();


        // עדכון התצוגה
        updateCart();
    }
}


// ======================================================
// UPDATE CART DISPLAY
// עדכון תצוגת העגלה באתר
// ======================================================

function updateCart() {

    const cartCount =
        document.getElementById(
            "cart-count"
        );


    // הצגת מספר הפריטים בעגלה
    if (cartCount) {

        cartCount.textContent =
            cart.reduce(
                (total, item) =>
                    total + item.quantity,
                0
            );
    }


    const cartItems =
        document.getElementById(
            "cartItems"
        );


    const totalPriceElement =
        document.getElementById(
            "totalPrice"
        );


    if (
        cartItems &&
        totalPriceElement
    ) {

        cartItems.innerHTML = "";


        const cartContent =
            document.getElementById(
                "cart-content"
            );


        const emptyCart =
            document.getElementById(
                "cart-empty"
            );


        const summaryTotal =
            document.getElementById(
                "cart-summary-total"
            );


        if (cartContent) {

            cartContent.hidden =
                cart.length === 0;
        }


        if (emptyCart) {

            emptyCart.hidden =
                cart.length !== 0;
        }


        let totalPrice = 0;


        cart.forEach(item => {

            totalPrice +=
                item.price *
                item.quantity;


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `
                <td>
                    <div class="cart-product">

                        <img
                            src="${item.image}"
                            alt="${item.name}"
                            width="50"
                        >

                        <span>
                            ${item.name}
                        </span>

                    </div>
                </td>

                <td>
                    ${item.price} ₪
                </td>

                <td>

                    <button
                        class="cart-quantity-button"
                        type="button"
                        aria-label="Decrease ${item.name} quantity"
                        onclick="decreaseQuantity(${item.id})"
                    >
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        class="cart-quantity-button"
                        type="button"
                        aria-label="Increase ${item.name} quantity"
                        onclick="increaseQuantity(${item.id})"
                    >
                        +
                    </button>

                </td>

                <td>
                    ${item.price * item.quantity} ₪
                </td>

                <td>

                    <button
                        class="cart-remove-button"
                        type="button"
                        aria-label="Remove ${item.name} from cart"
                        onclick="removeFromCart(${item.id})"
                    >
                        Remove
                    </button>

                </td>
            `;


            cartItems.appendChild(row);
        });


        totalPriceElement.textContent =
            `${totalPrice} ₪`;


        if (summaryTotal) {

            summaryTotal.textContent =
                `${totalPrice} ₪`;
        }
    }
}


// ======================================================
// CHANGE QUANTITY
// שינוי כמות של מוצר בעגלה
// ======================================================


// ==================== INCREASE QUANTITY ====================

async function increaseQuantity(carId) {

    if (isGuestUser()) {

        alert(
            "Please log in or register before shopping."
        );

        return;
    }


    const item =
        cart.find(
            i => i.id === carId
        );


    if (!item) {
        return;
    }


    // STOCK CHECK
    //
    // בודקים את המלאי האמיתי שקיבלנו מ-MongoDB,
    // אבל עדיין לא מורידים ממנו.
    if (
        item.quantity >=
        (inventory[carId] ?? 0)
    ) {

        alert(
            "The product is out of stock!"
        );

        return;
    }


    item.quantity++;


    // UPDATE CART IN MONGODB
    await saveCart();


    updateCart();
}


// ==================== DECREASE QUANTITY ====================

async function decreaseQuantity(carId) {

    if (isGuestUser()) {

        alert(
            "Please log in or register before shopping."
        );

        return;
    }


    const item =
        cart.find(
            i => i.id === carId
        );


    if (!item) {
        return;
    }


    item.quantity--;


    // אם הכמות ירדה ל-0
    // מסירים את המוצר מהעגלה.
    if (item.quantity <= 0) {

        cart =
            cart.filter(
                i => i.id !== carId
            );
    }


    // UPDATE CART IN MONGODB
    await saveCart();


    updateCart();
}


// ======================================================
// PAGE LOAD
// טעינת העגלה והמלאי כאשר הדף נטען
// ======================================================

document.addEventListener(
    "DOMContentLoaded",

    async () => {

        // READ CART FROM MONGODB
        await loadCart();

        // READ INVENTORY FROM MONGODB
        await loadInventoryFromMongo();
    }
);
// ======================================================
// PRICE FILTER
// סינון מוצרים לפי מחיר
// ======================================================

function filterCars() {

    const priceMin =
        parseFloat(
            document.getElementById(
                "price-min"
            ).value
        ) || 0;


    const priceMax =
        parseFloat(
            document.getElementById(
                "price-max"
            ).value
        ) || Infinity;


    const carItems =
        document.querySelectorAll(
            ".car-item"
        );


    carItems.forEach(carItem => {

        const priceText =
            carItem.querySelector(
                "p:nth-of-type(2)"
            ).textContent;


        const price =
            parseFloat(
                priceText.replace(
                    /[^0-9]/g,
                    ""
                )
            );


        const matchesPrice =
            price >= priceMin &&
            price <= priceMax;


        if (matchesPrice) {

            carItem.style.display =
                "block";

        } else {

            carItem.style.display =
                "none";
        }
    });
}


// ======================================================
// PAYMENT
// תשלום + יצירת הזמנה ב-MongoDB
// ======================================================

async function validatePayment() {

    // ==================================================
    // USER CHECK
    // רק משתמש מחובר יכול לבצע רכישה
    // ==================================================

    if (isGuestUser()) {

        alert(
            "Please log in or register to complete checkout."
        );

        window.location.href =
            "login.html";

        return;
    }


    // ==================================================
    // DELIVERY ADDRESS
    // כתובת למשלוח
    // ==================================================

    const deliveryAddress =
        document.getElementById(
            "delivery-address"
        ).value.trim();


    if (!deliveryAddress) {

        alert(
            "Please enter a delivery address."
        );

        document.getElementById(
            "delivery-address"
        ).focus();

        return;
    }


    // ==================================================
    // PAYMENT DETAILS
    // פרטי תשלום
    // ==================================================

    const cardNumber =
        document.getElementById(
            "card-number"
        ).value.replace(/\s/g, "");


    const cvv =
        document.getElementById(
            "cvv"
        ).value;


    const expiryDate =
        document.getElementById(
            "expiry-date"
        ).value;


    const cardHolder =
        document.getElementById(
            "card-holder"
        ).value.trim();


    // ==================================================
    // CARD VALIDATION
    // בדיקות תקינות של פרטי הכרטיס
    // ==================================================

    if (cardNumber.length !== 16) {

        alert(
            "The card number must be 16 digits long."
        );

        return;
    }


    if (cvv.length !== 3) {

        alert(
            "CVV must be 3 digits long."
        );

        return;
    }


    // בדיקה שנבחר תאריך תפוגה
    if (!expiryDate) {

        alert(
            "Please enter the card expiry date."
        );

        return;
    }


    // ==================================================
    // EXPIRY DATE FIX
    // תיקון בדיקת תוקף הכרטיס
    // ==================================================
    //
    // input מסוג month מחזיר לדוגמה:
    // 2026-10
    //
    // אסור לבדוק מול 01/10/2026,
    // כי כרטיס שתוקפו 10/2026 תקף
    // עד סוף חודש אוקטובר.
    // ==================================================

    const currentDate =
        new Date();


    const [
        expiryYear,
        expiryMonth
    ] =
        expiryDate
            .split("-")
            .map(Number);


    // יום 0 של החודש הבא =
    // היום האחרון בחודש שנבחר.
    const selectedDate =
        new Date(
            expiryYear,
            expiryMonth,
            0,
            23,
            59,
            59
        );


    if (selectedDate < currentDate) {

        alert(
            "This card has already expired. Enter a future effective date."
        );

        return;
    }


    if (cardHolder === "") {

        alert(
            "Please enter the cardholder name."
        );

        return;
    }


    // ==================================================
    // CART CHECK
    // לא ניתן לבצע הזמנה עם עגלה ריקה
    // ==================================================

    if (cart.length === 0) {

        alert(
            "Your cart is empty."
        );

        return;
    }


    // ==================================================
    // REFRESH INVENTORY
    // טעינת המלאי העדכני מ-MongoDB לפני הרכישה
    // ==================================================

    await loadInventoryFromMongo();


    // ==================================================
    // STOCK VALIDATION
    // בדיקה שכל המוצרים עדיין קיימים במלאי
    // ==================================================

    for (const item of cart) {

        if (
            (inventory[item.id] ?? 0) <
            item.quantity
        ) {

            alert(
                `There is not enough stock for ${item.name}.`
            );

            return;
        }
    }


    // ==================================================
    // ORDER DATA
    // הכנת נתוני ההזמנה
    // ==================================================

    const username =
        localStorage.getItem(
            "username"
        );


    const orderTotal =
        cart.reduce(
            (sum, item) =>
                sum +
                item.price *
                item.quantity,
            0
        );


    // שומרים צילום של העגלה לפני שמרוקנים אותה.
    //
    // בנוסף ממירים id ל-productId,
    // כי כך Order מוגדר ב-server.js.
    const orderItems =
        cart.map(item => ({

            productId: item.id,

            name: item.name,

            price: item.price,

            image: item.image,

            quantity: item.quantity

        }));


    // ==================================================
    // COMPLETE ORDER
    // ביצוע הרכישה
    // ==================================================

    try {

        // ==================================================
        // STEP 1 - UPDATE STOCK
        // הורדת הכמויות מהמלאי ב-MongoDB
        // ==================================================

        for (const item of cart) {

            inventory[item.id] -=
                item.quantity;


            await updateStockInMongo(
                item.id
            );
        }


        // ==================================================
        // STEP 2 - CREATE ORDER
        // POST /orders
        // שמירת ההזמנה ב-MongoDB
        // ==================================================
        //
        // חשוב:
        // אנחנו לא שולחים לשרת:
        // cardNumber
        // CVV
        // expiryDate
        //
        // פרטי הכרטיס אינם נשמרים ב-MongoDB.
        // ==================================================

        const orderResponse =
            await fetch(
                "http://localhost:3000/orders",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        username:
                            username,

                        items:
                            orderItems,

                        total:
                            orderTotal,

                        deliveryAddress:
                            deliveryAddress
                    })
                }
            );


        if (!orderResponse.ok) {

            throw new Error(
                "Failed to save order in MongoDB"
            );
        }


        // ==================================================
        // STEP 3 - CLEAR CART
        // ריקון העגלה אחרי שההזמנה נשמרה
        // ==================================================

        cart = [];


        // PUT /cart/:username
        // שולח items: [] ולכן העגלה
        // של המשתמש מתרוקנת גם ב-MongoDB.
        await saveCart();


        // עדכון התצוגה המקומית
        updateCart();


        // ==================================================
        // PAYMENT SUCCESS
        // ==================================================

        alert(
            "The payment was successful! An email will be sent with order details and arrival times for collection."
        );


        const audio =
            new Audio(
                "audio/payment.mp3"
            );


        audio.play();


        // מעבר חזרה לדף הבית
        window.location.href =
            "./home.html";


    } catch (error) {

        console.error(
            "Unable to complete order:",
            error
        );


        alert(
            "The order could not be completed. Please try again."
        );


        // במקרה של שגיאה לא מרוקנים כאן
        // את העגלה המקומית.
        return;
    }
}


// ======================================================
// CONTACT FORM
// טופס יצירת קשר
// ======================================================

function messageC() {

    const message =
        document.getElementById(
            "message"
        ).value.trim();


    if (message === "") {

        alert(
            "Please write a meesage"
        );

    } else {

        alert(
            "Your request has been received. We will get back to you as soon as possible"
        );
    }
}


// ======================================================
// PAGE CSS
// הוספת class מתאים לפי הדף
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (
            document.querySelector("p")
                ?.textContent.includes(
                    "Login Page"
                )
        ) {

            document.body.classList.add(
                "login-page"
            );
        }
    }
);


document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (
            document.querySelector("h1")
                ?.textContent.includes(
                    "User Name"
                )
        ) {

            document.body.classList.add(
                "login-page"
            );
        }
    }
);


document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (
            document.querySelector("h1")
                ?.textContent.includes(
                    "your shopping cart"
                )
        ) {

            document.body.classList.add(
                "shopping-cart-page"
            );
        }
    }
);


// ======================================================
// USERNAME
// המשתמש המחובר
// ======================================================

function saveUsername() {

    const username =
        document.getElementById(
            "username"
        ).value;


    if (username) {

        localStorage.setItem(
            "username",
            username
        );


        window.location.href =
            "home.html";
    }
}


document.addEventListener(
    "DOMContentLoaded",
    function () {

        const username =
            localStorage.getItem(
                "username"
            ) || "Guest";


        const welcomeUserElement =
            document.getElementById(
                "welcome-user"
            );


        if (welcomeUserElement) {

            welcomeUserElement.textContent =
                `Hello, ${username}`;
        }
    }
);


// ======================================================
// CART TOTAL / CHECKOUT DISPLAY
// הצגת העגלה וסכום ההזמנה בדף התשלום
// ======================================================
//
// לפני השינוי:
// הקוד קרא cart ו-cartTotal מ-localStorage.
//
// עכשיו:
// העגלה נטענת מ-MongoDB באמצעות loadCart().
// ======================================================

async function loadTotal() {

    const totalDisplay =
        document.getElementById(
            "totalDisplay"
        );


    const checkoutItems =
        document.getElementById(
            "checkoutItems"
        );


    // אם זה בכלל לא דף Checkout,
    // אין צורך לבצע את הקוד.
    if (
        !checkoutItems &&
        !totalDisplay
    ) {

        return;
    }


    if (isGuestUser()) {

        alert(
            "Please log in or register to continue to checkout."
        );

        window.location.href =
            "login.html";

        return;
    }


    // ==================================================
    // READ CART FROM MONGODB
    // טעינת העגלה העדכנית של המשתמש
    // ==================================================

    await loadCart();


    // ==================================================
    // CALCULATE TOTAL
    // חישוב הסכום מתוך העגלה שהגיעה מ-MongoDB
    // ==================================================

    const totalAmount =
        cart.reduce(
            (sum, item) =>
                sum +
                item.price *
                item.quantity,
            0
        );


    // ==================================================
    // CHECKOUT ITEMS
    // הצגת המוצרים בדף התשלום
    // ==================================================

    if (checkoutItems) {

        checkoutItems.innerHTML = "";


        if (cart.length === 0) {

            const emptyMessage =
                document.createElement(
                    "p"
                );


            emptyMessage.className =
                "checkout-empty";


            emptyMessage.textContent =
                "Your cart is currently empty.";


            checkoutItems.appendChild(
                emptyMessage
            );

        } else {

            cart.forEach(item => {

                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "checkout-item";


                const image =
                    document.createElement(
                        "img"
                    );


                image.src =
                    item.image;


                image.alt = "";


                const details =
                    document.createElement(
                        "div"
                    );


                details.className =
                    "checkout-item-details";


                const name =
                    document.createElement(
                        "span"
                    );


                name.textContent =
                    item.name;


                const quantity =
                    document.createElement(
                        "small"
                    );


                quantity.textContent =
                    `Qty ${item.quantity}`;


                const price =
                    document.createElement(
                        "strong"
                    );


                price.textContent =
                    `${item.price * item.quantity} ₪`;


                details.append(
                    name,
                    quantity
                );


                row.append(
                    image,
                    details,
                    price
                );


                checkoutItems.appendChild(
                    row
                );
            });
        }
    }


    // ==================================================
    // TOTAL DISPLAY
    // הצגת המחיר הכולל
    // ==================================================

    if (totalDisplay) {

        if (cart.length > 0) {

            totalDisplay.textContent =
                `Total:${totalAmount} ILS`;

        } else {

            totalDisplay.textContent =
                "Your cart is empty.";
        }
    }
}


// הפעלת Checkout לאחר טעינת הדף
document.addEventListener(
    "DOMContentLoaded",
    loadTotal
);


// ======================================================
// LOGOUT
// התנתקות
// ======================================================

function logout() {

    localStorage.removeItem(
        "username"
    );


    localStorage.setItem(
        "username",
        "Guest"
    );


    localStorage.removeItem(
        "role"
    );


    const welcomeUserElement =
        document.getElementById(
            "welcome-user"
        );


    if (welcomeUserElement) {

        welcomeUserElement.textContent =
            "Hello, Guest";
    }
}
// ======================================================
// MONGODB PRODUCTS
// טעינת המוצרים מ-MongoDB והצגתם באתר
// ======================================================

async function loadProductsFromMongo(category) {

    try {

        // ==================================================
        // READ PRODUCTS FROM SERVER
        // שליחת בקשה לשרת וקבלת המוצרים לפי קטגוריה
        // ==================================================

        const response = await fetch(
            "http://localhost:3000/products?category=" +
            encodeURIComponent(category)
        );


        if (!response.ok) {

            throw new Error(
                `Products request returned status ${response.status}`
            );
        }


        // המרת תשובת השרת למערך JavaScript
        const products =
            await response.json();


        // המקום ב-HTML שבו יוצגו המוצרים
        const productList =
            document.getElementById(
                "car-list"
            );


        if (!productList) {
            return;
        }


        // ניקוי מוצרים קודמים מהמסך
        productList.innerHTML = "";


        // מעבר על כל המוצרים שהתקבלו מ-MongoDB
        products.forEach(product => {


            // ==================================================
            // INVENTORY
            // שמירת המלאי שהגיע מ-MongoDB
            // ==================================================

            inventory[product.productId] =
                product.stock ?? 0;


            // ==================================================
            // PRODUCT CARD
            // יצירת כרטיס מוצר
            // ==================================================

            const productCard =
                document.createElement(
                    "div"
                );


            productCard.className =
                "car-item";


            // ====================
            // PRODUCT IMAGE
            // תמונת המוצר
            // ====================

            const image =
                document.createElement(
                    "img"
                );


            image.src =
                product.image;


            image.alt =
                product.name;


            // ====================
            // PRODUCT NAME
            // שם המוצר
            // ====================

            const name =
                document.createElement(
                    "h3"
                );


            name.textContent =
                product.name;


            // ====================
            // DESCRIPTION
            // תיאור המוצר
            // ====================

            const description =
                document.createElement(
                    "p"
                );


            description.textContent =
                product.description;


            // ====================
            // PRICE
            // מחיר המוצר
            // ====================

            const price =
                document.createElement(
                    "p"
                );


            price.textContent =
                `price: ${product.price} ₪`;


            // ====================
            // STOCK
            // הצגת המלאי
            // ====================

            const inventoryElement =
                document.createElement(
                    "span"
                );


            inventoryElement.id =
                `inventory_${product.productId}`;


            inventoryElement.textContent =
                `inventory: ${inventory[product.productId]}`;


            const lineBreak =
                document.createElement(
                    "br"
                );


            // ==================================================
            // ADD TO CART BUTTON
            // כפתור הוספה לעגלה
            // ==================================================

            const addButton =
                document.createElement(
                    "button"
                );


            addButton.type =
                "button";


            addButton.textContent =
                "add to cart";


            addButton.addEventListener(
                "click",

                () => {

                    addToCart(
                        product.productId,
                        product.name,
                        product.price,
                        product.image
                    );
                }
            );


            // ==================================================
            // ADD ELEMENTS TO PRODUCT CARD
            // הוספת כל האלמנטים לכרטיס המוצר
            // ==================================================

            productCard.append(
                image,
                name,
                description,
                price,
                inventoryElement,
                lineBreak,
                addButton
            );


            // הוספת כרטיס המוצר לרשימה
            productList.appendChild(
                productCard
            );
        });


        // ==================================================
        // CURRENCY API
        // הוספת מחיר משוער בדולרים
        // ==================================================

        await addUsdEstimates(
            productList,
            products
        );


    } catch (error) {

        console.error(
            "Error loading products from MongoDB:",
            error
        );
    }
}



// ======================================================
// API 1 - CURRENCY API
// המרת מחיר משקל לדולר
// ======================================================
//
// API חיצוני ראשון בפרויקט.
//
// המערכת מקבלת שער המרה ILS -> USD
// ומציגה ליד כל מוצר מחיר משוער בדולרים.
//
// ======================================================

async function addUsdEstimates(
    productList,
    products
) {

    try {

        // ==================================================
        // API REQUEST
        // פנייה ל-Frankfurter API
        // ==================================================

        const response =
            await fetch(
                "https://api.frankfurter.dev/v2/rate/ils/usd"
            );


        if (!response.ok) {

            throw new Error(
                `Currency API returned status ${response.status}`
            );
        }


        // קבלת התוצאה מה-API
        const exchangeData =
            await response.json();


        // שער ההמרה שהתקבל
        const exchangeRate =
            exchangeData.rate;


        // ==================================================
        // API DATA VALIDATION
        // בדיקה שהמידע שקיבלנו מה-API תקין
        // ==================================================

        if (
            exchangeData.base !== "ILS" ||
            exchangeData.quote !== "USD" ||
            !Number.isFinite(exchangeRate) ||
            exchangeRate <= 0
        ) {

            throw new Error(
                "Currency API returned an invalid ILS/USD rate"
            );
        }


        // ==================================================
        // DISPLAY USD PRICE
        // הצגת מחיר בדולרים לכל מוצר
        // ==================================================

        products.forEach(
            (product, index) => {

                const productCard =
                    productList.children[
                        index
                    ];


                if (!productCard) {
                    return;
                }


                const ilsPrice =
                    productCard.querySelector(
                        "p:nth-of-type(2)"
                    );


                if (!ilsPrice) {
                    return;
                }


                const usdEstimate =
                    document.createElement(
                        "p"
                    );


                usdEstimate.textContent =
                    `Approx. $${(
                        product.price *
                        exchangeRate
                    ).toFixed(2)} USD`;


                ilsPrice.insertAdjacentElement(
                    "afterend",
                    usdEstimate
                );
            }
        );


    } catch (error) {

        // אם ה-API לא עובד,
        // האתר עדיין מציג את המחיר בשקלים.
        console.warn(
            "Unable to load USD estimates; showing ILS prices only.",
            error
        );
    }
}



// ======================================================
// API 2 - ADDRESS AUTOCOMPLETE API
// השלמת כתובת אוטומטית בדף התשלום
// ======================================================
//
// API חיצוני שני בפרויקט.
//
// המשתמש מתחיל להקליד כתובת,
// והמערכת פונה ל-Photon API
// ומציגה הצעות לכתובות בישראל.
//
// ======================================================

function initializeAddressAutocomplete() {

    const addressInput =
        document.getElementById(
            "delivery-address"
        );


    const suggestionsList =
        document.getElementById(
            "delivery-address-suggestions"
        );


    const status =
        document.getElementById(
            "delivery-address-status"
        );


    // אם אנחנו לא בדף התשלום
    // אין צורך להמשיך.
    if (
        !addressInput ||
        !suggestionsList ||
        !status
    ) {

        return;
    }


    // ==================================================
    // VARIABLES
    // משתנים שמשמשים את מנגנון החיפוש
    // ==================================================

    let debounceTimer;

    let activeRequest;

    let requestVersion = 0;

    let activeOptionIndex = -1;


    // CACHE
    // שמירת חיפושים קודמים כדי לא לבצע
    // שוב אותה בקשה ל-API.
    const resultCache =
        new Map();


    // ==================================================
    // CLOSE SUGGESTIONS
    // סגירת רשימת ההצעות
    // ==================================================

    const closeSuggestions = () => {

        suggestionsList.hidden =
            true;


        addressInput.setAttribute(
            "aria-expanded",
            "false"
        );


        addressInput.removeAttribute(
            "aria-activedescendant"
        );


        activeOptionIndex = -1;
    };


    // ==================================================
    // ACTIVE OPTION
    // סימון הצעה פעילה
    // ==================================================

    const setActiveOption =
        index => {

            const options =
                suggestionsList.querySelectorAll(
                    '[role="option"]'
                );


            if (!options.length) {
                return;
            }


            activeOptionIndex =
                (
                    index +
                    options.length
                ) % options.length;


            options.forEach(
                (
                    option,
                    optionIndex
                ) => {

                    const isActive =
                        optionIndex ===
                        activeOptionIndex;


                    option.setAttribute(
                        "aria-selected",
                        String(isActive)
                    );


                    if (isActive) {

                        addressInput.setAttribute(
                            "aria-activedescendant",
                            option.id
                        );


                        option.scrollIntoView({
                            block: "nearest"
                        });
                    }
                }
            );
        };


    // ==================================================
    // SELECT ADDRESS
    // בחירת כתובת מתוך רשימת ההצעות
    // ==================================================

    const selectAddress =
        address => {

            addressInput.value =
                address;


            closeSuggestions();


            status.textContent =
                "";


            addressInput.focus();
        };


    // ==================================================
    // FORMAT ADDRESS
    // יצירת טקסט כתובת מהמידע שמגיע מה-API
    // ==================================================

    const formatAddress =
        properties => {

            const textValue =
                value =>
                    typeof value ===
                    "string"
                        ? value.trim()
                        : "";


            const street =
                textValue(
                    properties.street
                );


            const houseNumber =
                textValue(
                    properties.housenumber
                );


            const streetAddress =
                [
                    street,
                    houseNumber
                ]
                    .filter(Boolean)
                    .join(" ");


            const city =
                textValue(
                    properties.city ||
                    properties.town ||
                    properties.village ||
                    properties.locality
                );


            const country =
                textValue(
                    properties.country
                );


            if (
                !streetAddress &&
                !city
            ) {

                return "";
            }


            return [
                streetAddress,
                city,
                country
            ]
                .filter(Boolean)
                .join(", ");
        };


    // ==================================================
    // SHOW SUGGESTIONS
    // הצגת הצעות הכתובת
    // ==================================================

    const showSuggestions =
        features => {

            suggestionsList
                .replaceChildren();


            const suggestions =
                features

                    .map(
                        feature =>
                            formatAddress(
                                feature.properties ||
                                {}
                            )
                    )

                    .filter(Boolean)

                    .slice(0, 5);


            if (!suggestions.length) {

                closeSuggestions();


                status.textContent =
                    "No matching addresses. You can enter it manually.";


                return;
            }


            suggestions.forEach(
                (address, index) => {

                    const option =
                        document.createElement(
                            "li"
                        );


                    const button =
                        document.createElement(
                            "button"
                        );


                    option.setAttribute(
                        "role",
                        "option"
                    );


                    option.id =
                        `delivery-address-option-${index}`;


                    option.setAttribute(
                        "aria-selected",
                        "false"
                    );


                    button.type =
                        "button";


                    button.textContent =
                        address;


                    button.addEventListener(
                        "click",
                        () =>
                            selectAddress(
                                address
                            )
                    );


                    option.appendChild(
                        button
                    );


                    suggestionsList
                        .appendChild(
                            option
                        );
                }
            );


            suggestionsList.hidden =
                false;


            addressInput.setAttribute(
                "aria-expanded",
                "true"
            );


            addressInput.removeAttribute(
                "aria-activedescendant"
            );


            status.textContent =
                "";


            activeOptionIndex = -1;
        };


    // ==================================================
    // ADDRESS INPUT
    // המשתמש מקליד כתובת
    // ==================================================

    addressInput.addEventListener(
        "input",

        () => {

            window.clearTimeout(
                debounceTimer
            );


            requestVersion++;


            const currentVersion =
                requestVersion;


            const query =
                addressInput.value.trim();


            // אם הייתה בקשת API קודמת שעדיין רצה,
            // מבטלים אותה.
            activeRequest?.abort();


            activeRequest = null;


            suggestionsList
                .replaceChildren();


            closeSuggestions();


            // מתחילים חיפוש רק מ-3 תווים
            if (query.length < 3) {

                status.textContent = "";

                return;
            }


            const cacheKey =
                query.toLocaleLowerCase();


            // ==================================================
            // CACHE
            // אם כבר חיפשנו את הכתובת,
            // משתמשים בתוצאה ששמרנו.
            // ==================================================

            if (
                resultCache.has(
                    cacheKey
                )
            ) {

                status.textContent = "";


                showSuggestions(
                    resultCache.get(
                        cacheKey
                    )
                );


                return;
            }


            status.textContent =
                "Searching addresses…";


            // ==================================================
            // DEBOUNCE
            // מחכים מעט לפני שליחת הבקשה ל-API
            // ==================================================

            debounceTimer =
                window.setTimeout(

                    async () => {

                        const controller =
                            new AbortController();


                        activeRequest =
                            controller;


                        const parameters =
                            new URLSearchParams({

                                q: query,

                                limit: "5",

                                countrycode: "IL",

                                lang: "en"

                            });


                        try {

                            // ==================================================
                            // API REQUEST
                            // פנייה ל-Photon API
                            // ==================================================

                            const response =
                                await fetch(
                                    `https://photon.komoot.io/api/?${parameters}`,
                                    {
                                        signal:
                                            controller.signal
                                    }
                                );


                            if (!response.ok) {

                                throw new Error(
                                    `Photon returned status ${response.status}`
                                );
                            }


                            const data =
                                await response.json();


                            // אם המשתמש כבר שינה את החיפוש
                            // בזמן שהבקשה הייתה בדרך,
                            // מתעלמים מהתוצאה הישנה.
                            if (
                                currentVersion !==
                                    requestVersion ||

                                query !==
                                    addressInput.value.trim()
                            ) {

                                return;
                            }


                            const features =
                                Array.isArray(
                                    data.features
                                )
                                    ? data.features
                                    : [];


                            // שמירת התוצאה ב-Cache
                            resultCache.set(
                                cacheKey,
                                features
                            );


                            // שמירת עד 20 חיפושים בזיכרון
                            if (
                                resultCache.size >
                                20
                            ) {

                                resultCache.delete(
                                    resultCache
                                        .keys()
                                        .next()
                                        .value
                                );
                            }


                            showSuggestions(
                                features
                            );


                        } catch (error) {

                            if (
                                error.name !==
                                    "AbortError" &&

                                currentVersion ===
                                    requestVersion
                            ) {

                                closeSuggestions();


                                status.textContent =
                                    "Address suggestions are unavailable. You can enter it manually.";


                                console.warn(
                                    "Address suggestions could not be loaded.",
                                    error
                                );
                            }


                        } finally {

                            if (
                                currentVersion ===
                                requestVersion
                            ) {

                                activeRequest =
                                    null;
                            }
                        }

                    },

                    350
                );
        }
    );


    // ==================================================
    // KEYBOARD NAVIGATION
    // ניווט עם המקלדת בין הצעות הכתובת
    // ==================================================

    addressInput.addEventListener(
        "keydown",

        event => {

            const options =
                suggestionsList
                    .querySelectorAll(
                        '[role="option"]'
                    );


            // ARROW DOWN
            if (
                event.key ===
                    "ArrowDown" &&

                options.length
            ) {

                event.preventDefault();


                setActiveOption(
                    activeOptionIndex +
                    1
                );


            // ARROW UP
            } else if (
                event.key ===
                    "ArrowUp" &&

                options.length
            ) {

                event.preventDefault();


                setActiveOption(
                    activeOptionIndex < 0
                        ? options.length - 1
                        : activeOptionIndex - 1
                );


            // ENTER
            } else if (
                event.key ===
                    "Enter" &&

                activeOptionIndex >= 0 &&

                options[
                    activeOptionIndex
                ]
            ) {

                event.preventDefault();


                options[
                    activeOptionIndex
                ]
                    .querySelector(
                        "button"
                    )
                    .click();


            // ESCAPE
            } else if (
                event.key ===
                    "Escape"
            ) {

                closeSuggestions();
            }
        }
    );


    // ==================================================
    // BLUR
    // סגירת ההצעות כאשר יוצאים משדה הכתובת
    // ==================================================

    addressInput.addEventListener(
        "blur",

        () => {

            window.setTimeout(
                closeSuggestions,
                120
            );
        }
    );
}


// ======================================================
// START ADDRESS AUTOCOMPLETE
// הפעלת השלמת הכתובת לאחר טעינת הדף
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    initializeAddressAutocomplete
);
document.addEventListener("DOMContentLoaded", function () {
    const category = document.body.dataset.category;

    if (category) {
        loadProductsFromMongo(category);
    }
});