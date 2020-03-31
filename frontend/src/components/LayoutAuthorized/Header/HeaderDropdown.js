import React from "react";
import { Dropdown } from "antd";
import classNames from "classnames";
import styles from "./Header.module.scss";

const HeaderDropdown = ({ overlayClassName: cls, ...restProps }) => (
  <Dropdown overlayClassName={classNames(styles.headerDropdownContainer, cls)} {...restProps} />
);

export default HeaderDropdown;
