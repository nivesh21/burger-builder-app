import React, {Component} from 'react';
import Modal from '../../Components/UI/Modal/Modal';
import Auxillary from '../Auxillary';

const withErrorHandler = (WrappedComponent, axiosInstance) => {
    return class extends Component {

        state = {
            error: null
        }

        componentWillMount (){
            this.reqInterceptor = axiosInstance.interceptors.request.use( req => {
                this.setState({error: null});
                return req;
            });
            this.respInterceptor = axiosInstance.interceptors.response.use(  resp => resp, err => {
                this.setState({error: err});
            });
        }

        componentWillUnmount(){
            axiosInstance.interceptors.request.eject(this.reqInterceptor);
            axiosInstance.interceptors.response.eject(this.respInterceptor);
        }

        errorConfirmedHandler = () => {
            this.setState({error: null});
        }

        render (){ 
            return (
                <Auxillary>
                    <Modal show={this.state.error} modalClosed={this.errorConfirmedHandler}>
                        {this.state.error ? this.state.error : null}
                    </Modal>
                    <WrappedComponent {...this.props} />
                </Auxillary>
            );
        }
    }
}

export default withErrorHandler;