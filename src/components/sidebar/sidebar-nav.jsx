import React from 'react';
import { Route } from 'react-router-dom';
import SidebarNavList from './sidebar-nav-list.jsx';
import menus from './menu.jsx';

class SidebarNav extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			active: -1,
			clicked: -1
		};
	}

	handleExpand(e, i, match) {
		e.preventDefault();

		if (this.state.clicked === -1 && match) {
			this.setState(state => ({
				active: -1,
				clicked: 1
			}));
		} else {
			this.setState(state => ({
				active: (this.state.active === i ? -1 : i),
				clicked: 1
			}));
		}
	}
  
	render() {
		return (
			<ul className="nav">
				<li className="nav-header">Navigation</li>
				{menus.map((menu, i) => (
					<Route path={menu.path} exact={menu.exact} key={i} children={({ match }) => (
						<SidebarNavList
							data={menu} 
							key={i} 
							expand={(e) => this.handleExpand(e, i, match)}
							active={i === this.state.active} 
							clicked={this.state.clicked}
						/>
					)} />
				))}
			</ul>
		);
	}
}

export default SidebarNav;