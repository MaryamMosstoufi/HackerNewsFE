import React, { useState, useEffect } from 'react';
import { Link, useHistory} from 'react-router-dom';
import axios from 'axios';

import * as yup from 'yup';

import './PageAuthForm.css';
import '../assets/images/salt-in-white-surface-3693296.jpg'

import { SIGNUP_FORM_SCHEMA } from '../form-schemas/login-and-signup';

const INITIAL_FORM_STATE = {
  email: '',
  password: '',
  passwordAgain: '',
}

const INITIAL_ERROR_STATE = {...INITIAL_FORM_STATE};

const DISABLE_FORM_VALIDATION = false; // switch to 'true' to make manual testing faster

export default function PageSignup() {

  const [formState, setFormState] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState(INITIAL_ERROR_STATE);
  const [submitButtonEnabled, setSubmitButtonEnabled] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (DISABLE_FORM_VALIDATION) return;

    SIGNUP_FORM_SCHEMA.isValid(formState)
    .then(valid => {
      setSubmitButtonEnabled(valid);
    })
  }, [formState])

  function onChange(e) {
    e.persist();
    const name = e.target.name;
    const value = e.target.value;
    
    setFormState({...formState, [name]: value})

    if (DISABLE_FORM_VALIDATION) return;

    // BUG: doesn't handle "does the password confirmation match the password" properly
    yup.reach(SIGNUP_FORM_SCHEMA, name)
    .validate(value)
    .then(valid => {
      setErrors({
        ...errors,
        [name]: '',
      })
    }).catch(err => {
      setErrors({
        ...errors,
        [name]: err.errors[0],
      })
    })

  }

  function onSubmit(e) {
    e.preventDefault();
    const userRegister = { email: formState.email, password: formState.password };
    console.log(userRegister);
    axios.post("https://hackernewsbw31.herokuapp.com/api/auth/register", userRegister)
      .then(res => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userID", res.data.data.id);
        history.push("/");
        // console.log(res.data)
      })
      .catch(err => console.log({ err }))
  }
  
  return (
    <div className='auth-form-page'>
      <div className='auth-form-page__image'/>
      <div className='auth-form-page__form'>
        <div className='uk-section uk-section-small'>
          <div className='uk-container uk-flex uk-flex-center'>
            <form className='uk-form-stacked uk-width-medium' onSubmit={onSubmit}>
              <legend className='uk-align-center uk-text-primary'>Sign up</legend>
              <div className='form-group'>
                <label className='uk-form-label uk-text-primary' htmlFor='inputEmail'>E-mail address</label>
                <div className='uk-form-controls'>
                  <input type='email' name='email' id='inputEmail' onChange={onChange} className='uk-input'/>
                </div>
                <div className='uk-form-label uk-text-danger'>{errors.email}</div>
              </div>
              <div className='form-group'>
                <label className='uk-form-label uk-text-primary' htmlFor='inputPassword'>Password</label>
                <div className='uk-form-controls'>
                  <input type='password' name='password' id='inputPassword' onChange={onChange} className='uk-input'/>
                </div>
                <div className='uk-form-label uk-text-danger'>{errors.password}</div>
              </div>
              <div className='form-group'>
                <label className='uk-form-label uk-text-primary' htmlFor='inputPasswordAgain'>Password (again)</label>
                <div className='uk-form-controls'>
                  <input type='password' name='passwordAgain' id='inputPasswordAgain' onChange={onChange} className='uk-input'/>
                </div>
                <div className='uk-form-label uk-text-danger'>{errors.passwordAgain}</div>
              </div>
              <div className='form-group uk-margin-top'>
                <input type='submit' value='Sign up' disabled={!submitButtonEnabled} className='uk-button uk-button-primary uk-width-1-1'/>
              </div>
              <div className='uk-margin uk-text-center'>
                <Link to='/login'>Have Account?</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
