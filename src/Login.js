import React, { useState, Component } from 'react';
import { useFirebaseApp, } from 'reactfire';
import 'firebase/auth'
import './Signup.css';

import {TextField, Button, Grid, Typography, Box, Avatar, CssBaseline, Link, Container, Divider} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import PetsIcon from '@material-ui/icons/Pets';



function Copyright() {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="/">
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
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));


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

    // use styles
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
                    Log in
                    </Typography>
                    <form className={classes.form} onSubmit={handleSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={handleChange}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={handleChange}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        size="large"
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Log In
                    </Button>
                    
                    
                    
                    <Divider />
                    <Grid container style={{padding: '10px'}}></Grid>
                    <Button variant="contained" color="default" href="/signup" style={{width: '60%'}}>
                        Sign up, woof!
                    </Button>

                    </form>
                    {user.error && <h4>{user.error}</h4>}

                </div>
                <Box mt={8}>
                    <Copyright />
                </Box>
            </Container>
            
        </>
    )
};

export default Login;
