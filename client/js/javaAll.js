// ==================== INVENTORY ====================

// טעינת המלאי מ-LocalStorage.
// אם עדיין אין מלאי שמור, כל מוצר מתחיל בכמות 10.
const inventory = JSON.parse(localStorage.getItem("inventory")) || {
    1: 10, 2: 10, 3: 10, 4: 10, 5: 10, 6: 10, 7: 10, 8: 10, 9: 10, 10: 10,
    11: 10, 12: 10, 13: 10, 14: 10, 15: 10, 16: 10, 17: 10, 18: 10, 19: 10, 20: 10,
    21: 10, 22: 10, 23: 10, 24: 10, 25: 10, 26: 10, 27: 10, 28: 10, 29: 10, 30: 10,
    31: 10, 32: 10, 33: 10, 34: 10, 35: 10, 36: 10, 37: 10, 38: 10, 39: 10, 40: 10,
    41: 10, 42: 10, 43: 10, 44: 10, 45: 10, 46: 10, 47: 10, 48: 10, 49: 10, 50: 10,
    51: 10
};


// שמירת המלאי ב-LocalStorage
function saveInventory() {
    localStorage.setItem("inventory", JSON.stringify(inventory));
}



// ==================== SHOPPING CART ====================

// מערך שמכיל את המוצרים שנמצאים בעגלה
let cart = [];


// שמירת העגלה ב-LocalStorage
function saveCart() {

    localStorage.setItem("cart", JSON.stringify(cart));

    // חישוב המחיר הכולל של העגלה
    const totalAmount = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    // שמירת המחיר הכולל
    localStorage.setItem("cartTotal", totalAmount);
}


// טעינת העגלה ששמרנו ב-LocalStorage
function loadCart() {

    const savedCart = localStorage.getItem("cart");

    if (savedCart) {

        // הפיכת המידע בחזרה למערך JavaScript
        cart = JSON.parse(savedCart);

        // עדכון תצוגת העגלה
        updateCart();
    }
}



// ==================== INVENTORY DISPLAY ====================

// הצגת המלאי של כל מוצר באתר
function updateInventoryDisplay() {

    // מעבר על כל המוצרים במלאי
    for (const productId in inventory) {

        // חיפוש המקום המתאים למוצר ב-HTML
        const inventoryElement =
            document.getElementById(`inventory_${productId}`);

        if (inventoryElement) {

            // הצגת הכמות שנשארה
            inventoryElement.textContent =
                `inventory: ${inventory[productId]}`;

        } else {

            console.warn(
                `Missing element for inventory ID: inventory_${productId}`
            );
        }
    }

    // שמירת המלאי המעודכן
    saveInventory();
}



// ==================== ADD TO CART ====================

// הוספת מוצר לעגלה
function addToCart(carId, carName, carPrice, carImage) {

    // בודקים שיש עדיין מוצר במלאי
    if (inventory[carId] > 0) {

        // בודקים האם המוצר כבר נמצא בעגלה
        let existingCar =
            cart.find(item => item.id === carId);

        if (existingCar) {

            // אם הוא כבר קיים - מגדילים את הכמות
            existingCar.quantity++;

        } else {

            // אם הוא לא קיים - מוסיפים אותו לעגלה
            cart.push({
                id: carId,
                name: carName,
                price: carPrice,
                quantity: 1,
                image: carImage
            });
        }

        // הפחתת מוצר אחד מהמלאי
        inventory[carId]--;

        // עדכון תצוגת המלאי
        updateInventoryDisplay();

        // שמירת העגלה
        saveCart();

        // עדכון תצוגת העגלה
        updateCart();

    } else {

        alert("The product is out of stock!");
    }
}



// ==================== REMOVE FROM CART ====================

// הסרת מוצר מהעגלה
function removeFromCart(carId) {

    // מציאת המוצר בעגלה
    const index =
        cart.findIndex(item => item.id === carId);

    if (index !== -1) {

        // החזרת הכמות למלאי
        inventory[carId] += cart[index].quantity;

        // הסרת המוצר מהעגלה
        cart.splice(index, 1);

        updateInventoryDisplay();
        saveCart();
        updateCart();
    }
}



// ==================== UPDATE CART ====================

