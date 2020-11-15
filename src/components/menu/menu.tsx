import './menu.sass'
import React = require('react');
import { heg, store } from '../../store';
import { AppBar, Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Toolbar } from '@material-ui/core';
import { AppsIcon, BluetoothIcon, ChevronLeftIcon, InboxIcon, MailIcon, MenuIcon, RefreshIcon, ShowChartIcon } from '../icons';

const menuItems = [
    {
        name: 'Toggle Graph',
        function: () => store.setState({ showGraph: !store.getState().showGraph })
    }
];

type S = {
    showMenu: boolean;
}

export class MenuApp extends React.Component<{}, S> {
    state: S = {
        showMenu: false,
    }

    toggleMenu = () => this.setState({ showMenu: !this.state.showMenu });

    async btConnect() {
        await heg.connect();
        heg.startReadingHEG();
    
        heg.subscribe(({ lastVal }) => {
            console.clear();
            console.log(lastVal);
        });
    }

    render(s = this.state) {
        return <>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={this.toggleMenu}
                    > <MenuIcon /> </IconButton>

                    <div>
                        <IconButton
                            color="inherit"
                        >
                            <RefreshIcon />
                        </IconButton>
                        <IconButton
                            color="inherit"
                            onClick={this.btConnect}
                        >
                            <BluetoothIcon />
                        </IconButton>
                        <IconButton
                            color="inherit"
                            onClick={() => store.setState({ showGraph: !store.getState().showGraph })}
                        >
                            <ShowChartIcon />
                        </IconButton>
                        <IconButton
                                edge="end"
                                aria-haspopup="true"
                                onClick={() => store.setState({ showApplets: !store.getState().showApplets })}
                                color="inherit"
                            >
                                <AppsIcon />
                        </IconButton>

                    </div>
                </Toolbar>
            </AppBar>

            <Drawer
                anchor='left'
                open={s.showMenu}
                onClose={this.toggleMenu}
            >
                <div>
                    <IconButton onClick={this.toggleMenu}>
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <ListItem button>
                        <ListItemIcon><InboxIcon /></ListItemIcon>
                        <ListItemText primary="Item 1" />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon><MailIcon /></ListItemIcon>
                        <ListItemText primary="Item 2" />
                    </ListItem>
                </List>
            </Drawer>

        </>
    }
}