import React, { useState } from "react";
import defaultSettings from "config/defaultSettings";
import { BulbOutlined } from "@ant-design/icons";

const ThemeSelector = props => {
  const { className, onChange, selected, children } = props;

  const [theme, setTheme] = useState(selected);

  const handleButtonClick = () => {
    let newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    onChange(newTheme);
  };

  return (
    <span className={`${className}`} onClick={handleButtonClick}>
      <BulbOutlined />
      {children}
    </span>
  );
};

export default ThemeSelector;
