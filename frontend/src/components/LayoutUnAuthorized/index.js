import React from "react";
import { FormattedMessage } from "react-intl";
import styles from "./LayoutUnAuthorized.module.scss";

class LayoutUnAuthorized extends React.Component {
  render() {
    let { children } = this.props;

    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <span className={styles.title}>
                <FormattedMessage id="application.title" defaultMessage="Loan Payoff Calculator" />
              </span>
            </div>
            <div className={styles.desc}>
              <FormattedMessage id="application.description" defaultMessage="Payoff Loans Smarter and Faster" />
            </div>
          </div>
          {children}
        </div>
        {/* <DefaultFooter /> */}
      </div>
    );
  }
}

export default LayoutUnAuthorized;
