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

function isGuestUser() {
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    return !username ||
        username === "Guest" ||
        (role !== "customer" && role !== "admin");
}


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

    if (isGuestUser()) {
        alert("Please log in or register before shopping.");
        return;
    }

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

    if (isGuestUser()) {
        alert("Please log in or register before shopping.");
        return;
    }

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
        const cartContent = document.getElementById("cart-content");
        const emptyCart = document.getElementById("cart-empty");
        const summaryTotal = document.getElementById("cart-summary-total");

        if (cartContent) {
            cartContent.hidden = cart.length === 0;
        }

        if (emptyCart) {
            emptyCart.hidden = cart.length !== 0;
        }

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
                    <div class="cart-product">
                        <img src="${item.image}"
                             alt="${item.name}"
                             width="50">
                        <span>${item.name}</span>
                    </div>
                </td>

                <td>${item.price} ₪</td>

                <td>
                    <button class="cart-quantity-button" type="button" aria-label="Decrease ${item.name} quantity" onclick="decreaseQuantity(${item.id})">−</button>

                    <span>${item.quantity}</span>

                    <button class="cart-quantity-button" type="button" aria-label="Increase ${item.name} quantity" onclick="increaseQuantity(${item.id})">+</button>
                </td>

                <td>
                    ${item.price * item.quantity} ₪
                </td>

                <td>
                    <button class="cart-remove-button" type="button" aria-label="Remove ${item.name} from cart" onclick="removeFromCart(${item.id})">
                        Remove
                    </button>
                </td>
            `;


            // הכנסת השורה לטבלה
            cartItems.appendChild(row);
        });


        // הצגת המחיר הכולל
        totalPriceElement.textContent =
            `${totalPrice} ₪`;

        if (summaryTotal) {
            summaryTotal.textContent = `${totalPrice} ₪`;
        }
    }
}



// ==================== CHANGE QUANTITY ====================

// הגדלת כמות של מוצר בעגלה
function increaseQuantity(carId) {

    if (isGuestUser()) {
        alert("Please log in or register before shopping.");
        return;
    }

    if (inventory[carId] > 0) {

        addToCart(carId);

    } else {

        alert("The product is out of stock!");
    }
}


// הקטנת כמות של מוצר בעגלה
function decreaseQuantity(carId) {

    if (isGuestUser()) {
        alert("Please log in or register before shopping.");
        return;
    }

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

    if (isGuestUser()) {
        alert("Please log in or register to complete checkout.");
        window.location.href = "login.html";
        return;
    }

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
    const totalDisplay =
        document.getElementById("totalDisplay");

    const checkoutItems =
        document.getElementById("checkoutItems");

    if (!checkoutItems && !totalDisplay) {
        return;
    }

    if (isGuestUser()) {
        alert("Please log in or register to continue to checkout.");
        window.location.href = "login.html";
        return;
    }

    if (checkoutItems) {
        const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
        checkoutItems.innerHTML = "";

        if (savedCart.length === 0) {
            const emptyMessage = document.createElement("p");
            emptyMessage.className = "checkout-empty";
            emptyMessage.textContent = "Your cart is currently empty.";
            checkoutItems.appendChild(emptyMessage);
        } else {
            savedCart.forEach(item => {
                const row = document.createElement("div");
                row.className = "checkout-item";

                const image = document.createElement("img");
                image.src = item.image;
                image.alt = "";

                const details = document.createElement("div");
                details.className = "checkout-item-details";

                const name = document.createElement("span");
                name.textContent = item.name;

                const quantity = document.createElement("small");
                quantity.textContent = `Qty ${item.quantity}`;

                const price = document.createElement("strong");
                price.textContent = `${item.price * item.quantity} ₪`;

                details.append(name, quantity);
                row.append(image, details, price);
                checkoutItems.appendChild(row);
            });
        }
    }


    if (totalDisplay && totalAmount) {
        totalDisplay.textContent =
            `Total:${totalAmount} ILS`;

    } else if (totalDisplay) {
        totalDisplay.textContent =
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
    localStorage.removeItem('role');


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



// ==================== LOCAL PRODUCT CATALOG ====================

const localProducts = {
    "Technological fashion": [
        {
            productId: 1,
            name: "Baseball cap",
            price: 120,
            description: "The baseball cap with a pattern of electric circuits",
            image: "images/Technological fashion/baseballcap.jpg"
        },
        {
            productId: 2,
            name: "Technological bomber jacket",
            price: 360,
            description: "A technological bomber jacket with a design of glowing electric circuits on the sleeves",
            image: "images/Technological fashion/Bomberjacket.jpg"
        },
        {
            productId: 3,
            name: "Hoodie",
            price: 450,
            description: "Hoodie with the inscription \"404: Sleep Not Found\"",
            image: "images/Technological fashion/hoodie.jpg"
        },
        {
            productId: 4,
            name: "Jacket",
            price: 370,
            description: "Jacket with the inscription \"Always in Beta\"",
            image: "images/Technological fashion/jacket.jpg"
        },
        {
            productId: 5,
            name: "Long t-shirt",
            price: 230,
            description: "Long t-shirt with the inscription \"I Code\", in a modern design with subtle technological patterns on the sleeves and a pleasant color combination.",
            image: "images/Technological fashion/longt-shirt.jpg"
        },
        {
            productId: 6,
            name: "Polo shirt",
            price: 360,
            description: "Polo shirt with a logo of a small computer chip embroidered on the chest, in vivid and modern colors.",
            image: "images/Technological fashion/polo.jpg"
        },
        {
            productId: 7,
            name: "Winter scarf",
            price: 420,
            description: "A winter scarf, with prints of code and electric circuits in warm colors like dark blue and burgundy, and in a thick and cozy design suitable for cold weather",
            image: "images/Technological fashion/scarf.jpg"
        },
        {
            productId: 8,
            name: "Socks",
            price: 90,
            description: "Colorful socks with designs of keyboards and technological components.",
            image: "images/Technological fashion/Socks.jpg"
        },
        {
            productId: 9,
            name: "Sweatpants",
            price: 160,
            description: "The sweatpants with binary code decoration on the sides.",
            image: "images/Technological fashion/Sweatpants.jpg"
        },
        {
            productId: 10,
            name: "T-shirt",
            price: 230,
            description: "T-shirt with the inscription \"Eat, Sleep, Code, Repeat\"",
            image: "images/Technological fashion/T-shirt.jpg"
        },
        {
            productId: 11,
            name: "Black t-shirt",
            price: 250,
            description: "Black t-shirt with the inscription \"I Write Code, Not Excuses\" and a design that includes a keyboard and small pieces of code",
            image: "images/Technological fashion/Tsh3.jpg"
        }
    ],
    "Equipment and accessories": [
        {
            productId: 12,
            name: "Backpack",
            price: 150,
            description: "A fashionable backpack with a minimalistic design of a printed electrical circuit and the inscription \"Code and Carry\".",
            image: "images/Equipment and accessories/backbag.jpg"
        },
        {
            productId: 13,
            name: "Backpack2",
            price: 200,
            description: "A backpack in a technological design with the inscription \"Debug & Deploy\" and a combination of electrical circuit samples.",
            image: "images/Equipment and accessories/backpacktechnologicaldesign.jpg"
        },
        {
            productId: 14,
            name: "Key holder",
            price: 70,
            description: "The key holder has a motherboard design, with intricate details of printed circuits and metallic looking components",
            image: "images/Equipment and accessories/keyholder.jpg"
        },
        {
            productId: 15,
            name: "Laptop cover",
            price: 170,
            description: "Laptop cover with a spectacular design of electric circuits in shades of neon blue, green and black for a futuristic look",
            image: "images/Equipment and accessories/Laptopcover.jpg"
        },
        {
            productId: 16,
            name: "Charger cover",
            price: 130,
            description: "Computer chip design charger cover, with details of electric circuits and metallic accents.",
            image: "images/Equipment and accessories/luggagecover.jpg"
        },
        {
            productId: 17,
            name: "Ergonomic mouse",
            price: 100,
            description: "Ergonomic mouse with a colorful code pattern that combines shades of neon blue, green and orange",
            image: "images/Equipment and accessories/mouse.jpg"
        },
        {
            productId: 18,
            name: "Notebook",
            price: 60,
            description: "A notebook in the design of an old computer with a retro look and a motivational inscription on the cover.",
            image: "images/Equipment and accessories/notebook.jpg"
        },
        {
            productId: 19,
            name: "Phone stand",
            price: 120,
            description: "Phone stand in the form of a hardware component, with polished metallic elements and subtle reliefs of electrical circuits.",
            image: "images/Equipment and accessories/Phonestand.jpg"
        },
        {
            productId: 20,
            name: "Side bag",
            price: 240,
            description: "The side bag with the inscription \"Code & Go\" in a minimalist and modern design.",
            image: "images/Equipment and accessories/sidebag.jpg"
        },
        {
            productId: 21,
            name: "Smart water bottle",
            price: 260,
            description: "A smart water bottle with a digital time display and a modern design, including touches of bright blue and silver.",
            image: "images/Equipment and accessories/Smartwaterbottle.jpg"
        },
        {
            productId: 22,
            name: "Futuristic table organizer",
            price: 290,
            description: "Futuristic table organizer in the design of a mini-server, with compartments for pens, notes and gadgets.",
            image: "images/Equipment and accessories/tableorganizer.jpg"
        }
    ],
    "Design items for the home office": [
        {
            productId: 23,
            name: "Coasters for cups",
            price: 140,
            description: "Coasters for cups in a chip design, with patterns of electric circuits and metallic finishes.",
            image: "images/Design items for the home office/Coasterscups.jpg"
        },
        {
            productId: 24,
            name: "Desktop organizer",
            price: 250,
            description: "A desktop organizer with a pattern of electric circuits, which includes different compartments for stationery items.",
            image: "images/Design items for the home office/Deskorganizer2.jpg"
        },
        {
            productId: 25,
            name: "Digital wall clock",
            price: 330,
            description: "A digital wall clock in a technological design, with luminous numbers and delicate electrical circuit patterns",
            image: "images/Design items for the home office/Digitalwallclock.jpg"
        },
        {
            productId: 26,
            name: "Mouse pad",
            price: 90,
            description: "A mouse pad with running code graphics, on a dark background and a modern look.",
            image: "images/Design items for the home office/Mousepad.jpg"
        },
        {
            productId: 27,
            name: "Bulletin board",
            price: 360,
            description: "Binary code design bulletin board, with metallic touches and vivid colors",
            image: "images/Design items for the home office/noticeboard.jpg"
        },
        {
            productId: 28,
            name: "Pen stand",
            price: 150,
            description: "Pen stand in the shape of a computer processor, with precise details of circuits and a modern design",
            image: "images/Design items for the home office/penstand.jpg"
        },
        {
            productId: 29,
            name: "Decorative pillow",
            price: 240,
            description: "Decorative pillow with the inscription \"Think Like a Coder\", in a technological design with circle patterns in the background",
            image: "images/Design items for the home office/pillow.jpg"
        },
        {
            productId: 30,
            name: "Poster",
            price: 80,
            description: "A poster with the inscription \"Keep Calm and Debug On\", in a technological design with examples of electric circuits",
            image: "images/Design items for the home office/poster.jpg"
        },
        {
            productId: 31,
            name: "Set of bookends",
            price: 320,
            description: "A set of futuristic circuit board design bookends, with intricate details and metallic finishes",
            image: "images/Design items for the home office/setofbookends.jpg"
        },
        {
            productId: 32,
            name: "Desk lamp",
            price: 420,
            description: "A desk lamp in a motherboard design, with examples of electrical circuits and glowing LED lighting",
            image: "images/Design items for the home office/tablelamp.jpg"
        }
    ],
    "Advanced gadgets": [
        {
            productId: 33,
            name: "Bluetooth adapter",
            price: 350,
            description: "A small Bluetooth adapter with a modern design intended for old devices such as televisions, with LED lighting and a metallic finish",
            image: "images/Advanced gadgets/Bluetooth.jpg"
        },
        {
            productId: 34,
            name: "Ergonomic mouse2",
            price: 370,
            description: "Ergonomic mouse with buttons adapted to games, in a futuristic design with glowing LED lighting",
            image: "images/Advanced gadgets/Ergonomicmouse.jpg"
        },
        {
            productId: 35,
            name: "Smart LED lamp",
            price: 440,
            description: "A smart LED lamp in the design of electric circuits, with adjustable lighting in different colors and control via touch or an app",
            image: "images/Advanced gadgets/LED.jpg"
        },
        {
            productId: 36,
            name: "Mechanical keyboard",
            price: 560,
            description: "A small mechanical keyboard with a unique design inspired by binary code, with custom RGB lighting and a futuristic look.",
            image: "images/Advanced gadgets/Mechanicalkeyboard.jpg"
        },
        {
            productId: 37,
            name: "Smart pen",
            price: 370,
            description: "A smart pen with advanced functions such as automatic translation and erasing digital handwriting, in a modern design with bright LEDs",
            image: "images/Advanced gadgets/smartpen.jpg"
        },
        {
            productId: 38,
            name: "Smart speaker",
            price: 530,
            description: "A small smart speaker in the design of a computer chip, with examples of electric circuits and glowing LED lighting",
            image: "images/Advanced gadgets/Smartspeaker.jpg"
        },
        {
            productId: 39,
            name: "Smart watch",
            price: 670,
            description: "A smart watch with a customized interface for programming and task management, in a modern and technological design.",
            image: "images/Advanced gadgets/smartwatch.jpg"
        },
        {
            productId: 40,
            name: "Wireless charger",
            price: 490,
            description: "The wireless charger with RGB lighting in the design of electric circuits",
            image: "images/Advanced gadgets/thewirelesscharger.jpg"
        },
        {
            productId: 41,
            name: "Webcam",
            price: 620,
            description: "The webcam with a custom frame that can be printed in 3D, in a compact and modern design.",
            image: "images/Advanced gadgets/webcam.jpg"
        },
        {
            productId: 42,
            name: "Wireless headphones",
            price: 350,
            description: "Wireless headphones in a technological design with glowing LED lighting and a futuristic look",
            image: "images/Advanced gadgets/Wirelessheadphones.jpg"
        }
    ],
    "Gifts and personal products": [
        {
            productId: 43,
            name: "Calendar",
            price: 190,
            description: "A modern calendar that includes special dates for the tech community, like Pai Day, with tech-inspired graphic designs.",
            image: "images/Gifts and personal products/calendar.jpg"
        },
        {
            productId: 44,
            name: "Gift box",
            price: 690,
            description: "A gift box with the inscription \"For the Best Developer\" in an elegant and modern design, which includes technological items inside",
            image: "images/Gifts and personal products/giftbox.jpg"
        },
        {
            productId: 45,
            name: "Personal key ring",
            price: 280,
            description: "A personal key ring with a QR engraving that leads to a hidden message, in a modern, technologically inspired metallic design",
            image: "images/Gifts and personal products/Personalkeychain.jpg"
        },
        {
            productId: 46,
            name: "Set pillows",
            price: 610,
            description: "A set of decorative pillows with funny tech phrases, like \"Debugging is My Cardio,\" and code-inspired patterns",
            image: "images/Gifts and personal products/Pillowset.jpg"
        },
        {
            productId: 47,
            name: "Set of phone screen protectors",
            price: 250,
            description: "A set of phone screen protectors with custom designs, such as electrical circuit patterns or binary code",
            image: "images/Gifts and personal products/Setofscreenprotectors.jpg"
        },
        {
            productId: 48,
            name: "Set of wall stickers",
            price: 50,
            description: "A set of wall stickers with technological motifs such as examples of electric circuits and binary code, in a modern and colorful design",
            image: "images/Gifts and personal products/setofwallstickers.jpg"
        },
        {
            productId: 49,
            name: "Insulated water bottle",
            price: 270,
            description: "Insulated water bottle with a digital temperature display on the lid, in a metallic and modern design",
            image: "images/Gifts and personal products/smartB.jpg"
        },
        {
            productId: 50,
            name: "Smart coffee mug",
            price: 180,
            description: "A smart coffee mug with a built-in temperature control system, in a modern design with a digital display",
            image: "images/Gifts and personal products/Smartcoffeemug.jpg"
        },
        {
            productId: 51,
            name: "Smart notebook",
            price: 780,
            description: "A smart notebook for multiple use with an erasing function, in a modern, technologically inspired design. The notebook includes a smart pen for digital storage",
            image: "images/Gifts and personal products/Smartnotebook.jpg"
        }
    ]
};

function loadProductsFromLocal(category) {
    const products = localProducts[category];

    if (!products) {
        throw new Error(`Unknown product category: ${category}`);
    }

    const productList = document.getElementById("car-list");

    productList.innerHTML = "";

    products.forEach(product => {
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
}