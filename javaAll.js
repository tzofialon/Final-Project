
// אובייקט לניהול המלאי
const inventory = JSON.parse(localStorage.getItem("inventory")) || {
    1: 10, 2: 10, 3: 10, 4: 10, 5: 10, 6: 10, 7: 10, 8: 10, 9: 10, 10: 10,
    11: 10, 12: 10, 13: 10, 14: 10, 15: 10, 16: 10, 17: 10, 18: 10, 19: 10, 20: 10,
    21: 10, 22: 10, 23: 10, 24: 10, 25: 10, 26: 10, 27: 10, 28: 10, 29: 10, 30: 10,
    31: 10, 32: 10, 33: 10, 34: 10, 35: 10, 36: 10, 37: 10, 38: 10, 39: 10, 40: 10,
    41: 10, 42: 10, 43: 10, 44: 10, 45: 10, 46: 10, 47: 10, 48: 10, 49: 10, 50: 10, 51:10
};

// שמירת המלאי ב-LocalStorage
function saveInventory() {
    localStorage.setItem("inventory", JSON.stringify(inventory));
}

// רשימת העגלה
let cart = [];

// פונקציה לשמירת העגלה ב-LocalStorage
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));

    // חישוב הסכום הכולל ושמירתו
    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    localStorage.setItem("cartTotal", totalAmount);
}

// פונקציה לטעינת העגלה מ-LocalStorage
function loadCart() {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}
function updateInventoryDisplay() {
    for (const productId in inventory) {
        const inventoryElement = document.getElementById(`inventory_${productId}`);
        if (inventoryElement) {
            inventoryElement.textContent = `inventory: ${inventory[productId]}`;
        } else {
            console.warn(`Missing element for inventory ID: inventory_${productId}`);
        }
    }
    saveInventory(); // שמירת המלאי המעודכן
}
// פונקציה להוספת מוצר לעגלה
function addToCart(carId, carName, carPrice, carImage) {
    if (inventory[carId] > 0) {
        let existingCar = cart.find(item => item.id === carId);
        if (existingCar) {
            existingCar.quantity++;
        } else {
            cart.push({
                id: carId,
                name: carName,
                price: carPrice,
                quantity: 1,
                image: carImage
            });
        }
        inventory[carId]--; // הפחתת מלאי
        updateInventoryDisplay(); // עדכון המלאי ב-HTML
        saveCart();
        updateCart();
    } else {
        alert("The product is out of stock!");
    }
}

// פונקציה להסרת מוצר מהעגלה
function removeFromCart(carId) {
    const index = cart.findIndex(item => item.id === carId);
    if (index !== -1) {
        inventory[carId] += cart[index].quantity; // החזרת מלאי
        cart.splice(index, 1);
        updateInventoryDisplay(); // עדכון המלאי ב-HTML
        saveCart();
        updateCart();
    }
}

