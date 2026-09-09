from flask import Flask, render_template, request, redirect, url_for, session, flash
import sqlite3
import os
from pathlib import Path
from werkzeug.security import generate_password_hash, check_password_hash

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "database" / "canteen.db"

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "development-secret-key")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = get_db()
    conn.executescript("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'student'
    );
    CREATE TABLE IF NOT EXISTS menu (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_name TEXT NOT NULL, price REAL NOT NULL,
        available INTEGER NOT NULL DEFAULT 1,
        preparation_time INTEGER NOT NULL DEFAULT 5
    );
    CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL, token INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'WAITING', total REAL NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL, menu_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id),
        FOREIGN KEY (menu_id) REFERENCES menu(id)
    );
    """)
    if conn.execute("SELECT COUNT(*) FROM menu").fetchone()[0] == 0:
        conn.executemany(
            "INSERT INTO menu (item_name,price,available,preparation_time) VALUES (?,?,?,?)",
            [("Veg Sandwich",50,1,5),("Masala Maggi",60,1,7),
             ("Paneer Roll",80,1,10),("Cold Coffee",70,1,5),
             ("Veg Burger",90,1,12)])
    if conn.execute("SELECT id FROM users WHERE email=?",
                    ("admin@canteen.local",)).fetchone() is None:
        conn.execute("INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)",
                     ("Canteen Admin","admin@canteen.local",
                      generate_password_hash("admin123"),"admin"))
    conn.commit()
    conn.close()

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/register", methods=["GET","POST"])
def register():
    if request.method == "POST":
        name=request.form.get("name","").strip()
        email=request.form.get("email","").strip().lower()
        password=request.form.get("password","")
        if not name or not email or not password:
            flash("All fields are required.","danger")
            return render_template("register.html")
        if len(password)<6:
            flash("Password must contain at least 6 characters.","danger")
            return render_template("register.html")
        conn=get_db()
        try:
            conn.execute("INSERT INTO users (name,email,password) VALUES (?,?,?)",
                         (name,email,generate_password_hash(password)))
            conn.commit()
        except sqlite3.IntegrityError:
            conn.close()
            flash("An account with this email already exists.","danger")
            return render_template("register.html")
        conn.close()
        flash("Registration successful. Please log in.","success")
        return redirect(url_for("login"))
    return render_template("register.html")

@app.route("/login", methods=["GET","POST"])
def login():
    if request.method=="POST":
        email=request.form.get("email","").strip().lower()
        password=request.form.get("password","")
        conn=get_db()
        user=conn.execute("SELECT * FROM users WHERE email=?",(email,)).fetchone()
        conn.close()
        if user and check_password_hash(user["password"],password):
            session["user_id"]=user["id"]; session["user_name"]=user["name"]
            session["role"]=user["role"]
            return redirect(url_for("admin" if user["role"]=="admin" else "menu"))
        flash("Invalid email or password.","danger")
    return render_template("login.html")

@app.route("/logout")
def logout():
    session.clear()
    flash("You have been logged out.","success")
    return redirect(url_for("index"))

@app.route("/menu")
def menu():
    if "user_id" not in session:
        flash("Please log in to view the menu.","warning")
        return redirect(url_for("login"))
    conn=get_db()
    items=conn.execute("SELECT * FROM menu ORDER BY id").fetchall()
    conn.close()
    return render_template("menu.html",items=items)

@app.route("/admin")
def admin():
    if session.get("role")!="admin":
        flash("Admin access required.","danger")
        return redirect(url_for("index"))
    conn=get_db()
    orders=conn.execute("""SELECT orders.*,users.name AS customer_name
                           FROM orders JOIN users ON users.id=orders.user_id
                           ORDER BY orders.id DESC""").fetchall()
    items=conn.execute("SELECT * FROM menu ORDER BY id").fetchall()
    conn.close()
    return render_template("admin.html",orders=orders,items=items)

if __name__=="__main__":
    init_db()
    app.run(debug=True)