// עדכון תצוגת סל הקניות
function updateCart() {

    // עדכון מספר המוצרים שמופיע ליד הסל
    const cartCount =
        document.getElementById("cart-count");

    if (cartCount) {

        cartCount.textContent =
            cart.reduce(
                (total, item) => total + item.quantity,
                0
            );
    }


    // הטבלה של המוצרים בעגלה
    const cartItems =
        document.getElementById("cartItems");

    // המקום שבו מוצג המחיר הכולל
    const totalPriceElement =
        document.getElementById("totalPrice");


    if (cartItems && totalPriceElement) {

        // ניקוי הטבלה לפני הצגה מחדש
        cartItems.innerHTML = "";

        let totalPrice = 0;


        // מעבר על כל המוצרים בעגלה
        cart.forEach(item => {

            // חישוב המחיר הכולל
            totalPrice +=
                item.price * item.quantity;


            // יצירת שורה חדשה בטבלה
            const row =
                document.createElement("tr");


            // הכנסת פרטי המוצר לשורה
            row.innerHTML = `

                <td>
                    <img src="${item.image}"
                         alt="${item.name}"
                         width="50">
                </td>

                <td>${item.name}</td>

                <td>${item.price} ₪</td>

                <td>
                    <button onclick="decreaseQuantity(${item.id})">-</button>

                    <span>${item.quantity}</span>

                    <button onclick="increaseQuantity(${item.id})">+</button>
                </td>

                <td>
                    ${item.price * item.quantity} ₪
                </td>

                <td>
                    <button onclick="removeFromCart(${item.id})">
                        remove
                    </button>
                </td>
            `;


            // הכנסת השורה לטבלה
            cartItems.appendChild(row);
        });


        // הצגת המחיר הכולל
        totalPriceElement.textContent =
            `${totalPrice} ₪`;
    }
}



// ==================== CHANGE QUANTITY ====================

// הגדלת כמות של מוצר בעגלה
function increaseQuantity(carId) {

    if (inventory[carId] > 0) {

        addToCart(carId);

    } else {

        alert("The product is out of stock!");
    }
}


// הקטנת כמות של מוצר בעגלה
function decreaseQuantity(carId) {

    // חיפוש המוצר בעגלה
    const item =
        cart.find(i => i.id === carId);

    if (item) {

        // הקטנת הכמות בעגלה
        item.quantity--;

        // החזרת יחידה למלאי
        inventory[carId]++;


        // אם הכמות הגיעה ל-0 מסירים את המוצר
        if (item.quantity <= 0) {

            cart =
                cart.filter(i => i.id !== carId);
        }


        updateInventoryDisplay();
        saveCart();
        updateCart();
    }
}



// ==================== PAGE LOAD ====================

// כאשר הדף נטען:
// טוענים את העגלה ומציגים את המלאי
document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadCart();
        updateInventoryDisplay();

    }
);



// ==================== PRICE FILTER ====================

// סינון מוצרים לפי מחיר מינימום ומקסימום
function filterCars() {

    // קבלת מחיר המינימום
    const priceMin =
        parseFloat(
            document.getElementById("price-min").value
        ) || 0;


    // קבלת מחיר המקסימום
    const priceMax =
        parseFloat(
            document.getElementById("price-max").value
        ) || Infinity;


    // קבלת כל המוצרים שמוצגים בדף
    const carItems =
        document.querySelectorAll(".car-item");


    // מעבר על כל מוצר
    carItems.forEach(carItem => {

        // קבלת המחיר מתוך ה-HTML
        const priceText =
            carItem.querySelector(
                "p:nth-of-type(2)"
            ).textContent;


        // השארת המספר בלבד
        const price =
            parseFloat(
                priceText.replace(/[^0-9]/g, '')
            );


        // בדיקה האם המחיר נמצא בטווח
        const matchesPrice =
            price >= priceMin &&
            price <= priceMax;


        // הצגה או הסתרה של המוצר
        if (matchesPrice) {

            carItem.style.display = "block";

        } else {

            carItem.style.display = "none";
        }
    });
}



// ==================== PAYMENT ====================

// בדיקת פרטי התשלום
function validatePayment() {

    // קבלת מספר הכרטיס והסרת רווחים
    const cardNumber =
        document.getElementById("card-number")
            .value.replace(/\s/g, '');


    // קבלת CVV
    const cvv =
        document.getElementById("cvv").value;


    // קבלת תאריך התוקף
    const expiryDate =
        document.getElementById("expiry-date").value;


    const currentDate = new Date();

    const selectedDate =
        new Date(expiryDate + "-01");


    // קבלת שם בעל הכרטיס
    const cardHolder =
        document.getElementById("card-holder")
            .value.trim();


    // בדיקת מספר הכרטיס
    if (cardNumber.length !== 16) {

        alert(
            'The card number must be 16 digits long.'
        );

    }

    // בדיקת CVV
    else if (cvv.length !== 3) {

        alert(
            'CVV must be 3 digits long.'
        );

    }

    // בדיקת תוקף הכרטיס
    else if (selectedDate < currentDate) {

        alert(
            'This card has already expired. Enter a future effective date.'
        );

    }

    // בדיקת שם בעל הכרטיס
    else if (cardHolder === "") {

        alert(
            'Please enter the cardholder name.'
        );

    }

    // אם כל הפרטים תקינים
    else {

        alert(
            'The payment was successful! An email will be sent with order details and arrival times for collection.'
        );


        // הפעלת צליל לאחר תשלום
        const audio =
            new Audio('audio/payment.mp3');

        audio.play();


        // ריקון העגלה
        cart = [];

        saveCart();


        // איפוס המלאי
        resetInventory();


        // חזרה לדף הבית
        window.location.href = './home.html';
    }
}



