from flask import Flask, request, jsonify, session, redirect
import psycopg2
from flask_bcrypt import Bcrypt
from flask_session import Session
import uuid

app = Flask(__name__)
bcrypt = Bcrypt(app)

# 🔐 Configure Flask Session
app.config["SECRET_KEY"] = "supersecretkey"
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# 🔗 PostgreSQL Database Connection
conn = psycopg2.connect(
    dbname="user_info",
    user="postgres",
    password="123456",
    host="localhost",
    port="5432"
)
cursor = conn.cursor()

# ✅ Register User
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    name = data['name']
    email = data.get('email')
    mobile = data.get('mobile')
    password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    if not email and not mobile:
        return jsonify({"error": "Either Email or Mobile is required!"}), 400

    try:
        cursor.execute("INSERT INTO users (name, email, mobile, password) VALUES (%s, %s, %s, %s)", 
                       (name, email, mobile, password))
        conn.commit()
        return jsonify({"message": "Registration successful!"}), 201
    except psycopg2.IntegrityError:
        conn.rollback()
        return jsonify({"error": "Email or Mobile already registered!"}), 400

# 🔑 Login User
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user_input = data['user_input']
    password = data['password']

    cursor.execute("SELECT id, email, password FROM users WHERE email = %s OR mobile = %s", (user_input, user_input))
    user = cursor.fetchone()

    if user and bcrypt.check_password_hash(user[2], password):
        session['user_id'] = user[0]  # Store user ID in session
        session['email'] = user[1]

        # Store session in PostgreSQL
        session_id = str(uuid.uuid4())  # Generate unique session ID
        cursor.execute("INSERT INTO sessions (session_id, user_email) VALUES (%s, %s)", (session_id, user[1]))
        conn.commit()

        return jsonify({"success": True, "message": "Login successful!", "redirect": "index.html"})
    else:
        return jsonify({"error": "Invalid credentials!"}), 401

# 🔐 Check Session
@app.route('/check-session', methods=['GET'])
def check_session():
    if 'user_id' in session:
        return jsonify({"loggedIn": True, "user": session['email']})
    return jsonify({"loggedIn": False})

# 🚪 Logout
@app.route('/logout', methods=['GET'])
def logout():
    session.clear()  # Clear session data
    return redirect("/login-register.html")

if __name__ == '__main__':
    app.run(debug=True)
