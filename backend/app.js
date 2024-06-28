// Setup express
const express = require("express")
const app = express();
app.use(express.json());

// Required to allow browser to load resources from different origin
const cors = require('cors');
app.use(cors());

// Create routes for CRUD operations on the 3 tables
const cliniciansRouter = require('./routes/clinicians');
const patientsRouter = require('./routes/patients');
const appointmentsRouter = require('./routes/appointments');
app.use('/clinicians', cliniciansRouter);
app.use('/patients', patientsRouter);
app.use('/appointments', appointmentsRouter);

// Start listening on port 5001
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log("Port used: ", PORT);
});

module.exports = app;