import React from 'react';
import { useFirebaseApp } from 'reactfire';
import 'firebase/auth'
import {Button, Grid } from "@material-ui/core";

const Logout = () => {
    // Import firebase
    const firebase = useFirebaseApp();

    // Log out function
    const handleClick = () => {
        firebase.auth().signOut();
    }

    return (
        <>
            <Grid container style={{padding: '10px'}}></Grid>
            <Button variant="contained" color="default" onClick={handleClick} style={{width: '60%'}}>
                Log Out
            </Button>
        </>
    )
};

export default Logout;
