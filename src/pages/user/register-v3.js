import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment-timezone';

import { PageSettings } from './../../config/page-settings.js';

import { ErrorMessage } from './styles';

import { fetchRegisterAPI } from '../../redux/actions';

class RegisterV3 extends React.Component {
  static contextType = PageSettings;

  constructor(props) {
    super(props);

    this.state = {
      licenceType: 'trail',
      organisationName: '',
      noOfUsers: 1,
      email: '',
      privacyCheckBox: false
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

  handleSubmit(event) {
    event.preventDefault();
    const { email, organisationName, noOfUsers, licenceType, privacyCheckBox } = this.state;
    const { callRegisterAPI } = this.props;
    if(this.mailValidation() && organisationName.trim() !== '' && 
      String(noOfUsers).trim() !== '' && licenceType.trim() !== '' && privacyCheckBox) {
      let format = 'YYYY-MM-DDTh:m:sZ'
      let date = moment()._d; 
      let startDate = moment(date).format(format);
      let endDate =  ''; 
      if(licenceType === 'trail') {
        endDate = moment(date).add(1, 'month').format(format)
      } else {
        endDate = moment(date).add(1, 'year').format(format)
      }
      let obj = {
        organizationName: organisationName,
        adminEmail: email,
        licenceType,
        numberOfUsers: noOfUsers,
        licenseStartDate: startDate,
        licenseEndDate: endDate,
        organizationId: 2
      }
      callRegisterAPI(obj)
    } else {
      this.setState({
        showErr: true
      })
    } 
  }

  changeDropDown = (e) => {
    this.setState({
      licenceType: e.target.value,
      showErr: false
    })
  }

  getLicenceTypeDropDownOptionUI = () => {
    let dropDownData = [
      {
        text: 'Trail',
        value: 'trail'
      },
      {
        text: 'Basic',
        value: 'basic'
      },
      {
        text: 'Mid-level',
        value: 'midLevel'
      },
      {
        text: 'Premium',
        value: 'premium'
      }
    ]
    const { licenceType } = this.state;
    return (
      <select className="form-control" value={licenceType} onChange={(e) => this.changeDropDown(e)}>
        {dropDownData.map((obj, index) => (
          <option className="dropdown-items" value={obj.value} id={index}>{obj.text}</option>
        ))}
      </select>
    )
  }

  changeInput = (e, key) => {
    this.setState({
      [key]: e.target.value,
      showErr: false
    })
  }

  getInputBoxUI = (title, placeholder, key, type, errorMessageUI) => {
    return (
      <>
        <label className="control-label">{title}<span className="text-danger">*</span></label>
        <div className="row m-b-15">
          <div className="col-md-12">
            <input
              type={type ? type : "text"}
              className="form-control"
              placeholder={placeholder}
              onChange={(e) => this.changeInput(e, key)}
              value={this.state[key]}
              required
            />
          </div>
          {errorMessageUI ? errorMessageUI() : this.inputTextErrorMessage(this.state[key])}
        </div>
      </>
    )
  }

  emailErrorMessage = () => {
    const { email, showErr } = this.state;
    return (
      <div className="m-l-15">
        {(!this.mailValidation() && email.trim() !== '') &&
          <ErrorMessage>{'Invalid Mail'}</ErrorMessage>
        }
        {(showErr && email.trim() === '') &&
          <ErrorMessage>{'Please fill the blank field'}</ErrorMessage>
        }
      </div>
    )
  }

  inputTextErrorMessage = (value) => {
    const { showErr } = this.state;
    return(
      <div className="m-l-15">
        {(showErr && String(value).trim() === '') &&
          <ErrorMessage>{'Please fill the blank field'}</ErrorMessage>
        }
      </div>
    )
  }

  changeCheckBox = () => {
    this.setState({
      privacyCheckBox: !this.state.privacyCheckBox
    })
  }

  mailValidation = () => {
    const { email } = this.state;
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  render() {
    return (
      <div className="register register-with-news-feed">
        <div className="news-feed">
          <div className="news-image" style={{ backgroundImage: 'url(/assets/img/login-bg/login-bg-9.jpg)' }}></div>
          <div className="news-caption">
            <h4 className="caption-title"><b>ADC</b> Admin App</h4>
            <p>
              As a ADC Admin app administrator, you use the ADC Admin console to manage your organization’s account, such as add new users, manage security settings, and turn on the services you want your team to access.
						</p>
          </div>
        </div>
        <div className="right-content">
          <h1 className="register-header">
            Sign Up
						<small>Create your ADC Admin Account. It’s free and always will be.</small>
          </h1>
          <div className="register-content">
            <form className="margin-bottom-0" onSubmit={this.handleSubmit}>
              {this.getInputBoxUI('Organisation Name', 'Organisation Name', 'organisationName', 'text')}
              {this.getInputBoxUI('Email', 'Email address', 'email', 'text', this.emailErrorMessage)}
              <label className="control-label">Licence Type <span className="text-danger">*</span></label>
              <div className="row m-b-15">
                <div className="col-md-12">
                  {this.getLicenceTypeDropDownOptionUI()}
                </div>
              </div>
              {this.getInputBoxUI('No.Of Users', 'No.Of Users', 'noOfUsers', 'number')}
              <div className="checkbox checkbox-css m-b-30">
                <div className="checkbox checkbox-css m-b-30">
                  <input
                    type="checkbox"
                    id="agreement_checkbox"
                    checked={this.state.privacyCheckBox}
                    onChange={() => this.changeCheckBox()}
                  />
                  <label htmlFor="agreement_checkbox">
                    By clicking Sign Up, you agree to our <Link to="/user/register-v3">Terms</Link> and that you have read our <Link to="/user/register-v3">Data Policy</Link>, including our <Link to="/user/register-v3">Cookie Use</Link>.
									</label>
                </div>
              </div>
              <div className="register-buttons">
                <button
                  type="submit"
                  className="btn btn-primary btn-block btn-lg"
                  onClick={(e) => this.handleSubmit(e)}
                >
                  Sign Up
                </button>
              </div>
              <div className="m-t-20 m-b-40 p-b-40 text-inverse">
                Already a member? Click <Link to="/">here</Link> to login.
							</div>
              <hr />
              <p className="text-center">
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
  callRegisterAPI: (data) => dispatch(fetchRegisterAPI(data))
})


export default connect(null, mapDispatchToProps)(withRouter(RegisterV3));