import React from "react";
import { FormattedMessage } from "react-intl";
import { Layout, Button, Drawer, Typography } from "antd";
import { MenuFoldOutlined } from "@ant-design/icons";
import LeftMenu from "./LeftMenu";
import RightMenu from "./RightMenu";
import styles from "./index.scss";

const { Header, Content } = Layout;
const { Title } = Typography;

class LayoutAuthorized extends React.Component {
  state = {
    activeTab: [`/${window.location.pathname.split("/").pop()}`],
    visible: false
  };

  showDrawer = () => {
    this.setState({
      visible: true
    });
  };

  onClose = () => {
    this.setState({
      visible: false
    });
  };

  render() {
    let { isMobile } = this.props;
    let { topNavLinks, onLocaleChange, selectedLocale, onSignOut, onThemeChange, selectedTheme } = this.props;

    if (isMobile) {
      let mode = "inline";

      return (
        <div className={`navBar ant-menu ant-menu-horizontal ant-menu-light mobileNavBar`}>
          <Button className={`drawerMenu`} type="primary" onClick={this.showDrawer}>
            <MenuFoldOutlined style={{ fontSize: "18px" }} />
          </Button>
          <Drawer title="Menu" width={300} placement="right" closable={false} onClose={this.onClose} visible={this.state.visible}>
            <LeftMenu topNavLinks={topNavLinks} mode={mode} />
            <RightMenu
              mode={mode}
              onLocaleChange={onLocaleChange}
              selectedLocale={selectedLocale}
              onSignOut={onSignOut}
              onThemeChange={onThemeChange}
              selectedTheme={selectedTheme}
            />
          </Drawer>
        </div>
      );
    } else {
      let mode = "horizontal";

      return (
        <div className={`navBar ant-menu ant-menu-horizontal ant-menu-light`}>
          <div className={`leftNav`}>
            <LeftMenu topNavLinks={topNavLinks} mode={mode} />
          </div>
          <div className={`rightNav`}>
            <RightMenu
              mode={mode}
              onLocaleChange={onLocaleChange}
              selectedLocale={selectedLocale}
              onSignOut={onSignOut}
              onThemeChange={onThemeChange}
              selectedTheme={selectedTheme}
            />
          </div>
        </div>
      );
    }
  }
}

export default LayoutAuthorized;
