import React from "react";
import { FormattedMessage } from "react-intl";
import { Layout, Menu, Breadcrumb } from "antd";
import { UserOutlined, LaptopOutlined, NotificationOutlined } from "@ant-design/icons";
import styles from "./LayoutAuthorized.module.scss";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

class LayoutAuthorized extends React.Component {
  render() {
    let { children, onSignOut } = this.props;
    return (
      <Layout className={styles.layout}>
        <Header className={styles.header}>
          <div>
            <h1 className={styles.title}>
              <FormattedMessage id="layout.authorized.title" defaultMessage="Loan Calculator" />
            </h1>
          </div>
          <Menu className={styles.menu} theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
            <Menu.Item key="1">
              <FormattedMessage id="layout.authorized.Overview" defaultMessage="Overview" />
            </Menu.Item>
            <Menu.Item key="2">
              <FormattedMessage id="layout.authorized.paymentSchedule" defaultMessage="Payment Schedule" />
            </Menu.Item>
            <Menu.Item key="3">
              <FormattedMessage id="layout.authorized.Resources" defaultMessage="Resources" />
            </Menu.Item>
            {onSignOut && (
              <Menu.Item key="4" className={styles.signOut} onClick={onSignOut}>
                <FormattedMessage id="layout.authorized.signOut" defaultMessage="Sign Out" />
              </Menu.Item>
            )}
          </Menu>
        </Header>
        <Layout>
          <Sider width={350} className={styles.siteLayoutBackground}>
            <Menu mode="inline" defaultSelectedKeys={["1"]} defaultOpenKeys={["sub1"]} style={{ height: "100%", borderRight: 0 }}>
              <SubMenu
                key="sub1"
                title={
                  <span>
                    <UserOutlined />
                    subnav 1
                  </span>
                }
              >
                <Menu.Item key="1">option1</Menu.Item>
                <Menu.Item key="2">option2</Menu.Item>
                <Menu.Item key="3">option3</Menu.Item>
                <Menu.Item key="4">option4</Menu.Item>
              </SubMenu>
              <SubMenu
                key="sub2"
                title={
                  <span>
                    <LaptopOutlined />
                    subnav 2
                  </span>
                }
              >
                <Menu.Item key="5">option5</Menu.Item>
                <Menu.Item key="6">option6</Menu.Item>
                <Menu.Item key="7">option7</Menu.Item>
                <Menu.Item key="8">option8</Menu.Item>
              </SubMenu>
              <SubMenu
                key="sub3"
                title={
                  <span>
                    <NotificationOutlined />
                    subnav 3
                  </span>
                }
              >
                <Menu.Item key="9">option9</Menu.Item>
                <Menu.Item key="10">option10</Menu.Item>
                <Menu.Item key="11">option11</Menu.Item>
                <Menu.Item key="12">option12</Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Layout style={{ padding: "0 24px 24px" }}>
            <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
            </Breadcrumb>
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
