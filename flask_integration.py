from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/transactions')
def transactions():
    return render_template('transactions.html')

@app.route('/progress')
def progress():
    return render_template('progress.html')

@app.route('/bill-reminders')
def bill_reminders():
    return render_template('bill_reminders.html')

if __name__ == '__main__':
    app.run()
