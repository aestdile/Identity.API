// API Base URL
const API_BASE_URL = '/public/v1/auth';

// DOM Elements
const loginForm = document.getElementById('loginForm');
const signUpForm = document.getElementById('signUpForm');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
const dashboard = document.getElementById('dashboard');

// Form Elements
const loginFormElement = document.getElementById('loginFormElement');
const signUpFormElement = document.getElementById('signUpFormElement');
const forgotPasswordFormElement = document.getElementById('forgotPasswordFormElement');

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    // Check if user is already logged in
    const token = localStorage.getItem('accessToken');
    if (token) {
        showDashboard();
    }

    // Add form event listeners
    loginFormElement.addEventListener('submit', handleLogin);
    signUpFormElement.addEventListener('submit', handleSignUp);
    forgotPasswordFormElement.addEventListener('submit', handleForgotPassword);

    // Add input event listeners for real-time validation
    addInputValidation();
});

// Show different forms
function showLogin() {
    hideAllForms();
    loginForm.classList.add('active');
}

function showSignUp() {
    hideAllForms();
    signUpForm.classList.add('active');
}

function showForgotPassword() {
    hideAllForms();
    forgotPasswordForm.classList.add('active');
}

function showDashboard() {
    hideAllForms();
    dashboard.style.display = 'block';
    loadUserInfo();
}

function hideAllForms() {
    loginForm.classList.remove('active');
    signUpForm.classList.remove('active');
    forgotPasswordForm.classList.remove('active');
    dashboard.style.display = 'none';
}

// Handle Login
async function handleLogin(e) {
    e.preventDefault();

    const button = e.target.querySelector('.btn');
    const emailOrUsername = document.getElementById('loginEmailOrUsername').value;
    const password = document.getElementById('loginPassword').value;

    if (!emailOrUsername || !password) {
        showNotification('Barcha maydonlarni to\'ldiring', 'error');
        return;
    }

    setButtonLoading(button, true);

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                emailOrUserName: emailOrUsername,
                password: password
            })
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem('accessToken', data.data.accessToken);
            localStorage.setItem('refreshToken', data.data.refreshToken);
            localStorage.setItem('userInfo', JSON.stringify(data.data.user));

            showNotification(data.message, 'success');
            setTimeout(() => showDashboard(), 1000);
        } else {
            showNotification(data.message, 'error');
        }
    } catch (error) {
        showNotification('Serverga ulanishda xatolik', 'error');
    } finally {
        setButtonLoading(button, false);
    }
}

// Handle Sign Up
async function handleSignUp(e) {
    e.preventDefault();

    const button = e.target.querySelector('.btn');
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        userName: document.getElementById('userName').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmPassword').value
    };

    // Validation
    if (!validateSignUpForm(formData)) {
        return;
    }

    setButtonLoading(button, true);

    try {
        const response = await fetch(`${API_BASE_URL}/sign-up`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem('accessToken', data.data.accessToken);
            localStorage.setItem('refreshToken', data.data.refreshToken);
            localStorage.setItem('userInfo', JSON.stringify(data.data.user));

            showNotification(data.message, 'success');
            setTimeout(() => showDashboard(), 1000);
        } else {
            showNotification(data.message, 'error');
        }
    } catch (error) {
        showNotification('Serverga ulanishda xatolik', 'error');
    } finally {
        setButtonLoading(button, false);
    }
}

