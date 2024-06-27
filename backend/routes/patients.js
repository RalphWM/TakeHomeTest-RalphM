const express = require('express');
const patient_router = express.Router();

const sqlite = require('better-sqlite3');
const path = require('path');
const db = new sqlite(path.resolve('internal.db'), {fileMustExist: true});

// Validation routine for Create and Update operations for the patients table
const validate = data => {
    const errors = [];
    if (!data) return ["No Object"];  // Object is empty
    // Check that all fields have been filled out
    if (!data.contact_info) { errors.push("Missing Contact Info"); } 
    if (!data.first_name) { errors.push("Missing First Name"); } 
    if (!data.last_name) { errors.push("Missing Last Name"); } 
    if (!data.state) { errors.push("Missing State"); }
    return errors; // Return list of errors (if any)
};

// Read operation for the patients table
patient_router.get('/', (_, res) => {
    try {
        const query = `SELECT * FROM patients`
        res.json(db.prepare(query).all());
    } catch (err) {
        console.error(err);
    }
});

// Create operation for the patients table
patient_router.post('/create', (req, res) => {
    try {
        // Check new patient's info
        const errors = validate(req.body);
        if (errors.length > 0) { throw new Error(errors.join('\n')); }
        // Add a new patient to the patients table
        const query = `INSERT INTO patients (contact_info, first_name, last_name, state) VALUES (?, ?, ?, ?)`;
        res.json(db.prepare(query).run(req.body.contact_info, req.body.first_name, req.body.last_name, req.body.state));
    } catch (err) {
        console.error(err);
    }
});

// Delete operation for the patients table
patient_router.delete('/delete/:id', (req, res) => {
    try {
        // Delete patient from database based on their internal id
        const query = `DELETE FROM patients WHERE id = ?`;
        return res.json(db.prepare(query).run(req.params.id));
    } catch(err) {
        console.error(err);
    }
});

// Update an existing patient in the patient table
patient_router.put('/update/:id', (req, res) => {
    try {
        // Check updated information to ensure validity
        const errors = validate(req.body);
        if (errors.length > 0) { throw new Error(errors.join('\n')); }
        // Replace existing patient info with new data
        const query = `UPDATE patients SET
                            contact_info = ?
                            first_name = ?
                            last_name = ?
                            state = ?
                       WHERE id = ?`;
        return res.json(db.prepare(query).run(req.body.contact_info, 
                                              req.body.first_name, 
                                              req.body.last_name, 
                                              req.body.state, 
                                              req.params.id));
    } catch(err) {
        console.error(err);
    }
});

module.exports = patient_router;