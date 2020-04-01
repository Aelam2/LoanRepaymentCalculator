import React from "react";
import HeaderDropdown from "./HeaderDropdown";
import { Menu } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import { availableLanguages } from "locales";
import styles from "./Header.module.scss";

const HeaderLocales = props => {
  const { className, selectedLocale, onChange } = props;

  const langMenu = (
    <Menu className={styles.dropDownMenu} selectedKeys={[selectedLocale]} onClick={onChange}>
      {availableLanguages.map(locale => (
        <Menu.Item key={locale.key}>{locale.name}</Menu.Item>
      ))}
    </Menu>
  );

  return (
    <HeaderDropdown className={`${className}`} overlay={langMenu} placement="bottomRight" trigger={["click"]}>
      <span className={`${styles.headerDropDown} ${className}`}>
        <GlobalOutlined title="Languages" style={{ marginTop: "3px" }} />
      </span>
    </HeaderDropdown>
  );
};

export default HeaderLocales;
