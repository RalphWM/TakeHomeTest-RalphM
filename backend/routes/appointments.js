// Setup express
const express = require('express');
const appointment_router = express.Router();

// Open the database to use
const sqlite = require('better-sqlite3');
const path = require('path');
const db = new sqlite(path.resolve('internal.db'), {fileMustExist: true});

// Validation routine for Create and Update operations for the appointments table
const validate = data => {
    const errors = [];
    if (!data) return ["No Object"];  // Object is empty
    if (!data.clinician_id) { errors.push("Missing Clinician ID"); } // Missing clinician id
    if (!data.patient_id) { errors.push("Missing Patient ID"); }  // Missing patient id
    if (isNaN(new Date(data.time))) { errors.push("Invalid Time"); }  // The appointment time is not a valid date
    // The status is not one of the allowed options
    if (!['Completed', 'Cancelled', 'Rescheduled', 'Upcoming'].includes(data.status)) { errors.push("Invalid Status"); }
    return errors; // Return any errors found
};

// Read operations for the appointments table
// Get all data from only the appointments table (patient and clinician names not given)
appointment_router.get('/', (_, res) => {
    try {
        // Get all existing appointments, with patient and clinician ids
        const query = `SELECT * FROM appointments`
        res.json(db.prepare(query).all([]));
    } catch (err) {
        console.error(err);
        return res.json(err);
    }
});
// Get appointment data with patient and clinician names
appointment_router.get('/name', (_, res) => {
    try {
        // Get all existing appointments with patient and clinician names instead of ids
        const query = `SELECT 
                            p.first_name AS p_first_name, 
                            p.last_name AS p_last_name, 
                            c.first_name AS c_first_name, 
                            c.last_name AS c_last_name, 
                            time, status, notes 
                       FROM appointments 
                       JOIN patients p ON patient_id = p.id
                       JOIN clinicians c ON clinician_id = c.id`;
        res.json(db.prepare(query).all());
    } catch (err) {
        console.error(err);
        return res.json(err);
    }
});

// Create operation for the appointments table
appointment_router.post('/create', (req, res) => {
    try {
        // Check that the provided data is valid for an appointment
        const errors = validate(req.body);
        if (errors.length > 0) { throw new Error(errors.join('\n')); }
        // Create a new appointment in the appointments table
        const query = `INSERT INTO appointments (clinician_id, patient_id, time, status, notes) VALUES (?, ?, ?, ?, ?)`;
        res.json(db.prepare(query).run(req.body.npi, req.body.first_name, req.body.last_name, req.body.state));
    } catch (err) {
        console.error(err);
        return res.json(err);
    }
});

// Delete operation for the appointments table
appointment_router.delete('/delete/:id', (req, res) => {
    try {
        // Delete an appointment from database based on their internal id
        const query = `DELETE FROM appointments WHERE id = ?`;
        return res.json(db.prepare(query).run(req.params.id));
    } catch(err) {
        console.error(err);
        return res.json(err);
    }
});

// Update an existing appointment in the appointments table
appointment_router.put('/update/:id', (req, res) => {
    try {
        // Check that the new data is valid
        const errors = validate(req.body);
        if (errors.length > 0) { throw new Error(errors.join('\n')); }
        // Replace existing appointments info with new data
        const query = `UPDATE appointments SET
                            clinician_id = ?
                            patient_id = ?
                            time = ?
                            status = ?
                            notes = ?
                       WHERE id = ?`;
        return res.json(db.prepare(query).run(req.body.clinician_id, 
                                              req.body.patient_id, 
                                              req.body.time, 
                                              req.body.status,
                                              req.body.notes, 
                                              req.params.id));
    } catch(err) {
        console.error(err);
        return res.json(err);
    }
});
  
module.exports = appointment_router;