// איפוס כל המוצרים לכמות 10
function resetInventory() {

    for (const productId in inventory) {

        inventory[productId] = 10;
    }

    // שמירת המלאי
    saveInventory();

    // עדכון המלאי באתר
    updateInventoryDisplay();
}



// ==================== CONTACT FORM ====================

// בדיקת הודעה בטופס יצירת קשר
function messageC() {

    const messageC =
        document.getElementById("message")
            .value.trim();


    // אם לא נכתבה הודעה
    if (messageC === "") {

        alert('Please write a meesage');

    } else {

        // אישור קבלת ההודעה
        alert(
            'Your request has been received. We will get back to you as soon as possible'
        );
    }
}



// ==================== PAGE CSS ====================

// הוספת class לעמוד Login לפי התוכן שלו
document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (
            document.querySelector("p")
                ?.textContent.includes("Login Page")
        ) {

            document.body.classList.add(
                "login-page"
            );
        }
    }
);


// הוספת class נוסף לעמוד Login
document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (
            document.querySelector("h1")
                ?.textContent.includes("User Name")
        ) {

            document.body.classList.add(
                "login-page"
            );
        }
    }
);


// הוספת class לעמוד סל הקניות
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



// ==================== USERNAME ====================

// שמירת שם המשתמש
function saveUsername() {

    const username =
        document.getElementById('username').value;


    if (username) {

        // שמירת שם המשתמש
        localStorage.setItem(
            'username',
            username
        );


        // מעבר לדף הבית
        window.location.href =
            'home.html';
    }
}


// הצגת שם המשתמש כאשר הדף נטען
document.addEventListener(
    'DOMContentLoaded',
    function () {

        // אם אין משתמש - מציגים Guest
        const username =
            localStorage.getItem('username')
            || 'Guest';


        const welcomeUserElement =
            document.getElementById(
                'welcome-user'
            );


        if (welcomeUserElement) {

            welcomeUserElement.textContent =
                `Hello, ${username}`;
        }
    }
);



// ==================== CART TOTAL ====================

// טעינת המחיר הכולל מה-LocalStorage
function loadTotal() {

    const totalAmount =
        localStorage.getItem("cartTotal");


    if (totalAmount) {

        document.getElementById(
            "totalDisplay"
        ).textContent =
            `Total:${totalAmount} ILS`;

    } else {

        document.getElementById(
            "totalDisplay"
        ).textContent =
            "Your cart is empty.";
    }
}


// הפעלת הפונקציה כאשר הדף נטען
document.addEventListener(
    "DOMContentLoaded",
    loadTotal
);



// ==================== LOGOUT ====================

// התנתקות המשתמש
function logout() {

    // מחיקת שם המשתמש
    localStorage.removeItem('username');


    // הגדרת המשתמש כאורח
    localStorage.setItem(
        'username',
        'Guest'
    );


    // עדכון שם המשתמש שמוצג באתר
    const welcomeUserElement =
        document.getElementById(
            'welcome-user'
        );


    if (welcomeUserElement) {

        welcomeUserElement.textContent =
            "Hello, Guest";
    }
}



// ==================== MONGODB PRODUCTS ====================

// טעינת מוצרים מ-MongoDB לפי קטגוריה
async function loadProductsFromMongo(category) {

    try {

        // שליחת בקשה לשרת עם שם הקטגוריה
        const response = await fetch(

            "http://localhost:3000/products?category=" +
            encodeURIComponent(category)

        );


        // המרת תשובת השרת למערך JavaScript
        const products =
            await response.json();


        // המקום ב-HTML שבו יוצגו המוצרים
        const productList =
            document.getElementById("car-list");


        // ניקוי מוצרים קודמים מהמסך
        productList.innerHTML = "";


        // מעבר על כל המוצרים שהתקבלו מ-MongoDB
        products.forEach(product => {


            // יצירת כרטיס מוצר והכנסתו לדף
            productList.innerHTML += `

                <div class="car-item">

                    <img src="${product.image}">

                    <h3>${product.name}</h3>

                    <p>${product.description}</p>

                    <p>price: ${product.price} ₪</p>

                    <span id="inventory_${product.productId}"></span>

                    <br>

                    <button onclick="addToCart(
                        ${product.productId},
                        '${product.name}',
                        ${product.price},
                        '${product.image}'
                    )">

                        add to cart

                    </button>

                </div>
            `;
        });


    } catch (error) {

        // במקרה שהטעינה נכשלה
        console.log(
            "Error loading products:",
            error
        );
    }
}