// פונקציה לעדכון העגלה
function updateCart() {
    const cartCount = document.getElementById("cart-count");
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }

    const cartItems = document.getElementById("cartItems");
    const totalPriceElement = document.getElementById("totalPrice");

    if (cartItems && totalPriceElement) {
        cartItems.innerHTML = "";
        let totalPrice = 0;

        cart.forEach(item => {
            totalPrice += item.price * item.quantity;
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><img src="${item.image}" alt="${item.name}" width="50"></td>
                <td>${item.name}</td>
                <td>${item.price} ₪</td>
                <td>
                    <button onclick="decreaseQuantity(${item.id})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="increaseQuantity(${item.id})">+</button>
                </td>
                <td>${item.price * item.quantity} ₪</td>
                <td><button onclick="removeFromCart(${item.id})">remove</button></td>
            `;
            cartItems.appendChild(row);
        });

        totalPriceElement.textContent = `${totalPrice} ₪`;
    }
}

// פונקציות להגדלת והפחתת כמות בעגלה
function increaseQuantity(carId) {
    if (inventory[carId] > 0) {
        addToCart(carId);
    } else {
        alert("The product is out of stock!");
    }
}

function decreaseQuantity(carId) {
    const item = cart.find(i => i.id === carId);
    if (item) {
        item.quantity--;
        inventory[carId]++;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== carId);
        }
        updateInventoryDisplay();
        saveCart();
        updateCart();
    }
}

// קריאה לעדכון המלאי והעגלה כאשר העמוד נטען
document.addEventListener("DOMContentLoaded", () => {
    loadCart();
    updateInventoryDisplay();
});



function filterCars() {
    const priceMin = parseFloat(document.getElementById("price-min").value) || 0;
    const priceMax = parseFloat(document.getElementById("price-max").value) || Infinity;

    const carItems = document.querySelectorAll(".car-item");

    carItems.forEach(carItem => {
        const priceText = carItem.querySelector("p:nth-of-type(2)").textContent;
       
        const price = parseFloat(priceText.replace(/[^0-9]/g, ''));

        const matchesPrice = price >= priceMin && price <= priceMax;

        if (matchesPrice) {
            carItem.style.display = "block";
        } else {
            carItem.style.display = "none";
        }
    });
}

function validatePayment() {
    const cardNumber = document.getElementById("card-number").value.replace(/\s/g, ''); // מסירים רווחים
    const cvv = document.getElementById("cvv").value;
    const expiryDate = document.getElementById("expiry-date").value;
    const currentDate = new Date();
    const selectedDate = new Date(expiryDate + "-01"); 
    const cardHolder = document.getElementById("card-holder").value.trim();
    
    if (cardNumber.length !== 16) {
        alert('The card number must be 16 digits long.');
       
    } else if (cvv.length !== 3) {
        alert('CVV must be 3 digits long.');
     
    }
    else if (selectedDate < currentDate) {
        alert('This card has already expired. Enter a future effective date.');
    }
    else if (cardHolder === "") {
        alert('Please enter the cardholder name.');
    }
    else {
        alert('The payment was successful! An email will be sent with order details and arrival times for collection.');
        
        const audio = new Audio('audio/payment.mp3'); // נתיב לקובץ השמע
        audio.play();

        cart = [];
        saveCart();

        // איפוס מלאי לערכים התחלתיים
        resetInventory();

        // עדכון המלאי ב-LocalStorage
        //saveInventory();

        window.location.href = './home.html';

        

    }

}

function resetInventory() {
    for (const productId in inventory) {
        inventory[productId] = 10; // קובע שכל פריט יקבל מלאי של 10
    }
    saveInventory(); // שמירה ב-LocalStorage
    updateInventoryDisplay(); // עדכון המלאי ב-HTML
}

function messageC()
{
    const messageC = document.getElementById("message").value.trim();
    if (messageC === "") {
        alert('Please write a meesage');
    }
    else{
        alert('Your request has been received. We will get back to you as soon as possible');

    }
}

// קשור לcss
document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector("p")?.textContent.includes("Login Page")) {
        document.body.classList.add("login-page");
    }
});
document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector("h1")?.textContent.includes("User Name")) {
        document.body.classList.add("login-page");
    }
});


document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector("h1")?.textContent.includes("your shopping cart")) {
        document.body.classList.add("shopping-cart-page");
    }
});


// קשור להצגת השם בכל האתר
function saveUsername() {
    const username = document.getElementById('username').value;
    if (username) {
      localStorage.setItem('username', username);
      window.location.href = 'home.html'; // מעבר לדף הבית
    }
  }

    document.addEventListener('DOMContentLoaded', function() {
        const username = localStorage.getItem('username') || 'Guest'; // אם אין שם משתמש, אורח כברירת מחדל
        const welcomeUserElement = document.getElementById('welcome-user');
        if (welcomeUserElement) {
            welcomeUserElement.textContent = `Hello, ${username}`;
        }
    });

 // טעינת הסכום הכולל מ-LocalStorage
 function loadTotal() {
    const totalAmount = localStorage.getItem("cartTotal");
    if (totalAmount) {
        document.getElementById("totalDisplay").textContent = `Total:${totalAmount} ILS`;
    } else {
        document.getElementById("totalDisplay").textContent = "Your cart is empty.";
    }
}

// לקרוא את הפונקציה כשעמוד הטעינה נטען
document.addEventListener("DOMContentLoaded", loadTotal);

function logout() {
    localStorage.removeItem('username'); // מחיקת שם המשתמש
    localStorage.setItem('username', 'Guest'); // קביעת אורח כברירת מחדל
    const welcomeUserElement = document.getElementById('welcome-user');
    if (welcomeUserElement) {
        welcomeUserElement.textContent = "Hello, Guest"; // עדכון הודעה
    }
}

async function loadProductsFromMongo(category) {
    try {
        const response = await fetch(
            "http://localhost:3000/products?category=" +
            encodeURIComponent(category)
        );

        const products = await response.json();

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

    } catch (error) {
        console.log("Error loading products:", error);
    }
}