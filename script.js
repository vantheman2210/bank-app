'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
	owner: 'Vanja Martinovic',
	movements: [ 200, 450, -400, 3000, -650, -130, 70, 1300 ],
	interestRate: 1.2, // %
	pin: 1111
};

const account2 = {
	owner: 'Jessica Davis',
	movements: [ 5000, 3400, -150, -790, -3210, -1000, 8500, -30 ],
	interestRate: 1.5,
	pin: 2222
};

const account3 = {
	owner: 'Steven Thomas Williams',
	movements: [ 200, -200, 340, -300, -20, 50, 400, -460 ],
	interestRate: 0.7,
	pin: 3333
};

const account4 = {
	owner: 'Sarah Smith',
	movements: [ 430, 1000, 700, 50, 90 ],
	interestRate: 1,
	pin: 4444
};

const accounts = [ account1, account2, account3, account4 ];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// Displaying movements from and to account
const displayMovements = function(movements) {
	// Same as setting values .textContent = 0
	containerMovements.innerHTML = '';

	movements.forEach((mov, i) => {
		const type = mov > 0 ? 'deposit' : 'withdrawal';

		const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov}€</div>
  </div>
    `;
		containerMovements.insertAdjacentHTML('afterbegin', html);
	});
};

const calcAndDisplayBalance = function(acc) {
	const balance = acc.movements.reduce((acc, curr) => acc + curr, 0);
	acc.balance = balance;
	labelBalance.textContent = `${balance}€`;
};

const calcDisplaySummary = function(acc) {
	const incomes = acc.movements.filter((mov) => mov > 0).reduce((acc, curr) => acc + curr, 0);
	labelSumIn.textContent = `${incomes}€`;

	const out = acc.movements.filter((mov) => mov < 0).reduce((acc, curr) => acc + curr, 0);
	labelSumOut.textContent = `${Math.abs(out)}€`;

	const interest = acc.movements
		.filter((mov) => mov > 0)
		.map((mov) => mov * acc.interestRate / 100)
		.filter((mov) => mov >= 1)
		.reduce((acc, int) => acc + int, 0);
	labelSumInterest.textContent = `${interest}€`;
};

const createUsernames = function(accs) {
	accs.forEach((acc) => {
		acc.username = acc.owner.toLowerCase().split(' ').map((letter) => letter[0]).join('');
	});
};
createUsernames(accounts);

const updateUI = function(acc) {
	// Display movements
	displayMovements(acc.movements);

	// Display Balance
	calcAndDisplayBalance(acc);

	// Display summary
	calcDisplaySummary(acc);
};

// Event handlers
let currentAccount;
btnLogin.addEventListener('click', function(e) {
	// Prevent Submitting
	e.preventDefault();

	currentAccount = accounts.find((acc) => acc.username === inputLoginUsername.value);

	if (currentAccount?.pin === Number(inputLoginPin.value)) {
		// Display UI welcome message
		labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
		containerApp.style.opacity = 100;

		//Clear input files
		inputLoginUsername.value = inputLoginPin.value = '';
		inputLoginPin.blur();

		// UpdateUi
		updateUI(currentAccount);
		console.log('Logged in');
	}
});

btnTransfer.addEventListener('click', function(e) {
	e.preventDefault();
	const amount = Number(inputTransferAmount.value);
	const transferTo = accounts.find((acc) => acc.username === inputTransferTo.value);
	inputTransferAmount.value = '';
	inputTransferTo.value = '';

	if (
		amount > 0 &&
		transferTo &&
		amount <= currentAccount.balance &&
		transferTo.username !== currentAccount.username
	) {
		// Doing transfer
		currentAccount.movements.push(-amount);
		transferTo.movements.push(amount);
		updateUI(currentAccount);
	}
});

btnClose.addEventListener('click', function(e) { 
	e.preventDefault();
	
	// Check conditions if user credentials match current user
	if(currentAccount.username === inputCloseUsername.value && currentAccount.pin === Number(inputClosePin.value)) {
		// Find index
		const index = accounts.findIndex(acc => acc.username === currentAccount.username);

		// Delete account
		accounts.splice(index, 1);

		// Hide UI
		containerApp.style.opacity = 0;
	}
	inputCloseUsername.value = '';
	inputClosePin.value = '';
})
