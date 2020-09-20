import React, { useEffect, useState, useRef } from "react";

//HINT https://github.com/FirebaseExtended/reactfire
import { useUser, useFirestoreCollectionData, useFirestore } from 'reactfire';
import Logout from './Logout';
import 'firebase/auth'

//HINT
import { BrowserRouter as Router, Switch, Route, Link, useParams, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import SendIcon from '@material-ui/icons/Send';
import {TextField, Button, Grid, Typography, Paper, Box, Divider, List, ListItem, ListItemIcon, ListItemText, Avatar, Fab} from "@material-ui/core";


const Chat = () => {

    // TODO: Display messages from chat and submit messages

    // message state
    const [message, setMessage] = useState({
        text: '',
        error: '',
    });

    // onChange function
    const handleChange = e => {
        setMessage({
            ...message,
            [e.target.name]: e.target.value,
            error: '',
        })
    };


    // get user
    const user = useUser();
    // get message collection
    const messageCollection = useFirestore().collection('messages');
    // get message list from firestore
    const messages = useFirestoreCollectionData(messageCollection.orderBy("timestamp"));

    const StoreMessage = async(e) => {
        var dateNow = Date(Date.now()); 
        var date = dateNow.toString()

        //console.log(message)
        
        // construct message
        const sendMessage = { uid: user.uid, name: user.displayName, message: message.text, timestamp: date }
        // add message to collection
        messageCollection.add(sendMessage)
        // clear text field
        document.getElementById('messageField').value = ''
        
        // add latest message to message list
        messages.push(sendMessage)

        // print messages
        //console.log(messages)

    }

    // 
    const listItems = messages.map((msg, index) => 
        <ListItem key={index}>
            <Grid container>
                <ListItemText align={user.uid==msg.uid ? "right" : "left"}>
                    <ListItemIcon>
                        <Avatar alt="Remy Sharp" src="https://material-ui.com/static/images/avatar/1.jpg" />
                        <ListItemText primary={msg.name}></ListItemText>
                    </ListItemIcon>
                    
                </ListItemText>
                
                <Grid item xs={12}>
                    <ListItemText align={user.uid==msg.uid ? "right" : "left"} primary={msg.message}></ListItemText>
                </Grid>
                <Grid item xs={12}>
                    <ListItemText align={user.uid==msg.uid ? "right" : "left"} secondary={msg.timestamp}></ListItemText>
                </Grid>
            </Grid>
        </ListItem>
    );

    const useStyles = makeStyles({
        chatSection: {
          width: '100%',
          height: '80vh',
        },
        messageArea: {
          height: '70vh',
          overflowY: 'auto'
        }
    });

    const classes = useStyles();

    const divRef = useRef(null);

    const scroll = useEffect(() => {
        divRef.current.scrollIntoView({ behavior: 'smooth' });
    });

    return (
        <div>
            <h1>Chat Page</h1>

            <Grid container component={Paper} className={classes.chatSection}>
                
                <Grid item xs={12}>

                    <List className={classes.messageArea}>

                        <Divider />

                        {listItems }
                        <ListItemText ref={divRef}></ListItemText>

                    </List>

                    <Divider />

                    <Grid container style={{padding: '20px'}}>
                        <Grid item xs={11}>
                        <TextField id='messageField' name="text" label="Type Something" onChange={handleChange} fullWidth/>
                        </Grid>
                        <Grid item xs={1} align="right">
                            <Fab color="primary" aria-label="add" onClick={StoreMessage}><SendIcon /></Fab>
                        </Grid>
                    </Grid>

                </Grid>
                
            </Grid>

            <Logout />
        </div>
    )

}

export default Chat;