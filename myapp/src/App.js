import axios from 'axios';  
import { useState, useEffect } from 'react';
import React from 'react';

function App() {
    const SERVER = 'http://127.0.0.1:8000/';

    const [username, setusername] = useState('');
    const [password, setpassword] = useState('');
    const [access, setaccess] = useState('');
    const [decodedUsername, setDecodedUsername] = useState(''); 
    const [staff, setstaff] = useState('')

    const login = () => {
        console.log('Attempting to log in with:', username, password);
        axios.post(SERVER + 'login/', { username, password })
            .then(res => setaccess(res.data.access))
            .catch(error => console.error('Error fetching data:', error));
    };

    const register = () => {
        console.log(username, password)
        axios.post(`${SERVER}register/`, { username, password })
            .then(res => console.log(res.data))
            .catch(error => console.error('Error fetching data:', error));
    }

    const decodeJwt = (token) => {
        if (!token) return null;
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => 
            '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join(''));

        return JSON.parse(jsonPayload);
    };

    useEffect(() => {
        if (access) {
            console.log('Access token:', access);
            localStorage.setItem("Access", access);

            // Decode and log the token
            const decodedToken = decodeJwt(access);

            // Check if decoding was successful
            if (decodedToken) {
                console.log('Decoded token:', decodedToken);

                // Extract and log the username from the token payload
                const { username, staff } = decodedToken;
                console.log('Username from token:', username);
                console.log('Staff from token:', staff);

                // Set the decoded username and staff status in the state
                setDecodedUsername(username);
                setstaff(staff.toString());


            } else {
                console.error('Failed to decode token.');
            }
        }
    }, [access]); // Dependency array - runs when `access` changes

    return (
         <div>
            username: <input type="text" onChange={(e) => setusername(e.target.value)} />
            password: <input type="password" onChange={(e) => setpassword(e.target.value)} />
            <button onClick={()=>login()}>LOGIN</button>
            <button onClick={()=>register()}>REGISTER</button>

            <br/>
            {access && (
                <>
                    <h1>Welcome {decodedUsername} </h1><br/>
                    Is user staff: {staff}
                </>
            )}
        </div>
    );
}

export default App;
