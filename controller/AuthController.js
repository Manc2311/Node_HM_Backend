const express = require('express');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { maskMobile } = require('../utils/helpers');
const db = require('../utils/db');



exports.register = async (req, res) => {

    const { name, dob, mobile, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const maskedMobile = maskMobile(mobile);
    await db.query('INSERT INTO users (name, dob, mobile, password) VALUES (?, ?, ?, ?)', [name, dob, maskedMobile, hashedPassword]);
    res.json({ status: 1 });

}

exports.login = async (req, res) => {

    const { mobile, password } = req.body;

    const [rows] = await db.query('SELECT * FROM users WHERE mobile LIKE ?', [`%${mobile.slice(-3)}`])
    console.log(rows, 'okgot rows');

    if (rows.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    // If more than one user is returned, compare password for each
    let user = null;

    for (const row of rows) {
        const match = await bcrypt.compare(password, row.password);
        if (match) {
            user = row;
            break;
        }
    }

    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const secret = process.env.JWT_SECRET || '5ea7fce3af98ee2959b73fe946c3576de466c45436dbd5e610d5ca16a3026f07fd9224a61d97a39556453e3992c0697a8688a42d8045ecd3c65d43224bce0081';
    const token = jwt.sign({ id: user.id }, secret, { expiresIn: '1h' });
    res.json({ token })
}