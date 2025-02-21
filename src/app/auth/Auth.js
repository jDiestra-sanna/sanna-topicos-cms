import * as userActions from 'app/auth/store/actions';
import jwtService from 'app/services/jwtService';
import * as Actions from 'app/store/actions';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Splash from '../../widgets/Splash';
import Util, {setUser} from '../../inc/Utils';
import WError from '../../widgets/WError';

class Auth extends Component {
    state = {
        pendingVerify: true,
        error        : null
    };

    componentDidMount() {
        jwtService.on('onAutoLogin', this.onAutoLogin);
        jwtService.on('onSetup', this.onSetup);
        this.setup();
    }

    setup = () => {
        jwtService.init();
    };

    onAutoLogin = user => {
        this.setState({
            pendingVerify: true,
            error        : null
        });

        if (user == null || user.data == null) {
            jwtService.signInWithToken()
                .then(user => {
                    this.props.setUserData(user);
                    this.props.setNavigation(user.menu);
                    setUser(user);
                    Util.setupBasic(user);
                    this.setState({pendingVerify: false});

                })
                .catch(error => {
                    this.setState({
                        pendingVerify: false,
                        error        : error || 'Se produjo un error'
                    });
                });
        } else {
            this.props.setUserData(user);
            this.props.setNavigation(user.menu);
            setUser(user);
            this.setState({pendingVerify: false});

            jwtService.signInWithToken()
                .then(user => {
                    this.props.setUserData(user);
                    this.props.setNavigation(user.menu);
                    setUser(user);
                    Util.setupBasic(user);
                })
                .catch(error => {
                    this.setState({
                        pendingVerify: false,
                        error        : error || 'Se produjo un error'
                    });
                });
        }
    };

    onSetup = () => {
        this.setup();
    };

    render() {
        return this.state.pendingVerify
            ? <Splash/>
            : this.state.error
                ? <WError error={this.state.error} onRetry={() => this.setup()}/>
                : <>{this.props.children}</>;
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            logout             : userActions.logoutUser,
            setUserData        : userActions.setUserData,
            showMessage        : Actions.showMessage,
            hideMessage        : Actions.hideMessage,
            setNavigation      : Actions.setNavigation
        },
        dispatch
    );
}

export default connect(null, mapDispatchToProps)(Auth);
