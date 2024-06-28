// Open the database to use
const sqlite = require('better-sqlite3');
const path = require('path');
const db = new sqlite(path.resolve('internal.db'), {fileMustExist: true});

// Create the clinicians table containing a clinician's NPI, first name, last name, and their state
let query = `CREATE TABLE clinicians (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                npi INTEGER NOT NULL UNIQUE, 
                first_name text NOT NULL, 
                last_name text NOT NULL, 
                state text NOT NULL
            )`;
db.exec(query);
// Populate clinician table with data from https://npiregistry.cms.hhs.gov/demo-api
let data = [
    {npi: 1245960640, first_name: 'RANA', last_name: 'AABED', state: 'CA'},
    {npi: 1588763981, first_name: 'RANDAL', last_name: 'AABERG', state: 'HI'},
    {npi: 1295473189, first_name: 'RANEEN', last_name: 'AALESHAQ', state: 'NE'}
];
let insert = db.prepare("INSERT INTO clinicians (npi, first_name, last_name, state) VALUES (?, ?, ?, ?)");
data.forEach(clinician => {
    insert.run(clinician.npi, clinician.first_name, clinician.last_name, clinician.state);
})

// Create the patients table containing a patient's contact info, first name, last name, and their state
query = `CREATE TABLE patients (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            contact_info text NOT NULL, 
            first_name text NOT NULL, 
            last_name text NOT NULL, 
            state text NOT NULL
        )`;
db.exec(query);
// Populate patients table with mock data
data = [
    {contact_info: "test1@gmail.com", first_name: 'JOHN', last_name: 'DOE', state: 'NY'},
    {contact_info: "1234567890", first_name: 'STEVE', last_name: 'LEE', state: 'DC'},
    {contact_info: "0987654321", first_name: 'MATT', last_name: 'SMITH', state: 'TX'}
];
insert = db.prepare("INSERT INTO patients (contact_info, first_name, last_name, state) VALUES (?, ?, ?, ?)");
data.forEach(patient => {
    insert.run(patient.contact_info, patient.first_name, patient.last_name, patient.state);
})

// Create the appointments table containing an appointment's clinician, patient, its time, status, and any notes
query = `CREATE TABLE appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            clinician_id INTEGER REFERENCES clinicians(id) ON DELETE CASCADE, 
            patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE, 
            time DATETIME NOT NULL, 
            status text NOT NULL, 
            notes text
        )`;
db.exec(query);
// Populate appointments with mock data
data = [
    {clinician_id:1, patient_id:3, time:'2020-10-31 12:00:00', status:'Completed', notes:''},
    {clinician_id:2, patient_id:2, time:'2021-01-01 10:30:00', status:'Cancelled', notes:'Family Emergency'},
    {clinician_id:3, patient_id:1, time:'2022-06-01 08:15:00', status:'Completed', notes:''},
    {clinician_id:1, patient_id:1, time:'2023-02-25 18:00:00', status:'Cancelled', notes:'Absent'},
    {clinician_id:2, patient_id:2, time:'2024-06-20 15:00:00', status:'Completed', notes:''},
    {clinician_id:3, patient_id:3, time:'2024-10-31 12:00:00', status:'Upcoming', notes:''},
    {clinician_id:1, patient_id:2, time:'2025-12-25 00:00:00', status:'Upcoming', notes:''}
];
insert = db.prepare("INSERT INTO appointments (clinician_id, patient_id, time, status, notes) VALUES (?, ?, ?, ?, ?)");
data.forEach(appt => {
    insert.run(appt.clinician_id, appt.patient_id, appt.time, appt.status, appt.notes);
})

// Close connection to database
db.close();