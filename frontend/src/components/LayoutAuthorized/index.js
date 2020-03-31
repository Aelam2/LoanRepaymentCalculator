import React from "react";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { Layout, Menu } from "antd";
import HeaderLocales from "./Header/HeaderLocales";
import styles from "./LayoutAuthorized.module.scss";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

class LayoutAuthorized extends React.Component {
  render() {
    let { children, theme } = this.props;
    let { topNavLinks, onLocaleChange, selectedLocale, onSignOut } = this.props;
    let { CustomSideMenu, sideMenuLinks } = this.props;

    let navTheme = (theme || "dark").toLocaleLowerCase().includes("dark") ? "dark" : "light";

    return (
      <Layout className={styles.layout}>
        <Header className={styles.header}>
          <div>
            <h1 className={styles.title}>
              <FormattedMessage id="layout.authorized.title" defaultMessage="Loan Calculator" />
            </h1>
          </div>
          <Menu className={styles.menu} theme={navTheme} mode="horizontal" defaultSelectedKeys={["1"]}>
            {(topNavLinks || []).map(l => {
              return (
                <Menu.Item key={l.key}>
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
              <div className={styles.right}>
                <HeaderLocales className={styles.action} selectedLocale={selectedLocale} onChange={onLocaleChange} />
              </div>
            )}
          </Menu>
        </Header>
        <Layout>
          {CustomSideMenu ? <CustomSideMenu /> : sideMenuLinks && sideMenuLinks.length ? <Sider></Sider> : null}
          <Layout style={{ padding: "0 24px 24px" }}>
            <Content
              className="site-layout-background"
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280
              }}
            >
              {children}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

export default LayoutAuthorized;
