import './applets.sass'
import React, { Component } from 'react';
import { Card, CardActionArea, CardHeader, CardMedia, Grid } from '../material-ui';
import { linker, State, store } from '../../store';

import circleJPG from './circle.jpg';
import earthJPG from './earth.jpg';
import textJPG from './text.jpg';
import videoJPG from './video.jpg';

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

type S = { };
type P = { } & ReturnType<typeof link>;

class _AppletsMenu extends React.Component<P, S> {
    
    render(p = this.props) {

        const appletsElms = applets.map(({ icon, name }, i) =>
            <Grid item key={i}><Card>
                <CardActionArea>
                    <CardMedia image={icon}/>
                    <CardHeader title={name} />
                </CardActionArea>
            </Card></Grid>
        );

        return (p.showApplets ? <>
            <div
                id="applets-background"
                onClick={() => store.setState({ showApplets: false })}
            ></div>
            <div id="applets">
                <Grid
                    container
                    justify="center"
                >{appletsElms}</Grid>
            </div>
        </> : null)
    }
}

const link = (s: State) => ({ showApplets: s.showApplets });
export const AppletsMenu = linker(link, _AppletsMenu);
