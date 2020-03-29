import React from "react";
import { FormattedMessage } from "react-intl";
import styles from "./UserSignUpPage.module.scss";

export default {
  UserName: {
    form: {
      id: "UserName",
      name: "UserName",
      placeholder: "Username",
      rules: [
        {
          required: true,
          message: <FormattedMessage id="userName.required" defaultMessage="Please enter a Username" />
        }
      ]
    },
    input: {
      size: "large",
      placeholder: "Username"
    }
  },
  Password: {
    form: {
      id: "Password",
      name: "Password",
      rules: [
        {
          required: true,
          message: "Please enter password!"
        }
      ]
    },
    input: {
      size: "large",
      type: "password",
      placeholder: "Password"
    }
  },
  ConfirmPassword: {
    form: {
      id: "ConfirmPassword",
      name: "ConfirmPassword",
      rules: [
        {
          required: true,
          message: <FormattedMessage id="password.required" defaultMessage="Please enter password!" />
        }
      ]
    },

    input: {
      size: "large",
      type: "password",
      placeholder: "Confirm Password"
    }
  },
  Email: {
    form: {
      id: "Email",
      name: "Email",
      rules: [
        {
          required: true,
          message: <FormattedMessage id="email.required" defaultMessage="Please enter your email" />
        },
        {
          type: "email",
          message: <FormattedMessage id="email.wrong.format" defaultMessage="The email address is in the wrong format!" />
        }
      ]
    },
    input: {
      size: "large",
      type: "email",
      placeholder: "BLOCK_NAME.email.placeholder"
    }
  },
  FirstName: {
    form: {
      id: "FirstName",
      name: "FirstName"
    },
    input: {
      size: "large",
      placeholder: "First Name"
    }
  },
  LastName: {
    form: {
      id: "LastName",
      name: "LastName"
    },
    input: {
      size: "large",
      placeholder: "Last Name"
    }
  },
  passwordStatus: {
    ok: (
      <div className={styles.success}>
        <FormattedMessage id="strength.strong" defaultMessage="Strength: strong" />
      </div>
    ),
    pass: (
      <div className={styles.warning}>
        <FormattedMessage id="strength.medium" defaultMessage="Strength: medium" />
      </div>
    ),
    poor: (
      <div className={styles.error}>
        <FormattedMessage id="strength.short" defaultMessage="Strength: too short" />
      </div>
    )
  },
  passwordProgress: {
    ok: "success",
    pass: "normal",
    poor: "exception"
  }
};
