import React from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import * as actions from "actions/UserActions";
import FormMap from "pages/UserSignUpPage/FormMap";
import { Form, Input, Button, message } from "antd";
import styles from "./UserPasswordReset.module.scss";

class EmailForm extends React.Component {
  formRef = React.createRef();

  componentDidUpdate(prevProps) {
    if ((prevProps.reset.success == false && this.props.reset.success == true) || (prevProps.reset.error == false && this.props.reset.error == true)) {
      if (this.props.reset.error) {
        message.error(this.props.reset.message);
      } else {
        message.success(this.props.reset.message);
      }
    }
  }

  onFinish = async values => {
    // Start sign-in action
    let result = await this.props.sendPasswordReset(values);
    if (result) message.success("Sign in successful!");
  };

  render() {
    let { intl, reset } = this.props;

    return (
      <div className={`${styles.container}`}>
        <FormattedMessage id="password.reset.title" defaultMessage="Password Reset" tagName="h1" />
        <Form name="reset-form" ref={this.formRef} onFinish={this.onFinish}>
          <Form.Item {...FormMap.Email.form}>
            <Input {...FormMap.Email.input} placeholder={`${intl.formatMessage({ id: "email.placeholder", defaultMessage: "Email" })} *`} />
          </Form.Item>
          <Form.Item>
            <Form.Item style={{ float: "right" }}>
              <Button size="large" className={styles.submit} type="primary" htmlType="submit" loading={reset.loading} style={{ minWidth: "103px" }}>
                {!reset.loading && <FormattedMessage id="password.reset.button" defaultMessage="Send Link" />}
              </Button>
            </Form.Item>

            <Link className={`secondary-text`} style={{ float: "left" }} to="/user/sign-in">
              <FormattedMessage id="password.reset.back" defaultMessage="Back to Login" />
            </Link>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    reset: state.auth.resetEmailForm
  };
};

export default compose(connect(mapStateToProps, actions))(injectIntl(EmailForm));
