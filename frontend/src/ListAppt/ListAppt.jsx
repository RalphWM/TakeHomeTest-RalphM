import { useState, useEffect } from 'react';
import axios from 'axios';

const getAppts = async () => {
    let data = [];
    // Use the backend API to get all existing appointments
    await axios.get(`http://localhost:5001/appointments/name`)
                .then(res => { 
                    data = [...res.data];  // Pull the data from the response
                })
                // Catch any errors the backend might send back
                .catch(err => {
                    console.error(err)
                    return [];
                });
    return data;
}

const ListAppt = (props) => {
    const [list, setList] = useState([]);
    // Lower limit on appointments, no time before this value 
    const [lower_limit, setLowerLimit] = useState();
    // Upper limit on appointments, no time after this value
    const [upper_limit, setUpperLimit] = useState();

    // Update the lower limit with select value
    const handleLowerLimit = e => {
        setLowerLimit(() => e.target.value);
    }

    // Update the upper limit with selected value
    const handleUpperLimit = e => {
        setUpperLimit(() => e.target.value);
    };

    useEffect(() => {
        // Get all the appointments from the backend
        const retrieve = async () => {
            const response = await getAppts();
            setList(() => response);  // Update the list of appointments
        }
        retrieve();
    }, []);

    return (
        <>
            <div className='flex'>
                <div>
                    {/* Users can pick a date for the lower limit */}
                    <h3>Lower Limit</h3>
                    <input type="datetime-local" name="lower-limit-time" value={lower_limit} onChange={e => handleLowerLimit(e)} />
                </div>
                <div>
                    {/* Users can pick a data for the upper limit */}
                    <h3>Upper Limit</h3>
                    <input type="datetime-local" name="upper-limit-time" value={upper_limit} onChange={e => handleUpperLimit(e)} />
                </div>
            </div>
            <table className='w-screen text-center'>
                <thead>
                    <tr>
                        <th>Clinician</th>
                        <th>Patient</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th>Notes</th>
                    </tr>
                </thead>
                <tbody>
                    {(list.length > 0) ? list.map((appt, index) => {
                        // Skip over appointments that happened before the lower limit
                        if (typeof(lower_limit) != undefined && (new Date(appt.time)).getTime() - (new Date(lower_limit)).getTime() < 0) return null;
                        // Skip over appointments that happen after the upper limit
                        if (typeof(upper_limit) != undefined && (new Date(appt.time)).getTime() - (new Date(upper_limit)).getTime() > 0) return null;
                        // Print the remaining appointments to the table
                        return (
                            <tr key={index}>
                                <td>{`${appt.c_last_name}, ${appt.c_first_name}`}</td>
                                <td>{`${appt.p_last_name}, ${appt.p_first_name}`}</td>
                                <td>{appt.time}</td>
                                <td>{appt.status}</td>
                                <td>{appt.notes}</td>
                            </tr>
                        )
                    }) : null}
                </tbody>
            </table>
        </>
    )
};

export default ListAppt