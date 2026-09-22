const express = require("express");
const session = require("express-session");
const path = require("path");

const app = express();
const PORT = 3000;

// ===============================
// LOGIN DETAILS
// ===============================

const users = {
    admin: {
        username: "admin",
        password: "admin123",
        role: "admin"
    },

    user: {
        username: "user",
        password: "user123",
        role: "user"
    }
};

// ===============================
// MIDDLEWARE
// ===============================

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    session({
        secret: "my-secret-key",
        resave: false,
        saveUninitialized: false
    })
);

app.use(express.static(path.join(__dirname, "public")));

// ===============================
// LOGIN
// ===============================

app.post("/login", (req, res) => {

    const { username, password } = req.body;

    let loggedInUser = null;

    if (
        username === users.admin.username &&
        password === users.admin.password
    ) {
        loggedInUser = users.admin;
    }

    else if (
        username === users.user.username &&
        password === users.user.password
    ) {
        loggedInUser = users.user;
    }

    if (!loggedInUser) {
        return res.send(`
            <script>
                alert("Invalid username or password!");
                window.location.href="/login.html";
            </script>
        `);
    }

    req.session.username = loggedInUser.username;
    req.session.role = loggedInUser.role;

    if (loggedInUser.role === "admin") {
        res.redirect("/admin.html");
    } else {
        res.redirect("/user.html");
    }
});

// ===============================
// ADMIN PROTECTION
// ===============================

app.get("/admin", (req, res) => {

    if (!req.session.username || req.session.role !== "admin") {
        return res.redirect("/login.html");
    }

    res.send(`
        <h1>Administrator Access Granted</h1>
        <p>Welcome ${req.session.username}</p>
        <a href="/admin.html">Go to Admin Dashboard</a>
    `);
});

// ===============================
// USER PROTECTION
// ===============================

app.get("/user", (req, res) => {

    if (!req.session.username || req.session.role !== "user") {
        return res.redirect("/login.html");
    }

    res.send(`
        <h1>User Access Granted</h1>
        <p>Welcome ${req.session.username}</p>
        <a href="/user.html">Go to User Dashboard</a>
    `);
});

// ===============================
// LOGOUT
// ===============================

app.get("/logout", (req, res) => {

    req.session.destroy(() => {
        res.redirect("/index.html");
    });

});

// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});