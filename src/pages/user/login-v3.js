import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

import { PageSettings } from './../../config/page-settings.js';

import { ErrorMessage } from './styles';

import { fetchLoginAPI } from '../../redux/actions'

class LoginV3 extends React.Component {
	static contextType = PageSettings;

	constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      showErr: false
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
	componentDidMount() {
		this.context.handleSetPageSidebar(false);
		this.context.handleSetPageHeader(false);
		this.context.handleSetBodyWhiteBg(true);
	}

	componentWillUnmount() {
		this.context.handleSetPageSidebar(true);
		this.context.handleSetPageHeader(true);
		this.context.handleSetBodyWhiteBg(false);
	}
	
	handleSubmit = (event) => {
    event.preventDefault();
    const { password, email } = this.state;
    const { callLoginAPI } = this.props;
    if(this.mailValidation() && password.trim() !== '') {
      callLoginAPI({ email, password});
      this.props.history.push('/dashboard/current_execution');
    } else {
      this.setState({
        showErr: true
      })
    }    
  }

  onchangeInput = (e, key) => {
    this.setState({
      [key]: e.target.value,
      showErr: false
    })
  }

  mailValidation = () => {
    const { email } = this.state;
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  
	render() {
    const { email, password, showErr } = this.state;
		return (
			<div className="login login-with-news-feed">
				<div className="news-feed">
					<div className="news-image" style={{backgroundImage: 'url(/assets/img/login-bg/login-bg-11.jpg)'}}></div>
					<div className="news-caption">
						<h4 className="caption-title"><b>ADC</b> Admin </h4>
						<p>
							Download the ADC Admin application for iPhone®, iPad®, and Android™. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						</p>
					</div>
				</div>
				<div className="right-content">
					<div className="login-header">
						<div className="brand">
							<span className="logo"></span> <b>ADC</b> Admin
							<small></small>
						</div>
						<div className="icon">
							<i className="fa fa-sign-in"></i>
						</div>
					</div>
					<div className="login-content">
						<form className="margin-bottom-0" onSubmit={this.handleSubmit}>
							<div className="form-group m-b-15">
                <input 
                  type="text" 
                  className="form-control form-control-lg" 
                  placeholder="Email Address" 
                  onChange={(e) => this.onchangeInput(e, 'email')}
                  value={email}
                  required
                />
                { (!this.mailValidation() && email.trim() !== '') &&
                  <ErrorMessage>{'Invalid Mail'}</ErrorMessage>
                }
                { (showErr &&  email.trim() === '') &&
                  <ErrorMessage>{'Please fill the blank field'}</ErrorMessage>
                }
							</div>
							<div className="form-group m-b-15">
                <input 
                  type="password" 
                  className="form-control form-control-lg" 
                  placeholder="Password" 
                  onChange={(e) => this.onchangeInput(e, 'password')}
                  value={password}
                  required
                />
                { (showErr && password.trim() === '') &&
                  <ErrorMessage>Please fill the blank field</ErrorMessage>
                }
							</div>
							<div className="checkbox checkbox-css m-b-30">
								<input type="checkbox" id="remember_me_checkbox" value="" />
								<label htmlFor="remember_me_checkbox">
									Remember Me
								</label>
							</div>
							<div className="login-buttons">
								<button type="submit" className="btn btn-success btn-block btn-lg" onClick={(e) => this.handleSubmit(e)}>Sign me in</button>
              </div>
							<div className="m-t-20 m-b-40 p-b-40 text-inverse">
								Not a member yet? Click <Link to="/user/register-v3" className="text-success">here</Link> to register.
							</div>
							<hr />
							<p className="text-center text-grey-darker">
								&copy; ADC Admin All Right Reserved 2019
							</p>
						</form>
					</div>
				</div>
			</div>
		)
	}
}

const mapDispatchToProps = (dispatch) => ({
  callLoginAPI: (data) => dispatch(fetchLoginAPI(data))
})

export default connect(null, mapDispatchToProps)(withRouter(LoginV3));