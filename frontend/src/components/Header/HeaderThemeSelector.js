import React, { useState } from "react";
import ReactDOM from "react-dom";
import defaultSettings from "config/defaultSettings";
import { BulbOutlined } from "@ant-design/icons";

const ThemeSelector = props => {
  const { className, onChange, selected } = props;

  const [theme, setTheme] = useState(selected);

  const handleButtonClick = () => {
    let newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    onChange(newTheme);
  };

  let styleSheet = theme === "dark" ? defaultSettings.themes.dark : defaultSettings.themes.light;

  return (
    <span className={`${className}`} onClick={handleButtonClick}>
      <BulbOutlined />
    </span>
  );
};

export default ThemeSelector;
