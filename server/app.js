const path = require("path");
const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const clientDir = path.join(__dirname, "..", "client");

app.use(cors());
app.use(express.json());

// API
app.use("/api", routes);

// STATIC FILES // קבצי ה-Frontend. דפי ה-HTML מוגשים מהשורש (/home.html),
// ושאר התיקיות תחת הנתיב שלהן (/css, /js, /images, /audio)
app.use(express.static(path.join(clientDir, "html")));
for (const dir of ["css", "js", "images", "audio"]) {
    app.use(`/${dir}`, express.static(path.join(clientDir, dir)));
}

app.get("/", (req, res) => {
    res.sendFile(path.join(clientDir, "html", "home.html"));
});

app.use(errorHandler);

module.exports = app;
