import React, { Component } from 'react';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.module.css';
import * as actions from '../../store/actions/index';
import { connect } from 'react-redux';
import Spinner from '../../components/UI/Spinner/Spinner';
import { Redirect } from 'react-router-dom';
import { checkValidity } from '../../shared/utility';

class Auth extends Component {
  state = {
    controls: {
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Your Email Id'
        },
        value: '',
        validation: {
          required: true,
          isEmail: true
        },
        valid: false,
        touched: false
      },
      password: {
        elementType: 'input',
        elementConfig: {
          type: 'password',
          placeholder: 'Password'
        },
        value: '',
        validation: {
          required: true,
          minLength: 6,
          maxLength: 128
        },
        valid: false,
        touched: false
      }
    },
    isSignUp: true
  };

  componentDidMount() {
    if (!this.props.buildingBurger && this.props.authRedirectPath !== '/') {
      this.props.onAuthRedirectPath();
    }
  }

  inputChangedHandler = (e, controlName) => {
    const updatedControls = {
      ...this.state.controls,
      [controlName]: {
        ...this.state.controls[controlName],
        value: e.target.value,
        valid: checkValidity(
          e.target.value,
          this.state.controls[controlName].validation
        ),
        touched: true
      }
    };
    this.setState({ controls: updatedControls });
  };

  submitHandler = e => {
    e.preventDefault();

    this.props.onAuthStart(
      this.state.controls.email.value,
      this.state.controls.password.value,
      this.state.isSignUp
    );
  };

  switchSignButton = () => {
    this.setState({ isSignUp: !this.state.isSignUp });
  };

  render() {
    const formElementsArray = [];
    for (let key in this.state.controls) {
      formElementsArray.push({
        id: key,
        config: this.state.controls[key]
      });
    }
    let form = (
      <form onSubmit={this.submitHandler}>
        <h3 style={{ color: 'brown' }}>
          ENTER YOUR {this.state.isSignUp ? 'REGISTER' : 'LOGIN'} DETAILS
        </h3>
        {formElementsArray.map(formElement => (
          <Input
            key={formElement.id}
            elementType={formElement.config.elementType}
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.value}
            changed={e => this.inputChangedHandler(e, formElement.id)}
            invalid={!formElement.config.valid}
            validationRequired={formElement.config.validation}
            touched={formElement.config.touched}
          />
        ))}
        <Button btnType="Success">
          {this.state.isSignUp ? 'REGISTER' : 'LOGIN'}
        </Button>
        <br />
      </form>
    );

    if (this.props.loading) {
      form = <Spinner />;
    }

    let errorMessage = null;
    if (this.props.error) {
      errorMessage = (
        <p style={{ color: 'red' }}>
          <b>{this.props.error.message}</b>
        </p>
      );
    }

    let authenticateRedirect = null;
    if (this.props.isAuth) {
      console.log(this.props.authRedirectPath);
      authenticateRedirect = <Redirect to={this.props.authRedirectPath} />;
    }

    return (
      <div className={classes.Auth}>
        {authenticateRedirect}
        {errorMessage}
        {form}
        <Button btnType="Danger" clicked={this.switchSignButton}>
          {this.state.isSignUp ? 'Switch To LOGIN' : 'Switch To REGISTER'}
        </Button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuth: state.auth.token !== null,
    buildingBurger: state.burgerBuilder.building,
    authRedirectPath: state.auth.authRedirectPath
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAuthStart: (email, password, isSignUp) =>
      dispatch(actions.authInit(email, password, isSignUp)),
    onAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Auth);
