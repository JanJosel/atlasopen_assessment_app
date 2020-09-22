import React from 'react';
import { useFirebaseApp } from 'reactfire';
import 'firebase/auth'
import {Grid, Fab } from "@material-ui/core";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const Logout = () => {
    // Import firebase
    const firebase = useFirebaseApp();

    // Log out function
    const handleClick = () => {
        firebase.auth().signOut();
    }

    return (
        <>
            <Grid item xs={8} align="right">
                <Fab color="secondary" aria-label="exit" onClick={handleClick}><ExitToAppIcon /></Fab>
            </Grid>
        </>
    )
};

export default Logout;
