import { useState, useEffect } from 'react';
import axios from 'axios';

const getAppts = async () => {
    let data = [];
    // Use the backend API to get all existing appointments
    await axios.get(`http://localhost:5001/appointments/name`)
                .then(res => { 
                    res.data.forEach(appt => {
                        const keys = Object.keys(appt);  // Get the keys from the json received
                        // Expected keys
                        const fields = ['p_first_name', 
                                        'p_last_name', 
                                        'c_first_name', 
                                        'c_last_name', 
                                        'time', 
                                        'status', 
                                        'notes'
                        ];
                        // If the received keys match the expected keys then add it to the frontend
                        if (JSON.stringify(keys) === JSON.stringify(fields)) data.push(appt);
                    })
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
    const [lower_limit, setLowerLimit] = useState('');
    // Upper limit on appointments, no time after this value
    const [upper_limit, setUpperLimit] = useState('');

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
                <div className='flex-auto text-center text-lg'>
                    {/* Users can pick a date for the lower limit */}
                    <h3 className='font-semibold text-total-life-green'>Lower Limit</h3>
                    <input type="datetime-local" name="lower-limit-time" value={lower_limit} onChange={e => handleLowerLimit(e)} className='text-total-life-green font-semibold' />
                </div>
                <div className='flex-auto text-center total-life-green text-lg'>
                    {/* Users can pick a data for the upper limit */}
                    <h3 className='font-semibold text-total-life-green'>Upper Limit</h3>
                    <input type="datetime-local" name="upper-limit-time" value={upper_limit} onChange={e => handleUpperLimit(e)} className='text-total-life-green font-semibold' />
                </div>
            </div>
            <div className='flex'>
                <table className='flex-auto text-center rounded-lg border-separate border-spacing-2 border-2 border-total-life-green m-4'>
                    <thead>
                        <tr>
                            <th className='bg-total-life-red border-2 border-black'>Clinician</th>
                            <th className='bg-total-life-red border-2 border-black'>Patient</th>
                            <th className='bg-total-life-red border-2 border-black'>Time</th>
                            <th className='bg-total-life-red border-2 border-black'>Status</th>
                            <th className='bg-total-life-red border-2 border-black'>Notes</th>
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
                                    <td className='border-2 border-total-life-green text-total-life-green'>{`${appt.c_last_name}, ${appt.c_first_name}`}</td>
                                    <td className='border-2 border-total-life-green text-total-life-green'>{`${appt.p_last_name}, ${appt.p_first_name}`}</td>
                                    <td className='border-2 border-total-life-green text-total-life-green'>{appt.time}</td>
                                    <td className='border-2 border-total-life-green text-total-life-green'>{appt.status}</td>
                                    <td className='border-2 border-total-life-green text-total-life-green'>{appt.notes}</td>
                                </tr>
                            )
                        }) : null}
                    </tbody>
                </table>
            </div>
        </>
    )
};

export default ListAppt