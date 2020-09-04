import React from 'react';
import { connect } from 'react-redux';
import {onFetchError, setToken} from "../../utils/dataAccess";
import PropTypes from 'prop-types';
import {forgetToken} from "../../actions/login";
import { withRouter } from 'react-router-dom';

/** Forwards the user to the login page if unauthenticated */
class AuthController extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    loginPath: PropTypes.string,
    token: PropTypes.string,
    location: PropTypes.object
  };

  componentDidMount() {
    onFetchError(this.handleFetchError.bind(this));
    this.processProps();
  }

  componentDidUpdate() {
    this.processProps();
  }

  handleFetchError(status, json) {
    // alert('Fetch error' + status + ': ' + JSON.stringify(json))

    // forget the token if it is rejected
    if (status === 401 && json.message !== "Invalid credentials.")
      this.props.forgetToken();
  }

  processProps() {
    const {loginPath = "/login/"} = this.props;

    // update token of dataAccess
    setToken(this.props.token);

    // Do not forward twice
    if (this.props.location.pathname === loginPath) return;

    // If we have a token the user is authenticated, otherwise forward to login
    if (!this.props.token)
      this.props.history.push(loginPath, {back: true});

  }

  render() {
    return this.props.children;
  }
}

const mapStateToProps = state => {
  const { token } = state.login;
  const {location} = state.router;
  return { token, location };
};

const mapDispatchToProps = dispatch => ({
  forgetToken: ignoored => dispatch(forgetToken())
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AuthController));
