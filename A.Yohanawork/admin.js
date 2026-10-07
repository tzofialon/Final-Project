
        async function loadProductCharts() {
            const errorElement = document.getElementById("statisticsError");

            try {
                const response = await fetch("http://localhost:3000/products/stats");
                if (!response.ok) {
                    throw new Error("Statistics request failed.");
                }

                const statistics = await response.json();
                if (!Array.isArray(statistics.byCategory)) {
                    throw new Error("Statistics response is missing category data.");
                }

                const categories = statistics.byCategory;
                const labels = categories.map(category => category._id);

                new Chart(document.getElementById("productCountChart"), {
                    type: "bar",
                    data: {
                        labels,
                        datasets: [{
                            label: "Products",
                            data: categories.map(category => category.numberOfProducts),
                            backgroundColor: "rgba(0, 217, 255, 0.72)",
                            borderColor: "#0078D4",
                            borderWidth: 1
                        }]
                    },
                    options: {
                        indexAxis: "y",
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            x: {
                                beginAtZero: true,
                                ticks: { precision: 0 }
                            }
                        }
                    }
                });

                new Chart(document.getElementById("averagePriceChart"), {
                    type: "bar",
                    data: {
                        labels,
                        datasets: [{
                            label: "Average price (₪)",
                            data: categories.map(category => category.averagePrice),
                            backgroundColor: "rgba(206, 24, 206, 0.68)",
                            borderColor: "#a32dc1",
                            borderWidth: 1
                        }]
                    },
                    options: {
                        indexAxis: "y",
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            x: {
                                beginAtZero: true,
                                ticks: {
                                    callback: value => Number(value).toFixed(2)
                                }
                            }
                        },
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: context => `${context.dataset.label}: ${Number(context.raw).toFixed(2)} ₪`
                                }
                            }
                        }
                    }
                });
            } catch (error) {
                console.error("Unable to load product statistics:", error);
                errorElement.textContent = "Product statistics could not be loaded. Please try again later.";
                errorElement.hidden = false;
            }
        }

        // פונקציה שטוענת את המשתמשים ובודקת הרשאת מנהל
        async function loadUsers() {


            // קבלת פרטי המשתמש המחובר מ-localStorage
            const username = localStorage.getItem("username");
            const role = localStorage.getItem("role");


            // בדיקה ראשונית - האם המשתמש הוא admin
            if (role !== "admin") {

                alert("Access denied");

                // אם לא מנהל - חוזר לדף הבית
                window.location.href = "home.html";

                return;
            }


            // שליחת בקשה לשרת לקבלת רשימת המשתמשים
            // שם המשתמש נשלח כדי שהשרת יוודא שהוא באמת admin
            const response = await fetch(
                `http://localhost:3000/users?username=${username}`
            );


            // אם השרת דחה את הבקשה - אין הרשאה
            if (!response.ok) {

                alert("Access denied");

                window.location.href = "home.html";

                return;
            }


            // קבלת רשימת המשתמשים מהשרת כ-JSON
            const users = await response.json();


            // מציאת גוף הטבלה ב-HTML
            const table = document.getElementById("usersTable");


            // מעבר על כל המשתמשים שהתקבלו
            users.forEach(user => {

                // הוספת כל משתמש כשורה חדשה בטבלה
                table.innerHTML += `
                    <tr>
                        <td>${user.username}</td>
                        <td>${user.email}</td>
                        <td>${user.role}</td>
                    </tr>
                `;

            });

            loadProductCharts();
        }

// ==========================================
// READ + SORT - ORDERS
// הצגת ההזמנות לפי המיון שמגיע מ-MongoDB
// ==========================================

async function loadOrders() {
    try {

        const response = await fetch(
            "http://localhost:3000/orders"
        );

        if (!response.ok) {
            throw new Error("Failed to load orders");
        }

        const orders = await response.json();

        const tableBody =
            document.getElementById("ordersTableBody");

        tableBody.innerHTML = "";

        orders.forEach(order => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${order.username}</td>
                <td>${order.total} ₪</td>
                <td>${new Date(order.orderDate).toLocaleString()}</td>
            `;

            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Error loading orders:", error);
    }
}
loadOrders();
// ==========================================
// AGGREGATE - MOST EXPENSIVE PRODUCT
// הצגת המוצר היקר ביותר בכל קטגוריה
// ==========================================

async function loadMostExpensiveProducts() {
    try {

        const response = await fetch(
            "http://localhost:3000/products/most-expensive-by-category"
        );

        if (!response.ok) {
            throw new Error("Failed to load most expensive products");
        }

        const products = await response.json();

        const tableBody =
            document.getElementById("expensiveProductsTableBody");

        tableBody.innerHTML = "";

        products.forEach(product => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${product._id}</td>
                <td>${product.productName}</td>
                <td>${product.price} ₪</td>
            `;

            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error(
            "Error loading most expensive products:",
            error
        );
    }
}
loadMostExpensiveProducts();
        // הפעלת הפונקציה כאשר הדף נטען
        loadUsers();

  