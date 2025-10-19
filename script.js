// Simulate user data - stored in localStorage for persistence
let users = JSON.parse(localStorage.getItem('users')) || [];
let loggedInUser = localStorage.getItem('loggedInUser') || null;
let selectedLoan = localStorage.getItem('selectedLoan') || null;

// Register form handler
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            if (users.find(user => user.username === username)) {
                alert('Username already exists');
                return;
            }
            users.push({ username, phone, password });
            localStorage.setItem('users', JSON.stringify(users));
            alert('Registration successful! Please login.');
            window.location.href = 'login.html';
        });
    }

    // Login form handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const user = users.find(u => u.username === username && u.password === password);
            if (user) {
                loggedInUser = username;
                localStorage.setItem('loggedInUser', username);
                window.location.href = 'loans.html';
            } else {
                alert('Invalid credentials');
            }
        });
    }

    // Loan selection
    const loanBtns = document.querySelectorAll('.loan-btn');
    loanBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            selectedLoan = this.getAttribute('data-loan');
            localStorage.setItem('selectedLoan', selectedLoan);
            window.location.href = 'payment.html';
        });
    });

    // Back buttons
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.location.href = 'login.html';
        });
    }

    const backToLoansBtn = document.getElementById('backToLoansBtn');
    if (backToLoansBtn) {
        backToLoansBtn.addEventListener('click', function() {
            window.location.href = 'loans.html';
        });
    }

    // Payment page
    if (window.location.pathname.includes('payment.html')) {
        const verificationAmountEl = document.getElementById('verificationAmount');
        const proceedBtn = document.getElementById('proceedBtn');
        if (verificationAmountEl && selectedLoan) {
            let amount = 0;
            if (selectedLoan === 'personal') amount = 50000;
            else if (selectedLoan === 'business') amount = 500000;
            else if (selectedLoan === 'home') amount = 1000000;
            const verificationFee = amount * 0.01;
            verificationAmountEl.textContent = `Ksh ${verificationFee.toLocaleString()}`;
        }
        if (proceedBtn) {
            proceedBtn.addEventListener('click', function() {
                window.location.href = 'validate.html';
            });
        }
    }

    // Validation result
    if (window.location.pathname.includes('validate.html')) {
        const resultDiv = document.getElementById('result');
        if (loggedInUser && selectedLoan) {
            // Simulate validation
            const isValid = Math.random() > 0.3; // 70% chance of approval
            if (isValid) {
                resultDiv.innerHTML = `
                    <div class="alert alert-success">
                        <h4>Congratulations!</h4>
                        <p>You are eligible for the ${selectedLoan} loan.</p>
                    </div>
                `;
            } else {
                resultDiv.innerHTML = `
                    <div class="alert alert-danger">
                        <h4>Sorry!</h4>
                        <p>You are not eligible for the ${selectedLoan} loan at this time.</p>
                    </div>
                `;
            }
        } else {
            resultDiv.innerHTML = '<div class="alert alert-warning">Please login and select a loan first.</div>';
        }
    }
});
