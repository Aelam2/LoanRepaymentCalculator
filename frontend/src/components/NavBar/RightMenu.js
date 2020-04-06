import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { Menu } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import ThemeSelector from "components/ThemeProvider/ThemeSelector";
import LocaleSelector from "components/LocaleProvider/LocaleSelector";
import "./index.scss";

class RightMenu extends Component {
  render() {
    let { onLocaleChange, selectedLocale, onSignOut, onThemeChange, selectedTheme } = this.props;
    let { mode } = this.props;

    return (
      <Menu className={`menu`} mode={mode}>
        {onThemeChange && (
          <Menu.Item key="theme-selector" className={`actionContainer`}>
            <ThemeSelector onChange={onThemeChange} selected={selectedTheme}>
              {mode === "inline" && <FormattedMessage id="layout.navbar.switchTheme" defaultMessage="Switch Theme" tagName="span" />}
            </ThemeSelector>
          </Menu.Item>
        )}
        {onLocaleChange && (
          <Menu.Item key="locale-selector" className={`actionContainer`}>
            <LocaleSelector selectedLocale={selectedLocale} onChange={onLocaleChange}>
              {mode === "inline" && <FormattedMessage id="layout.navbar.switchLocale" defaultMessage="Change Language" tagName="span" />}
            </LocaleSelector>
          </Menu.Item>
        )}
        {onSignOut && (
          <Menu.Item key="sign-out" className={`actionContainer`} onClick={onSignOut}>
            {mode === "inline" && <LogoutOutlined />}
            <FormattedMessage id="layout.authorized.signOut" defaultMessage="Sign Out" tagName="a" />
          </Menu.Item>
        )}
      </Menu>
    );
  }
}

export default RightMenu;
