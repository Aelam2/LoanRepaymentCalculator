import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import "./index.scss";

class LeftMenu extends Component {
  render() {
    let { topNavLinks, ...props } = this.props;

    return (
      <Menu className={`menu`} {...props}>
        {(topNavLinks || []).map(l => {
          return (
            <Menu.Item key={l.path} className={`topNavLink`}>
              {props.mode === "inline" && l.icon}
              <Link to={l.path}>{l.text}</Link>
            </Menu.Item>
          );
        })}
      </Menu>
    );
  }
}

export default LeftMenu;
