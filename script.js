// Track transactions
let transactions = [];
let goalAmount = 0;
let billReminders = [];

// Function to display transactions and update progress
function displayTransactions() {
  const transactionList = document.getElementById('transaction-list');
  transactionList.innerHTML = '';

  transactions.forEach((transaction, index) => {
    const { id, type, description, amount, date } = transaction;

    const listItem = document.createElement('li');
    listItem.classList.add('transaction-item');

    const transactionText = document.createElement('div');
    transactionText.innerHTML = `<span>${type.charAt(0).toUpperCase() + type.slice(1)}</span>- ${description} - ${amount} - ${formatDate(date)}`;

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

  // Update progress
  updateProgress();
}

// Function to format the date as dd/mm/yyyy
function formatDate(date) {
  const [month, day, year] = new Date(date).toLocaleDateString().split('/');
  return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
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

  const dateLabel = document.createElement('label');
  dateLabel.innerText = 'Date:';
  const dateInput = document.createElement('input');
  dateInput.type = 'date';
  dateInput.value = transaction.date;

  const saveButton = document.createElement('button');
  saveButton.innerText = 'Save';
  saveButton.addEventListener('click', () => {
    const updatedTransaction = {
      id: transaction.id,
      type: typeSelect.value,
      description: descriptionInput.value,
      amount: parseFloat(amountInput.value),
      date: dateInput.value
    };

    transactions[index] = updatedTransaction;
    transactionItem.parentNode.removeChild(transactionItem);
    editDiv.parentNode.removeChild(editDiv);
    updateBalance();
    displayTransactions();
  });

  const cancelButton = document.createElement('button');
  cancelButton.innerText = 'Cancel';
  cancelButton.addEventListener('click', () => {
    editDiv.parentNode.removeChild(editDiv);
  });

  editDiv.appendChild(typeLabel);
  editDiv.appendChild(typeSelect);
  editDiv.appendChild(descriptionLabel);
  editDiv.appendChild(descriptionInput);
  editDiv.appendChild(amountLabel);
  editDiv.appendChild(amountInput);
  editDiv.appendChild(dateLabel);
  editDiv.appendChild(dateInput);
  editDiv.appendChild(saveButton);
  editDiv.appendChild(cancelButton);

  transactionItem.parentNode.insertBefore(editDiv, transactionItem.nextSibling);
}

// Function to update balance and progress
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
  updateProgress();
}

// Function to update progress
function updateProgress() {
  const progress = document.getElementById('progress');
  const progressPercentage = document.getElementById('progress-percentage');
  const goalContainer = document.getElementById('goal-container');
  const goalAchievedMessage = document.getElementById('goal-achieved-message');
  if (goalAmount > 0) {
    goalContainer.style.display = 'block';
    const balance = parseFloat(document.getElementById('balance-amount').textContent);
    const percentage = (balance / goalAmount) * 100;
    const clampedPercentage = Math.min(100, Math.max(0, percentage));

    progress.style.width = `${clampedPercentage}%`;
    progressPercentage.textContent = `${clampedPercentage.toFixed(2)}%`;

    if (clampedPercentage >= 100) {
      goalAchievedMessage.style.display = 'block';
    } else {
      goalAchievedMessage.style.display = 'none';
    }
  } else {
    goalContainer.style.display = 'none';
    progress.style.width = '0%';
    progressPercentage.textContent = '';
    goalAchievedMessage.style.display = 'none';
  }
}

// Function to add a new transaction
function addTransaction(e) {
  e.preventDefault();

  const type = document.getElementById('type').value;
  const description = document.getElementById('description').value;
  const amount = document.getElementById('amount').value;
  const date = document.getElementById('date').value;

  const newTransaction = {
    type: type,
    description: description,
    amount: amount,
    date: date
  };

  transactions.push(newTransaction);

  displayTransactions();
  updateBalance();

  // Clear input fields
  document.getElementById('description').value = '';
  document.getElementById('amount').value = '';
  document.getElementById('date').value = '';
}

// Function to delete a transaction
function deleteTransaction(index) {
  transactions.splice(index, 1);
  displayTransactions();
  updateBalance();
}

// Function to set the goal amount
function setGoalAmount(e) {
  e.preventDefault();

  const goalInput = document.getElementById('goal-amount');
  goalAmount = parseFloat(goalInput.value);

  goalInput.value = '';

  // Display the goal amount
  const goalDisplay = document.getElementById('goal-display');
  goalDisplay.textContent = goalAmount.toFixed(2);
  const goalContainer = document.getElementById('goal-container');
  goalContainer.style.display = 'block';

  updateProgress();
}

// Function to display bill reminders
function displayBillReminders() {
  const billReminderList = document.getElementById('bill-reminder-list');
  billReminderList.innerHTML = '';
  const billRemindersHeading = document.getElementById('bill-reminders-heading');
  if (billReminders.length) {
    billRemindersHeading.style.display = 'block';
  } else {
    billRemindersHeading.style.display = 'none';
  }
  billReminders.forEach((billReminder, index) => {
    const { id, billName, dueDate } = billReminder;

    const listItem = document.createElement('li');
    listItem.classList.add('bill-reminder-item');

    const reminderText = document.createElement('span');
    reminderText.innerHTML = `<strong>${billName}</strong> - Due on ${formatDate(dueDate)}`;

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.addEventListener('click', () => {
      deleteBillReminder(index);
    });

    listItem.appendChild(reminderText);
    listItem.appendChild(deleteButton);

    billReminderList.appendChild(listItem);
  });

  // Check due dates and display daily reminder
  checkDueDates();

  // Remove expired reminders
  removeExpiredReminders();
}

// Function to check due dates and display daily reminder
function checkDueDates() {
  const currentDate = new Date();
  const reminderMessages = [];

  billReminders.forEach((billReminder) => {
    const dueDate = new Date(billReminder.dueDate);
    const timeDiff = dueDate.getTime() - currentDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff <= 5 && daysDiff > 0) {
      const reminderMessage = `Reminder: Pay ${billReminder.billName} bill in ${daysDiff} day(s)`;
      reminderMessages.push(reminderMessage);
    }
  });

  if (reminderMessages.length > 0) {
    const combinedReminderMessage = reminderMessages.join('<br>');
    displayReminderMessage(combinedReminderMessage);
  }
}