// Handle Forgot Password
async function handleForgotPassword(e) {
    e.preventDefault();

    const button = e.target.querySelector('.btn');
    const email = document.getElementById('forgotEmail').value;

    if (!email) {
        showNotification('Email manzilini kiriting', 'error');
        return;
    }

    setButtonLoading(button, true);

    try {
        const response = await fetch(`${API_BASE_URL}/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();
        showNotification(data.message, data.success ? 'success' : 'error');

        if (data.success) {
            setTimeout(() => showLogin(), 2000);
        }
    } catch (error) {
        showNotification('Serverga ulanishda xatolik', 'error');
    } finally {
        setButtonLoading(button, false);
    }
}

// Logout
async function logout() {
    const refreshToken = localStorage.getItem('refreshToken');

    if (refreshToken) {
        try {
            await fetch(`${API_BASE_URL}/log-out`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refreshToken })
            });
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userInfo');

    showNotification('Tizimdan muvaffaqiyatli chiqdingiz', 'info');
    setTimeout(() => showLogin(), 1000);
}

// Load User Info
function loadUserInfo() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

    if (userInfo.firstName) {
        document.getElementById('userFullName').textContent =
            `${userInfo.firstName} ${userInfo.lastName}`;
        document.getElementById('userEmail').textContent = userInfo.email;
        document.getElementById('userPhone').textContent = userInfo.phoneNumber;
    }
}

// Validation Functions
function validateSignUpForm(data) {
    const errors = [];

    if (!data.firstName.trim()) errors.push('Ism kiritish majburiy');
    if (!data.lastName.trim()) errors.push('Familiya kiritish majburiy');
    if (!data.phoneNumber.trim()) errors.push('Telefon raqam kiritish majburiy');
    if (!data.userName.trim()) errors.push('Foydalanuvchi nomi kiritish majburiy');
    if (!data.email.trim()) errors.push('Email kiritish majburiy');
    if (!data.password) errors.push('Parol kiritish majburiy');
    if (data.password !== data.confirmPassword) errors.push('Parollar mos kelmaydi');

    if (!isValidEmail(data.email)) errors.push('Email formati noto\'g\'ri');
    if (data.password.length < 6) errors.push('Parol kamida 6 ta belgidan iborat bo\'lishi kerak');

    if (errors.length > 0) {
        showNotification(errors[0], 'error');
        return false;
    }

    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Input Validation
function addInputValidation() {
    const inputs = document.querySelectorAll('input');

    inputs.forEach(input => {
        input.addEventListener('input', function () {
            validateInput(this);
        });

        input.addEventListener('blur', function () {
            validateInput(this);
        });

        input.addEventListener('focus', function () {
            this.classList.remove('error', 'success');
        });
    });
}

function validateInput(input) {
    const value = input.value.trim();
    let isValid = true;

    switch (input.type) {
        case 'email':
            isValid = isValidEmail(value);
            break;
        case 'password':
            isValid = value.length >= 6;
            break;
        case 'tel':
            isValid = value.length >= 9;
            break;
        default:
            isValid = value.length > 0;
    }

    // Check confirm password
    if (input.id === 'confirmPassword') {
        const password = document.getElementById('password').value;
        isValid = value === password;
    }

    if (value.length > 0) {
        input.classList.toggle('error', !isValid);
        input.classList.toggle('success', isValid);
    } else {
        input.classList.remove('error', 'success');
    }
}

// Password Toggle
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    const icon = button.querySelector('i');

    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Button Loading State
function setButtonLoading(button, loading) {
    if (loading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const icon = notification.querySelector('.notification-icon');
    const messageEl = notification.querySelector('.notification-message');

    // Set icon based on type
    let iconClass = 'fas fa-info-circle';
    if (type === 'success') iconClass = 'fas fa-check-circle';
    if (type === 'error') iconClass = 'fas fa-exclamation-circle';

    icon.className = `notification-icon ${iconClass}`;
    messageEl.textContent = message;

    // Set notification type
    notification.className = `notification ${type}`;

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);

    // Hide notification after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

// Token Refresh (Auto-refresh before expiry)
async function refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
        logout();
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/refresh-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refreshToken })
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem('accessToken', data.data.accessToken);
            localStorage.setItem('refreshToken', data.data.refreshToken);
        } else {
            logout();
        }
    } catch (error) {
        console.error('Token refresh error:', error);
        logout();
    }
}

// Auto-refresh token every 50 minutes
setInterval(refreshToken, 50 * 60 * 1000);

// Handle page visibility change to refresh token when page becomes visible
document.addEventListener('visibilitychange', function () {
    if (!document.hidden && localStorage.getItem('accessToken')) {
        refreshToken();
    }
});