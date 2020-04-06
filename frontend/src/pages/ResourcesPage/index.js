import React from "react";
import { Layout } from "antd";
import styles from "./ResourcesPage.module.scss";

const { Content } = Layout;

class ResourcesPage extends React.Component {
  render() {
    return (
      <div className={styles.layout}>
        <div className="main-content">Payment Schedule Page</div>
      </div>
    );
  }
}

export default ResourcesPage;
