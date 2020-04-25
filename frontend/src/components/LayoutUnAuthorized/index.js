import React from "react";
import { FormattedMessage } from "react-intl";
import { Layout } from "antd";
import { Link } from "react-router-dom";
import { Textfit } from "react-textfit";

import ThemeSelector from "components/ThemeProvider/ThemeSelector";
import LocaleSelector from "components/LocaleProvider/LocaleSelector";
import styles from "./LayoutUnAuthorized.module.scss";

const { Header, Content, Sider } = Layout;

class LayoutUnAuthorized extends React.Component {
  render() {
    let { children } = this.props;
    let { selectedLocale, onLocaleChange } = this.props;
    let { onThemeChange, selectedTheme } = this.props;

    return (
      <Layout>
        <div className={styles.container}>
          <div className={styles.topRight}>
            <div className={styles.siteSettings}>
              {onThemeChange && <ThemeSelector className={styles.action} onChange={onThemeChange} selected={selectedTheme} />}
              {onLocaleChange && <LocaleSelector className={styles.action} selectedLocale={selectedLocale} onChange={onLocaleChange} />}
            </div>
          </div>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <Textfit className={styles.title} mode="single" max={48}>
                  <FormattedMessage id="application.title" defaultMessage="Loan Payoff Calculator" tagName="span" />
                </Textfit>
              </div>
              <div className={styles.desc}>
                <FormattedMessage id="application.description" defaultMessage="Payoff Loans Smarter and Faster" />
              </div>
            </div>
            {children}
          </div>
          <div className={`${styles.policy}`}>
            <a href="https://www.iubenda.com/privacy-policy/50357273" className="iubenda-black iubenda-embed" title="Privacy Policy">
              Privacy Policy
            </a>
            <Link className={`${styles.policyBtn}`} title="Terms and Conditions " to="/terms-and-conditions">
              Terms and Conditions
            </Link>
          </div>
        </div>
      </Layout>
    );
  }
}

export default LayoutUnAuthorized;
