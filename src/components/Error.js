import React, { useState, useEffect, useRef } from "react"
import Grid from '@material-ui/core/Grid';
import { connect } from "react-redux"
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
const useStyles = makeStyles({
    root: {
      minWidth: 275,
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
  });
  
//need to pass playingEp as props from player
const Error = (props) => {
    const classes = useStyles();
return(
    <Grid
    container
    spacing={0}
    direction="column"
    alignItems="center"
    justify="center"
    style={{ minHeight: '100vh' }}
    >
    <Grid item xs={3}>
    <Card className={classes.root}>
        <CardContent>
        <Typography variant="body1" component="p">
        Sorry! this application is only available to users 
        with premium accounts.</Typography>
        <a href={"https://www.spotify.com/us/premium/"}>Get Spotify Premium</a>
        <Typography variant="body1" component="p">We hope to see you soon!
        </Typography>
        </CardContent>
    </Card>
    </Grid>
    </Grid>
  )
}

export default Error
