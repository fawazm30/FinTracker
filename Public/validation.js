const form = document.getElementById('form')
const firstname_input = document.getElementById('firstname-input')
const lastname_input = document.getElementById('lastname-input')
const email_input = document.getElementById('email-input')
const password_input = document.getElementById('password-input')
const retypepassword_input = document.getElementById('retypepassword-input')
const errorElement = document.getElementById('error-message')

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

form.addEventListener('submit', (e) => {
    e.preventDefault()
    let errors = []

    if(firstname_input){
        errors = getSignupFormErrors(firstname_input.value, email_input.value, password_input.value, retypepassword_input.value)
    }
    else {
        errors = getLoginFormErrors(email_input.value, password_input.value)
    }

    if(errors.length > 0) {
        errorElement.innerText = errors.join(', ')
    } else {
        form.submit();
    }
})

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

const allInputs = [firstname_input, lastname_input, email_input, password_input, retypepassword_input].filter(input => input !== null);

allInputs.forEach(input => {
    input.addEventListener('input', () => {
        if(input.parentElement.classList.contains('incorrect')){
            input.parentElement.classList.remove('incorrect')
            errorElement.innerText = ''
        }
    })
})