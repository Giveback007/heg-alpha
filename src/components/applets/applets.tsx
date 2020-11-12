import './applets.sass'
import React = require('react');
import { Component } from 'react'
import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography } from '@material-ui/core';
import { store } from '../../store';

const circleJPG = require('./circle.jpg');
const earthJPG  = require('./earth.jpg');
const textJPG   = require('./text.jpg');
const videoJPG  = require('./video.jpg');

type appletMetadata = {
    element: Component | JSX.Element;
    name: string;
    icon: string;
}

const applets: appletMetadata[] = [{
    element: <div></div>,
    name: 'Circle',
    icon: circleJPG,
}, {
    element: <div></div>,
    name: 'Earth',
    icon: earthJPG,
}, {
    element: <div></div>,
    name: 'Text',
    icon: textJPG,
}, {
    element: <div></div>,
    name: 'Video',
    icon: videoJPG,
}];

type S = {
    showApplets: boolean,
    applets: appletMetadata[]
}

export class AppletsMenu extends React.Component<{}, S> {
    state = {
        showApplets: false,
        applets
    }

    sub: any;

    componentDidMount() {
        this.sub = store.subscribe(({ showApplets }) => this.setState({ showApplets }))
    }

    componentWillUnmount() {
        this.sub.unsubscribe();
    }

    render(s = this.state) {

        const applets = s.applets.map(({ icon, name }, i) => (
            <Grid item key={i}>
                <Card style={{ width: 200 }}>
                    <CardActionArea>
                        {/* <CardHeader title={} /> */}
                        <CardMedia
                            // className={classes.media}
                            style={{height: 100}}
                            image={icon}
                        />
                        
                        <CardContent>
                            <Typography gutterBottom component="h2">{name}</Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
             </Grid>
        ))

        return (s.showApplets ? <>
            <div
                id="applets-background"
                onClick={() => store.setState({ showApplets: false })}
            ></div>
            <div id="applets">
                <Grid
                    container
                    spacing={3}
                    justify="center"
                >{applets}</Grid>
            </div>
        </> : null)
    }
}