// Track transactions
let transactions = [];

// Function to display transactions
function displayTransactions() {
  const transactionList = document.getElementById('transaction-list');
  transactionList.innerHTML = '';

  transactions.forEach((transaction, index) => {
    const { id, type, description, amount } = transaction;

    const listItem = document.createElement('li');
    listItem.classList.add('transaction-item');

    const transactionText = document.createElement('div');
    transactionText.innerHTML = `<span>${type.charAt(0).toUpperCase() + type.slice(1)}</span> - ${description} - ${amount}`;

    const editButton = document.createElement('button');
    editButton.innerText = 'Edit';
    editButton.addEventListener('click', () => {
      editTransaction(index);
    });

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.addEventListener('click', () => {
      deleteTransaction(index);
    });

    listItem.appendChild(transactionText);
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);

    transactionList.appendChild(listItem);
  });

  // Show/hide #transactions based on transaction count
  const transactionsSection = document.getElementById('transactions');
  transactionsSection.style.display = transactions.length ? 'block' : 'none';
}

// Function to edit a transaction
function editTransaction(index) {
  const transaction = transactions[index];
  const transactionItem = document.getElementsByClassName('transaction-item')[index];

  const editDiv = document.createElement('div');
  editDiv.classList.add('edit-transaction');

  const typeLabel = document.createElement('label');
  typeLabel.innerText = 'Type:';
  const typeSelect = document.createElement('select');
  const options = ['income', 'expense'];
  options.forEach((option) => {
    const optionElement = document.createElement('option');
    optionElement.value = option;
    optionElement.text = option.charAt(0).toUpperCase() + option.slice(1);
    if (option === transaction.type) {
      optionElement.selected = true;
    }
    typeSelect.appendChild(optionElement);
  });

  const descriptionLabel = document.createElement('label');
  descriptionLabel.innerText = 'Description:';
  const descriptionInput = document.createElement('input');
  descriptionInput.type = 'text';
  descriptionInput.value = transaction.description;

  const amountLabel = document.createElement('label');
  amountLabel.innerText = 'Amount:';
  const amountInput = document.createElement('input');
  amountInput.type = 'number';
  amountInput.step = '0.01';
  amountInput.value = transaction.amount;

  const saveButton = document.createElement('button');
  saveButton.innerText = 'Save';
  saveButton.addEventListener('click', () => {
    const updatedTransaction = {
      id: transaction.id,
      type: typeSelect.value,
      description: descriptionInput.value,
      amount: parseFloat(amountInput.value),
    };

    transactions[index] = updatedTransaction;
    transactionItem.removeChild(editDiv);
    displayTransactions();
  });

  const cancelButton = document.createElement('button');
  cancelButton.innerText = 'Cancel';
  cancelButton.addEventListener('click', () => {
    transactionItem.removeChild(editDiv);
  });

  editDiv.appendChild(typeLabel);
  editDiv.appendChild(typeSelect);
  editDiv.appendChild(descriptionLabel);
  editDiv.appendChild(descriptionInput);
  editDiv.appendChild(amountLabel);
  editDiv.appendChild(amountInput);
  editDiv.appendChild(saveButton);
  editDiv.appendChild(cancelButton);

  transactionItem.insertAdjacentElement('afterend', editDiv); // Insert the edit div after the transaction item
}

// Rest of the code remains the same...

// Function to update balance
function updateBalance() {
  const balanceAmount = document.getElementById('balance-amount');
  const balance = transactions.reduce((total, transaction) => {
    if (transaction.type === 'income') {
      return total + parseFloat(transaction.amount);
    } else {
      return total - parseFloat(transaction.amount);
    }
  }, 0);

  balanceAmount.textContent = balance.toFixed(2);
}

// Function to add a new transaction
function addTransaction(e) {
  e.preventDefault();

  const type = document.getElementById('type').value;
  const description = document.getElementById('description').value;
  const amount = document.getElementById('amount').value;

  const newTransaction = {
    type: type,
    description: description,
    amount: amount
  };

  transactions.push(newTransaction);

  displayTransactions();
  updateBalance();

  // Clear input fields
  document.getElementById('description').value = '';
  document.getElementById('amount').value = '';
}

// Function to delete a transaction
function deleteTransaction(index) {
  transactions.splice(index, 1);

  displayTransactions();
  updateBalance();
}

// Add event listener to the transaction form
const transactionForm = document.getElementById('transaction-form');
transactionForm.addEventListener('submit', addTransaction);

