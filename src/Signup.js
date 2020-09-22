import React, { useState, useEffect } from 'react';
import { useFirebaseApp, useFirestoreCollectionData, useFirestore } from 'reactfire';
import { useHistory, Link } from "react-router-dom";

import {TextField, Button, Grid, Typography, Box, Avatar, CssBaseline, Container, Divider} from "@material-ui/core";
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
    
    // Dog avatar state
    const [dogAvatar, setDogAvatar] = useState({
        url: '',
    });

    // Fetch url
    function fetchDogAvatar() {
    fetch("https://random.dog/woof.json")
        .then(response => response.json())
        .then(json => setDogAvatar({url: json.url}));
    }

    useEffect(() => {
        fetchDogAvatar();
    }, []);


    // Import firebase
    const firebase = useFirebaseApp();
    // get user collection
    const userCollection = useFirestore().collection('users');

    const history = useHistory();

    // Submit function (Create account)
    const handleSubmit = async(e) => {
        
        e.preventDefault();
        // Sign up code here.
        await firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
            .then(result => {
                // Update the nickname
                result.user.updateProfile({
                    displayName: user.nickname,
                    photoURL: dogAvatar.url
                }).then(function() {
                    // Update successful, now add user collection
                    const user = JSON.parse( JSON.stringify(result.user)) 
                    // construct user info
                    const userInfo = { uid: user.uid, name: user.displayName }
                    // add user info to collection
                    userCollection.add(userInfo)
                })

                // Send Email Verification and redirect to my website.
                result.user.sendEmailVerification()
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
                // Redirect to login page
                history.push("/");
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
            <Link color="inherit" to="/">
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
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
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
                        
                        <Grid item xs={12} style={{ justifyContent: "center", display: "flex" }}>
                            <Avatar alt="dog avatar" className={classes.large} src={dogAvatar.url}/>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                color="default"
                                onClick={fetchDogAvatar}
                                >
                                    Change Avatar
                            </Button>
                        </Grid>

                    </Grid>
                    
                    <Grid container style={{padding: '10px'}}></Grid>

                    <Divider/>
                    

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
                        <Link to="/" variant="body2">
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
