
//עגלה
let cart = [];

// שליפת המוצרים מהשרת לפי קטגוריה
async function loadProducts(categoryName = '') {
  try {
    let url = '/api/products';
    if (categoryName) {
      url += `?category=${encodeURIComponent(categoryName)}`;
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch products');

    const products = await response.json();
    displayProducts(products);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

//רינדור המוצרים לקטלוג 
function displayProducts(products) {
  // תמיכה במיכל ה-HTML הקיים בדפים (car-list או products-container)
  const container = document.getElementById('car-list') || document.getElementById('products-container');
  if (!container) return;

  container.innerHTML = '';

  products.forEach(product => {
    const id = product._id || product.productId;
    // תמיכה בשם השדה inventory מ-MongoDB עם גיבוי ל-stock
    const stockAmount = product.inventory !== undefined ? product.inventory : (product.stock !== undefined ? product.stock : 0);

    const card = document.createElement('div');
    card.className = 'car-item';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.description || ''}</p>
      <p>price: ${product.price} ₪</p>
      <span id="inventory_${id}">inventory: ${stockAmount}</span>
      <br/>
      <button onclick="addToCart('${id}', '${product.name.replace(/'/g, "\\'")}', ${product.price}, '${product.image}', ${stockAmount})">
        add to cart
      </button>
    `;
    container.appendChild(card);
  });
}

// עדכון המלאי במסד הנתונים בשרת
async function updateServerInventory(productId, newInventory) {
  try {
    const response = await fetch(`/api/products/${productId}/inventory`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inventory: newInventory })
    });

    if (!response.ok) throw new Error('עדכון המלאי נכשל');

    // רענון המוצרים מהשרת כדי להציג את המלאי المעודכן
    const bodyClass = document.body.className;
    loadProducts(bodyClass);
  } catch (error) {
    console.error('Error updating inventory:', error);
  }
}

// שמירת מצב העגלה והסכום הכולל ב-LocalStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  localStorage.setItem("cartTotal", totalAmount);
}

// טעינת נתוני העגלה מ-LocalStorage
function loadCart() {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCart();
  }
}

// הוספת מוצר לעגלה והפחתת המלאי בשרת
async function addToCart(carId, carName, carPrice, carImage, currentInventory) {
  if (currentInventory > 0) {
    let existingCar = cart.find(item => item.id === carId);
    if (existingCar) {
      existingCar.quantity++;
    } else {
      cart.push({ id: carId, name: carName, price: carPrice, quantity: 1, image: carImage });
    }
    
    saveCart();
    updateCart();
    await updateServerInventory(carId, currentInventory - 1);
  } else {
    alert("The product is out of stock!");
  }
}

// הסרת מוצר מהעגלה והחזרת המלאי לשרת
async function handleRemoveFromCart(carId) {
  const index = cart.findIndex(item => item.id === carId);
  if (index !== -1) {
    const itemQuantity = cart[index].quantity;

    try {
      const response = await fetch('/api/products');
      const products = await response.json();
      const currentProduct = products.find(p => (p._id || p.productId) == carId);
      const currentInventory = currentProduct ? (currentProduct.inventory !== undefined ? currentProduct.inventory : currentProduct.stock) : 0;

      cart.splice(index, 1);
      saveCart();
      updateCart();

      await updateServerInventory(carId, currentInventory + itemQuantity);
    } catch (error) {
      console.error('Error handling remove from cart:', error);
    }
  }
}

// עדכון תצוגת העגלה ב-HTML
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
        <td><span>${item.quantity}</span></td>
        <td>${item.price * item.quantity} ₪</td>
        <td><button onclick="handleRemoveFromCart('${item.id}')">remove</button></td>
      `;
      cartItems.appendChild(row);
    });

    totalPriceElement.textContent = `${totalPrice} ₪`;
  }
}

// אימות פרטי אשראי ואיפוס העגלה
function validatePayment() {
  const cardNumber = document.getElementById("card-number").value.replace(/\s/g, '');
  const cvv = document.getElementById("cvv").value;
  const expiryDate = document.getElementById("expiry-date").value;
  const currentDate = new Date();
  const selectedDate = new Date(expiryDate + "-01"); 
  const cardHolder = document.getElementById("card-holder").value.trim();
  
  if (cardNumber.length !== 16) {
    alert('The card number must be 16 digits long.');
  } else if (cvv.length !== 3) {
    alert('CVV must be 3 digits long.');
  } else if (selectedDate < currentDate) {
    alert('This card has already expired.');
  } else if (cardHolder === "") {
    alert('Please enter the cardholder name.');
  } else {
    alert('The payment was successful!');
    
    cart = [];
    saveCart();
    window.location.href = './home.html';
  }
}

// הפעלה בעת טעינת העמוד
document.addEventListener("DOMContentLoaded", () => {
  const category = document.body.className;
 loadProducts(category);
  loadCart();
});

