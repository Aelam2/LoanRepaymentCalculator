import React from "react";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { Layout, Menu } from "antd";
import ThemeSelector from "../Header/HeaderThemeSelector";
import HeaderLocales from "../Header/HeaderLocales";
import styles from "./LayoutAuthorized.module.scss";

const { Header, Content } = Layout;

class LayoutAuthorized extends React.Component {
  state = {
    activeTab: [`/${window.location.pathname.split("/").pop()}`]
  };

  render() {
    let { children, style: innerContentStyle } = this.props;
    let { topNavLinks, onLocaleChange, selectedLocale, onSignOut, onThemeChange, selectedTheme } = this.props;
    let { CustomSideMenu } = this.props;

    return (
      <Layout className={styles.layout}>
        <Header className={styles.header}>
          <div className="ant-menu ant-menu-horizontal">
            <h1 className={styles.title}>
              <FormattedMessage id="layout.authorized.title" defaultMessage="Loan Calculator" />
            </h1>
          </div>
          <Menu className={styles.menu} mode="horizontal" defaultSelectedKeys={this.state.activeTab}>
            {(topNavLinks || []).map(l => {
              return (
                <Menu.Item key={l.path} className={styles.topNavLink}>
                  <Link to={l.path}>{l.text}</Link>
                </Menu.Item>
              );
            })}
            {onSignOut && (
              <Menu.Item key="4" className={styles.right} onClick={onSignOut}>
                <FormattedMessage id="layout.authorized.signOut" defaultMessage="Sign Out" />
              </Menu.Item>
            )}
            {onLocaleChange && (
              <div className={styles.right} key="5">
                <HeaderLocales className={styles.action} selectedLocale={selectedLocale} onChange={onLocaleChange} />
              </div>
            )}
            {onThemeChange && (
              <div className={styles.right} key="6">
                <ThemeSelector className={styles.action} onChange={onThemeChange} selected={selectedTheme} />
              </div>
            )}
          </Menu>
        </Header>
        <Layout>
          {CustomSideMenu && <CustomSideMenu />}
          <Layout>
            <Content className={`${styles.siteLayoutBackground}`} style={innerContentStyle}>
              {children}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

export default LayoutAuthorized;
