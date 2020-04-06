import React from "react";
import { Menu, Dropdown } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import { availableLanguages } from "locales";
import styles from "./LocaleSelector.module.scss";

const LocaleSelector = props => {
  const { className, selectedLocale, onChange, children } = props;

  const langMenu = (
    <Menu className={styles.dropDownMenu} selectedKeys={[selectedLocale]} onClick={onChange}>
      {console.log(availableLanguages)}
      {availableLanguages.map(locale => (
        <Menu.Item key={locale.value}>{locale.name}</Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown overlayClassName={styles.headerDropdownContainer} className={`${className}`} overlay={langMenu} placement="bottomRight" trigger={["click"]}>
      <span className={`${styles.headerDropDown} ${className}`}>
        <GlobalOutlined title="Languages" style={{ marginTop: "3px" }} />
        {children}
      </span>
    </Dropdown>
  );
};

export default LocaleSelector;
