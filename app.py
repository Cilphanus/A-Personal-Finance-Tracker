import json
from flask import Flask, render_template, request, jsonify
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def categorize_transactions(df):
    # Create a mapping of transaction descriptions to categories
    description_mapping = {
        "groceries": "Food",
        "restaurant": "Food",
        "coffee": "Food",
        "supermarket": "Food",
        "clothes": "Clothing",
        "shoes": "Clothing",
        "accessories": "Clothing",
        "utilities": "Utilities",
        "electricity bill": "Utilities",
        "water bill": "Utilities",
        "gas bill": "Utilities",
        "rent": "Housing",
        "mortgage": "Housing",
        "insurance": "Insurance",
        "healthcare": "Insurance",
        "travel": "Travel",
        "transportation": "Transportation",
        "gasoline": "Transportation",
        "car maintenance": "Transportation",
        "entertainment": "Entertainment",
        "movies": "Entertainment",
        "concert": "Entertainment",
        "subscriptions": "Subscriptions",
        "internet": "Subscriptions",
        "streaming services": "Subscriptions",
        "gym": "Fitness",
        "sports": "Fitness",
        "education": "Education",
        "books": "Education",
        "tuition": "Education",
        "donations": "Charity",
        "gifts": "Gifts",
        "shopping": "Shopping",
        "miscellaneous": "Miscellaneous"
    }

    df['Category'] = df['description'].map(description_mapping)
    df['amount']=df['amount'].astype(int)
    print(df)
    categorized_transactions = df.groupby('Category')['amount'].sum().reset_index()
    print(categorized_transactions)
    categorized_transactions = categorized_transactions.to_dict(orient='records')
    return categorized_transactions

def calculate_monthly_summary(df):
    # Extract the month and year from the transaction date
    df['date'] = pd.to_datetime(df['date'])
    df['Month'] = df['date'].dt.month
    df['Year'] = df['date'].dt.year

    # Group the transactions by month, year, and category, and calculate the total amount
    monthly_summary = df.groupby(['Category'])['amount'].sum().reset_index()
    print(monthly_summary)

    # Convert the monthly summary to a list of dictionaries
    monthly_summary = monthly_summary.to_dict(orient='records')

    return monthly_summary

# Endpoint for training and making predictions
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/monthly-summary', methods=['POST'])
def generate_monthly_summary():
    print("hello")
    data = request.json
    
    # Load the dataset
    df = pd.DataFrame(data)
    print(data)
    print(df)

    categorized_transactions = categorize_transactions(df)
    monthly_summary = calculate_monthly_summary(df)  # Pass df instead of categorized_transactions
    
    summary_data = {
        'categorized_transactions': categorized_transactions,
        'monthly_summary': monthly_summary
    }
    print(summary_data)
    
    # Return the categorized transactions and monthly summary as a JSON response
    return jsonify(summary_data)


if __name__ == '__main__':
    app.run(debug=True)
