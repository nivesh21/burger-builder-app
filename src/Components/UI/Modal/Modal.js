import React, {Component} from 'react';
import classes from './Modal.module.css';
import Auxillary from '../../../Hoc/Auxillary';
import Backdrop from '../Backdrop/Backdrop';
class Modal extends Component {

    shouldComponentUpdate ( nextProps, nextState) {
        return nextProps.show !== this.props.show || nextProps.children !== this.props.children;
    }
    render () {
        const styled = {
            transform: this.props.show ? 'translateY(0)': 'translateY(-100vh)',
            opacity: this.props.show ? '1': '0'
        };

        return (
            <Auxillary>
                <Backdrop show={this.props.show} closed={this.props.modalClosed}/>
                <div className={classes.Modal}
                    style={styled}
                    > {this.props.children}
                </div>
            </Auxillary>
        );
    }
}

export default Modal;