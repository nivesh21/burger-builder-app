import React, {Component} from 'react';
import Auxillary from '../../Hoc/Auxillary';
import SideDrawer from '../Navigation/SideDrawer/SideDrawer';
import Toolbar from '../Navigation/Toolbar/Toolbar';
import classes from './layout.module.css';

class Layout extends Component {
    state = {
        showSideDrawer : false
    }

    sideDrawerClosedHandler = () => {
        this.setState({showSideDrawer : false})
    }

    sideDrawerOpenHandler = () => {
        this.setState({showSideDrawer : true})
    }
    
    render(){
        return (<Auxillary>
            <Toolbar toogleSideDrawer={this.sideDrawerOpenHandler}/>
            <SideDrawer open={this.state.showSideDrawer} closed={this.sideDrawerClosedHandler}/>
            <main className={classes.Content}>{this.props.children}</main>
        </Auxillary>);
    }
};

export default Layout;