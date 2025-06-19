const form = document.getElementById('form')
const firstname_input = document.getElementById('firstname-input')
const lastname_input = document.getElementById('lastname-input')
const email_input = document.getElementById('email-input')
const password_input = document.getElementById('password-input')
const retypepassword_input = document.getElementById('retypepassword-input')
const errorElement = document.getElementById('error-message')

// Check if the form is for signup or login
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// If firstname_input exists, it's a signup form; otherwise, it's a login form
form.addEventListener('submit', (e) => {
    e.preventDefault()
    let errors = []

    if(firstname_input){
        errors = getSignupFormErrors(firstname_input.value, email_input.value, password_input.value, retypepassword_input.value)
    }
    else { // It's a login form
        errors = getLoginFormErrors(email_input.value, password_input.value)
    }

    // Clear previous error messages
    if(errors.length > 0) {
        errorElement.innerText = errors.join(', ')
    } else {
        form.submit();
    }
})

// Function to validate the signup form
function getSignupFormErrors(firstname, email, password, retypepassword) {
    let errors = []

    allInputs.forEach(input => {
        input.parentElement.classList.remove('incorrect');
    });

    if (firstname === '' || firstname === null) {
        errors.push('First name is required')
        firstname_input.parentElement.classList.add('incorrect')
    }

    if (email === '' || email === null) {
        errors.push('Email is required')
        email_input.parentElement.classList.add('incorrect')
    } else if (!isValidEmail(email)) {
        errors.push('Email is not valid')
    }

    if (password === '' || password === null) {
        errors.push('Password is required')
        password_input.parentElement.classList.add('incorrect')
    }
    if(password.length < 8) {
        errors.push('Password must be at least 8 characters long')
        password_input.parentElement.classList.add('incorrect')
    }
    if(password !== retypepassword) {
        errors.push('Passwords do not match')
        password_input.parentElement.classList.add('incorrect')
        retypepassword_input.parentElement.classList.add('incorrect')
    }

    return errors
}

// Function to validate the login form
function getLoginFormErrors(email, password) {
    let errors = []

    if (email === '' || email === null) {
        errors.push('Email is required')
        email_input.parentElement.classList.add('incorrect')
    } else if (!isValidEmail(email)) {
        errors.push('Email is not valid')
    }

    if (password === '' || password === null) {
        errors.push('Password is required')
        password_input.parentElement.classList.add('incorrect')
    }

    return errors;
}

// Add event listeners to clear error messages on input
const allInputs = [firstname_input, lastname_input, email_input, password_input, retypepassword_input].filter(input => input !== null);

// Clear error messages when user types in any input field
allInputs.forEach(input => {
    input.addEventListener('input', () => {
        if(input.parentElement.classList.contains('incorrect')){
            input.parentElement.classList.remove('incorrect')
            errorElement.innerText = ''
        }
    })
})