const express = require('express');
const clinician_router = express.Router();

const axios = require('axios');

const sqlite = require('better-sqlite3');
const path = require('path');
const db = new sqlite(path.resolve('internal.db'), {fileMustExist: true});

// Validation routine for Create and Update operations for the clinicians table
const validate = async data => {
    const errors = [];
    if (!data) return ["No Object"];  // Object is empty
    // Check for valid NPI
    if (!data.npi) return ["Missing NPI"];
    // Check that clinician's npi against inputted data
    await axios.get(`https://npiregistry.cms.hhs.gov/api/?version=2.1&number=${data.npi}`)
                .then(res => {
                    if (res.data[0].first_name != data.first_name) { errors.push("Incorrect First Name"); }
                    if (res.data[0].last_name != data.last_name) { errors.push("Incorrect Last Name"); }
                    if (res.data[0].state != data.state) { errors.push("Incorrect State"); }
                    return errors; // Return list of errors (if any)
                })
                .catch(err => {
                    errors.push(err);
                    return errors; // Return error
                });
};

// Read operation for the clinicians table
clinician_router.get('/', (_, res) => {
    try {
        // SQLite query to get all existing clinicians
        const query = `SELECT * FROM clinicians`
        res.json(db.prepare(query).all());
    } catch (err) {
        console.error(err);
    }
});

// Create operation for the clinician table
clinician_router.post('/create', (req, res) => {
    try {
        // Check that new clinician data is correct
        const errors = validate(req.body);
        if (errors.length > 0) { throw new Error(errors.join('\n')); }
        // SQLite query to add new clinician
        const query = `INSERT INTO clinicians (npi, first_name, last_name, state) VALUES (?, ?, ?, ?)`;
        return res.json(db.prepare(query).run(req.body.npi, req.body.first_name, req.body.last_name, req.body.state));
    } catch (err) {
        console.error(err);
    }
});

// Delete operation for the clinician table
clinician_router.delete('/delete/:id', (req, res) => {
    try {
        // Delete clinician from database based on their internal id
        const query = `DELETE FROM clinicians WHERE id = ?`;
        return res.json(db.prepare(query).run(req.params.id));
    } catch(err) {
        console.error(err);
    }
});

// Update an existing clinician in the clinician table
clinician_router.put('/update/:id', (req, res) => {
    try {
        // Check that updated data is still valid
        const errors = validate(req.body);
        if (errors.length > 0) { throw new Error(errors.join('\n')); }
        // Replace existing clinician info with new data
        const query = `UPDATE clinicians SET
                            npi = ?
                            first_name = ?
                            last_name = ?
                            state = ?
                       WHERE id = ?`;
        return res.json(db.prepare(query).run(req.body.npi, 
                                              req.body.first_name, 
                                              req.body.last_name, 
                                              req.body.state, 
                                              req.params.id));
    } catch(err) {
        console.error(err);
    }
});
  
module.exports = clinician_router;