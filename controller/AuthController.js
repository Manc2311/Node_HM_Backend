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

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.json({ token })
}