// Function to remove expired reminders
function removeExpiredReminders() {
  const currentDate = new Date();

  billReminders = billReminders.filter((billReminder) => {
    const dueDate = new Date(billReminder.dueDate);
    return dueDate >= currentDate;
  });

  displayBillReminders();
}

// Display reminder message
function displayReminderMessage(message) {
  const reminderText = document.getElementById('reminder-text');
  const reminderMessage = document.getElementById('reminder-message');
  reminderText.innerHTML = message;
  reminderMessage.style.display = 'block';
}

// Close reminder message
function closeReminderMessage() {
  const reminderMessage = document.getElementById('reminder-message');
  reminderMessage.style.display = 'none';
}

// Add event listener to close button
const reminderCloseButton = document.getElementById('reminder-close-button');
reminderCloseButton.addEventListener('click', closeReminderMessage);


// Function to add a new bill reminder
function addBillReminder(e) {
  e.preventDefault();

  const billName = document.getElementById('bill-name').value;
  const dueDate = document.getElementById('due-date').value;

  const newBillReminder = {
    billName: billName,
    dueDate: dueDate
  };

  billReminders.push(newBillReminder);

  displayBillReminders();

  // Clear input fields
  document.getElementById('bill-name').value = '';
  document.getElementById('due-date').value = '';
}

// Function to delete a bill reminder
function deleteBillReminder(index) {
  billReminders.splice(index, 1);
  displayBillReminders();
}

const billReminderForm = document.getElementById('bill-reminder-form');
billReminderForm.addEventListener('submit', addBillReminder);
