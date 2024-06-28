# TakeHomeTest-RalphM
Take Home Test by Ralph Milford

# Running Instructions:
### Backend Portion
1. Navigate to the backend folder in the terminal
2. In the backend folder run the command: ```npm install``` to install the backend dependencies
3. To start the backend server run the command: ```npm run start```
4. To stop the server in the terminal hit: ```Ctrl-C``` and then confirm with: ```Y```
### Frontend Portion
1. Navigate to the frontend folder in the terminal
2. In the frontend folder run the command: ```npm install``` to install the frontend dependencies
3. To start the frontend server run the command: ```npm run dev```
4. In your browser go to ```http://localhost:5173``` to see the Appointment table
5. Select a date and time from the Lower Limit section to limit the appointments from before that date
6. Select a date and time from the Upper Limit section to limit hte appointments from after that date
7. To stop the server in the terminal hit: ```Ctrl-C``` and then confirm with: ```Y```

## Database Instructions:
The backend uses an SQLite database located in ```internal.db```
The tables are precreated and already populated with mock data in order to demonstrate the frontend portion
If the database needs to be reset follow these instructions:
1. Navigate to the backend folder in the terminal
2. Delete any remaining tables by running the following command: ```npm run teardown```
3. To recreate and repopulate the database use the following command: ```npm run setup```

## Notes:
If I were to continue working on this project there are a number of areas I would like to expand upon. The first of which would be adding additional functionality to the frontend. Specifically, I would add functionality to leverage the CRUD calls already existing in the backend. This would be creating, updating and deleting from all the tables (clinicians, patients, and appointments). In order to assist that endevour I would also like to further expand on the backend calls. I'd like to create calls that are more specific in regards to both updating and reading. For example, a call to pull only a singular clinician, patient, or appointment. Going back to the frontend I would also like to further expand on the filtering offered in the appointments table. This would include filtering based on clinician, patient, and the appointment's status. Lastly, as this is an internal tool I would like to implement login system to ensure that only authorized users would have access. This would be done to protect the privacy of both clinicians and patients.

## References:
1. “Getting Started.” Vitejs, Vite, vitejs.dev/guide/. Accessed 27 June 2024. 
2. “What Is Sqlite?” SQLite Tutorial, SQLite Tutorial, 11 Apr. 2024, www.sqlitetutorial.net/what-is-sqlite/. 
3. Curry, Caleb. “SQLite3 in Node with Better-Sqlite3.” YouTube, YouTube, 12 Jan. 2024, www.youtube.com/watch?v=IooIXYf0PIo. 
4. “Install Tailwind CSS with Vite.” Tailwind CSS, Tailwind Labs Inc., tailwindcss.com/docs/guides/vite. Accessed 27 June 2024. 
5. Hobson, Jacob. “REACT: Axios Network Error.” Stack Overflow, Stack Overflow, 1 Mar. 1963, stackoverflow.com/questions/45980173/react-axios-network-error. 