const express = require('express');
const app = express();

app.use(express.json());

// Validation middleware
function validateUserData(req, res, next) {
    const { firstName, lastName, password, email, phone } = req.body;
    let errors = [];

    // Validate first name and last name capitalization
    if (!firstName || firstName[0] !== firstName[0].toUpperCase()) {
        errors.push('First name must start with a capital letter.');
    }
    if (!lastName || lastName[0] !== lastName[0].toUpperCase()) {
        errors.push('Last name must start with a capital letter.');
    }

    // Validate password
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!password || !passwordRegex.test(password)) {
        errors.push('Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character.');
    }

    // Validate email
    if (!email || !email.includes('@')) {
        errors.push('Email must contain the "@" symbol.');
    }

    // Validate phone number
    if (!phone || phone.length < 10) {
        errors.push('Phone number must be at least 10 digits long.');
    }

    if (errors.length > 0) {
        const error = new Error(errors.join(' '));
        error.status = 400;
        return next(error);
    }

    next();
}

app.post('/register', validateUserData, (req, res) => {
    // Assuming the data is valid, proceed with registration logic
    res.status(200).send('User registered successfully');
});

// Error handling middleware
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
