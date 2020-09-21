import React, { useState } from 'react';
import { useFirebaseApp } from 'reactfire';

import {TextField, Button, Grid, Typography, Box, Avatar, CssBaseline, Link, Container, Divider} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import PetsIcon from '@material-ui/icons/Pets';

const Signup = () => {
    // User State
    const [user, setUser] = useState({
        nickname: '',
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

    // Submit function (Create account)
    const handleSubmit = async(e) => {
        e.preventDefault();
        // Sign up code here.
        await firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
            .then(result => {
                // Update the nickname
                result.user.updateProfile({
                    displayName: user.nickname,
                })

                const myURL = { url: 'http://localhost:3000/' }

                // Send Email Verification and redirect to my website.
                result.user.sendEmailVerification(myURL)
                    .then(() => {
                        setUser({
                            ...user,
                            verifyEmail: `Welcome ${user.nickname}. To continue please verify your email.`,
                        })
                    })
                    .catch(error => {
                        setUser({
                            ...user,
                            error: error.message,
                        })
                    })

                // Sign Out the user.
                firebase.auth().signOut();
            }).catch(error => {
                // Update the error
                setUser({
                    ...user,
                    error: error.message,
                })
            })
    }


    function Copyright() {
        return (
          <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
              Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
          </Typography>
        );
      }
      
    const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    }));

    const classes = useStyles();

    return (
        <>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                    <PetsIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                    Sign up
                    </Typography>
                    <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                        <TextField
                            autoComplete="nickname"
                            name="nickname"
                            variant="outlined"
                            required
                            fullWidth
                            id="nickname"
                            label="Nickname"
                            autoFocus
                            onChange={handleChange}
                        />
                        </Grid>
                        
                        <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            onChange={handleChange}
                        />
                        </Grid>
                        <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={handleChange}
                        />
                        </Grid>
                        <Grid item xs={12}>
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Sign Up
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                        <Link href="/" variant="body2">
                            Already have an account? Log in
                        </Link>
                        </Grid>
                    </Grid>
                    </form>
                    {user.error && <h4>{user.error}</h4>}
                </div>
                <Box mt={5}>
                    <Copyright />
                </Box>
            </Container>
        </>
    )
};

export default Signup;
