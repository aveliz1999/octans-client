import React, {useContext, useEffect, useState} from 'react';
import styles from './Login.module.css';
import axios from 'axios';
import {UserContext} from "../../context/User";
import {Redirect} from "react-router-dom";

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useContext(UserContext);

    async function login() {
        const response = await axios.post('/api/users/login', {
            username,
            password
        });
        setUser?.(response.data);
    }

    if(user) {
        return <Redirect to="/"/>
    }

    return <div className={styles.container}>
        <input className={styles.input} placeholder="Username" value={username} onChange={e => setUsername(e.target.value)}/>
        <input className={styles.input} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}/>
        <button className={styles.submit} onClick={login}>Log In</button>
    </div>
}