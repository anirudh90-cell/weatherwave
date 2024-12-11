from flask import Flask, render_template, request, jsonify, session, redirect, url_for
import re
from flask_mysqldb import MySQL

app = Flask(__name__)
app.secret_key = 'Anirudh#@!123'

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'Anirudh#123'
app.config['MYSQL_DB'] = 'register'

mysql = MySQL(app)

@app.route('/')
def home():
       return render_template('HomePage.html.html')

@app.route('/registration', methods=['GET', 'POST'])
def registration():
    if request.method == 'GET':
        return render_template('LoginRegistration.html.html')

    if request.method == 'POST':
        firstname = request.form['fname']
        lastname = request.form['lname']
        contact = request.form['contact']
        email = request.form['email']
        password = request.form['password']
        confirmpassword = request.form['confirmPassword']

        email_pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        con_pattern = r"^\d{10}$"
        pass_pattern = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!#%*?&]{6,20}$"

        if not re.match(con_pattern, contact):
           return jsonify({"status": "error", "message": "Please enter a 10-digit number"})

        if not re.match(email_pattern, email):
           return jsonify({"status": "error", "message": "Please enter a valid email"})

        if not re.match(pass_pattern, password):
           return jsonify({"status": "error", "message": "Password must contain One Capital Letter, Number,special symbol and not less than 6 letter"})

        if password != confirmpassword:
           return jsonify({"status": "error", "message": "Password and Confirm Password are not matched"})

        if password==confirmpassword:
                cur = mysql.connection.cursor()
                cur.execute("SELECT * FROM data WHERE email = %s OR contact = %s", (email, contact))
                user = cur.fetchone()

                if user:
                    if user[3] == email:
                            return jsonify({'success': False, 'message': 'Email already exists. Please use a different email.'})
                    elif user[4] == contact:
                            return jsonify({'success': False, 'message': 'Mobile number already exists. Please use a different number.'})
                else:
                    cur.execute(
                    "INSERT INTO data (fname, lname, email, contact, password, confirm_password) VALUES (%s, %s, %s, %s, %s, %s)", 
                    (firstname, lastname, email, contact, password, confirmpassword)
                    )
                    mysql.connection.commit()
                    cur.close()
                    return jsonify({'success': True, 'message': 'Registration successful! Now you can login.'})
                     
                     

    return jsonify({'success': False, 'message': 'Invalid request.'})

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template('LoginRegistration.html.html')
    
    if request.method == 'POST':
        log_email = request.form['logemail']
        log_password = request.form['logpassword']

        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM data WHERE email = %s AND password = %s", (log_email, log_password))
        user = cur.fetchone()
        cur.close()

        if user:
            
            session['email'] = log_email
            return jsonify({'success': True, 'message': 'Login Successfull.'})
        else:
            return jsonify({'success': False, 'message': 'Invalid username or password. Please try again.'})
        
@app.route('/send',methods=['POST'])
def send():
    if request.method=='POST':
        FIRST=request.form['Name']
        EMAIL=request.form['Email']
        MOBILE=request.form['Mobile']
        FEEDBACK=request.form['Feedback']

        cur=mysql.connection.cursor()
        cur.execute("insert into con_feed (first_name,email,mobile,feedback) values (%s,%s,%s,%s)",(FIRST,EMAIL,MOBILE,FEEDBACK))
        mysql.connection.commit()
        cur.close()

        return jsonify({'success': True, 'message': 'Feedback has been sent! Thanks :)'})

@app.route('/main_page')
def main_page():
    if 'email' not in session:
        return redirect(url_for('home'))  
    
    return render_template('MainPage.html.html')
@app.route('/abouts')
def abouts():
    return render_template('about.html')

@app.route('/contacts')
def contacts():
    return render_template('contact.html')

@app.route('/about',methods=['GET'])
def about():
    if 'email' not in session:
        return redirect(url_for('home'))  
    return render_template('about.html')

@app.route('/contact')
def contact():
    if 'email' not in session:
        return redirect(url_for('home')) 
    return render_template('contact.html')

@app.route('/quiz')
def quiz():
    if 'email' not in session:
        return redirect(url_for('home'))  
    return render_template('quiz.html')

@app.route('/privacy')
def privacy():
    if 'email' not in session:
        return redirect(url_for('home'))  
    return render_template('privacy.html')

@app.route('/privacys')
def privacys(): 
    return render_template('privacy.html')

@app.route('/term')
def term():
    return render_template('term.html')
@app.route('/logout')
def logout():
    session.pop('email', None)  
    return redirect(url_for('home')) 

if __name__ == '__main__':
    app.run()
