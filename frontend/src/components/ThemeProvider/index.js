import React from "react";
import ReactDOM from "react-dom";
import defaultSettings from "config/defaultSettings";
import { connect } from "react-redux";
import { compose } from "redux";

const ThemeProvider = props => {
  let { children, theme } = props;
  let styleSheet = theme === "dark" ? defaultSettings.themes.dark : null;

  return (
    <>
      {ReactDOM.createPortal(<link rel="stylesheet" type="text/css" href={styleSheet}></link>, document.head)}
      {children}
    </>
  );
};

const mapStateToProps = state => {
  return {
    theme: state.site.theme
  };
};

export default compose(connect(mapStateToProps, null))(ThemeProvider);
