import React, { useState, Component } from 'react';
import { useFirebaseApp, } from 'reactfire';
import 'firebase/auth'
import './Signup.css';


//TODO convert this to a functional component to use firebase hooks
const Login = () => {

    // User State
    const [user, setUser] = useState({
        email: '',
        password: '',
        error: '',
    });

    // onChange function
    const handleChange = e => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
            error: '',
        })
    };

    // Import firebase
    const firebase = useFirebaseApp();

    const handleSubmit = async(e) => {
        e.preventDefault();
        firebase.auth().signInWithEmailAndPassword(user.email, user.password)
            .then(result => {
                // user's email not verified
                if (!result.user.emailVerified) {
                    setUser({
                        ...user,
                        error: 'Please verify your email before to continue',
                    })
                    alert('Please verify your email first!')
                    firebase.auth().signOut();
                }
            })
            .catch(error => {
                // Update the error
                setUser({
                    ...user,
                    error: error.message,
                })
            })
    }

    return (
        <>
            <h1>Log In</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Email" name="email" onChange={handleChange}/><br />
                <input type="password" placeholder="Password" name="password" onChange={handleChange}/><br />
                <button type="submit">Log in</button>
            </form>
            {user.error && <h4>{user.error}</h4>}
        </>
    )
};

export default Login;
