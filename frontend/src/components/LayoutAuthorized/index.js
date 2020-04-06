import React from "react";
import { FormattedMessage } from "react-intl";
import { Layout, Typography } from "antd";
import { Textfit } from "react-textfit";
import NavBar from "../NavBar/index";
import styles from "./LayoutAuthorized.module.scss";

const { Header, Content } = Layout;
const { Title } = Typography;

class LayoutAuthorized extends React.Component {
  state = {
    activeTab: [`/${window.location.pathname.split("/").pop()}`]
  };

  render() {
    let { children, style: innerContentStyle, className: contentClassName } = this.props;
    let { CustomSideMenu, isMobile } = this.props;

    return (
      <Layout className={styles.layout}>
        <Header className={`${styles.header} ${isMobile && styles.headerMobile}`}>
          <div className={`ant-menu ant-menu-horizontal ${styles.titleContainer}`}>
            <Textfit className={styles.title} mode="single" max="32">
              <FormattedMessage id="layout.authorized.title" defaultMessage="Loan Calculator" tagName="span" />
            </Textfit>
          </div>
          <NavBar {...this.props} />
        </Header>
        {CustomSideMenu && <CustomSideMenu />}
        <Content className={contentClassName} style={innerContentStyle}>
          {children}
        </Content>
      </Layout>
    );
  }
}

export default LayoutAuthorized;
