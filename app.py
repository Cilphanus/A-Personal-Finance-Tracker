import json
from flask import Flask, request, jsonify
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report

app = Flask(__name__)

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

    df['Category'] = df['Transaction_Description'].map(description_mapping)
    categorized_transactions = df.groupby('Category')['Transaction_Amount'].sum().reset_index()
    categorized_transactions = categorized_transactions.to_dict(orient='records')
    return categorized_transactions

def calculate_monthly_summary(df):
    # Extract the month and year from the transaction date
    df['Transaction_Date'] = pd.to_datetime(df['Transaction_Date'])
    df['Month'] = df['Transaction_Date'].dt.month
    df['Year'] = df['Transaction_Date'].dt.year

    # Group the transactions by month, year, and category, and calculate the total amount
    monthly_summary = df.groupby(['Year', 'Month', 'Category'])['Transaction_Amount'].sum().reset_index()

    # Convert the monthly summary to a list of dictionaries
    monthly_summary = monthly_summary.to_dict(orient='records')

    return monthly_summary


# Endpoint for training and making predictions
@app.route('/predict', methods=['POST'])
def predict():
    # Get the data from the request
    data = request.json
    
    # Load the dataset
    df = pd.DataFrame(data)
    
    # Preprocess the data
    X = pd.get_dummies(df[['Category', 'Transaction_Amount', 'Transaction_Date']])
    y = df['Transaction_Type']

    # Split the data into training and test sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Select a machine learning algorithm (Random Forest in this example)
    model = RandomForestClassifier()

    # Train the model
    model.fit(X_train, y_train)

    # Make predictions
    y_pred = model.predict(X_test)

    # Evaluate the model
    report = classification_report(y_test, y_pred)
    
    # Return the classification report as a JSON response
    return jsonify({'classification_report': report})

@app.route('/api/categorized-transactions', methods=['POST'])
def get_categorized_transactions():
    data = request.json
    
    # Load the dataset
    df = pd.DataFrame(data)
    
    # Categorize the transactions
    categorized_transactions = categorize_transactions(df)
    
    # Return the categorized transactions as a JSON response
    return jsonify(categorized_transactions)

# API endpoint for generating the monthly summary
@app.route('/api/monthly-summary', methods=['POST'])
def generate_monthly_summary():
    data = request.json
    
    # Load the dataset
    df = pd.DataFrame(data)
    
    # Generate the monthly summary
    monthly_summary = calculate_monthly_summary(df)
    
    # Return the monthly summary as a JSON response
    return jsonify(monthly_summary)


if __name__ == '__main__':
    app.run()
