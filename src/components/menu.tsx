import './menu.sass'
import React = require('react');
import { store } from '../store';
import { AppBar, Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Toolbar } from '@material-ui/core';
import { AppsIcon, ChevronLeftIcon, InboxIcon, MailIcon, MenuIcon, ShowChartIcon } from './icons';

// const useStyles = withStyles((theme: Theme) =>
//   createStyles({
//     grow: {
//       flexGrow: 1,
//     },
//     menuButton: {
//       marginRight: theme.spacing(2),
//     },
//     sectionDesktop: {
//       display: 'none',
//       [theme.breakpoints.up('md')]: {
//         display: 'flex',
//       },
//     },
//     sectionMobile: {
//       display: 'flex',
//       [theme.breakpoints.up('md')]: {
//         display: 'none',
//       },
//     },
//   }),
// );

// const classes = useStyles();

const menuItems = [
    {
        name: 'Toggle Graph',
        function: () => store.setState({ showGraph: !store.getState().showGraph })
    }
];

// const classes = useStyles();

type S = {
    showMenu: boolean;
}

export class MenuApp extends React.Component<{}, S> {
    state: S = {
        showMenu: false,
    }

    toggleMenu = () => this.setState({ showMenu: !this.state.showMenu });

    render(s = this.state) {
        return <>

            {/* <div
                id="menu-open"
                className="menu-icon"
                onClick={this.toggleMenu}
            ><i className="material-icons">menu</i></div>

            <div id="menu" className={s.showMenu ? "" : "hide"}>
                <div id="menu-header">
                    <h2>HEG alpha</h2>
                    <div
                        id="menu-close"
                        className="menu-icon"
                        onClick={this.toggleMenu}
                    ><i className="material-icons">close</i></div>
                </div>
            </div> */}

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
                            onClick={() => store.setState({ showGraph: !store.getState().showGraph })}
                        >
                            <ShowChartIcon />
                        </IconButton>
                        <IconButton
                                edge="end"
                                // aria-label="account of current user"
                                // aria-controls={menuId}
                                aria-haspopup="true"
                                onClick={() => store.setState({ showApplets: !store.getState().showApplets })}
                                // color="inherit"
                            >
                                <AppsIcon />
                        </IconButton>

                    </div>
                </Toolbar>

                {/* <div>

                    <IconButton
                        edge="end"
                        // aria-label="account of current user"
                        // aria-controls={menuId}
                        aria-haspopup="true"
                        // onClick={handleProfileMenuOpen}
                        // color="inherit"
                    >
                        <AppsIcon />
                    </IconButton>
                </div> */}
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