import React from 'react';
import {FormattedMessage} from "react-intl";
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import { login, error } from '../../actions/login';


class Login extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    token: PropTypes.string,
    error: PropTypes.string
  };

  loading = false;

  constructor(props) {
    super(props);
    this.state = { email: '', password: '' };
  }

  componentDidUpdate() {
    if (this.loading && !this.props.error) {
      if (this.props.location.state && this.props.location.state.back === true)
        this.props.history.goBack();
      else
        this.props.history.push("/");
    }

    this.loading = false;
  }

  componentWillUnmount() {
    this.props.clearError();
  }

  handleChanged(e) {
    this.props.clearError();
    const values = {...this.state};
    values[e.target.name] = e.target.value;
    this.setState(values);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.loading = true;
    this.props.login(this.state);
  }

  render() {
    return (
      <div>
        <h1><FormattedMessage id="login.title" defaultMessage="Please log in" /></h1>
        {this.props.error && (
          <div className="alert alert-danger" role="alert">
            <span className="fa fa-exclamation-triangle" aria-hidden="true" />{' '}
            {this.props.error === "Unauthorized"
              ? <FormattedMessage id="login.error.unauthorized" defaultMessage="Unauthorized" />
              : this.props.error}
          </div>
        )}

        <form className="login" onSubmit={this.handleSubmit.bind(this)}>
          <div className="form-group">
            <label htmlFor="login_email" className="form-control-label">
              <FormattedMessage id="login.email" defaultMessage="Email" />
            </label>
            <input type="text" name="email" value={this.state.email} id="login_email" onChange={this.handleChanged.bind(this)} required={true}/>
          </div>
          <div className="form-group">
            <label htmlFor="login_password" className="form-control-label">
              <FormattedMessage id="login.password" defaultMessage="Password" />
            </label>
            <input type="password" name="password" value={this.state.password} id="login_password" onChange={this.handleChanged.bind(this)} required={true}/>
          </div>
          <button type="submit" className="btn btn-success">
            <FormattedMessage id="login.submit" defaultMessage="Submit"/>
          </button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { token, error } = state.login;
  return { token, error };
};

const mapDispatchToProps = dispatch => ({
  login: (values) => dispatch(login(values)),
  clearError: ignoored => dispatch(error(null))
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
