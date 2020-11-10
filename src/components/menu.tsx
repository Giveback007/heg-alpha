import './menu.sass'
import * as React from 'react';
import { store } from '../store';

const menuItems = [
    {
        name: 'Toggle Graph',
        function: () => store.setState({ showGraph: !store.getState().showGraph })
    }
];

type S = {
    showMenu: boolean;
}

export class Menu extends React.Component<S> {
    state: S = {
        showMenu: false,
    }

    toggleMenu = () => this.setState({ showMenu: !this.state.showMenu });

    render(s = this.state) {
        return <>

            <div
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
            </div>

        </>
    }
}