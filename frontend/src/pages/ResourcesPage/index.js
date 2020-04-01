import React from "react";
import { Layout } from "antd";
import styles from "./ResourcesPage.module.scss";

const { Content } = Layout;

class ResourcesPage extends React.Component {
  render() {
    return (
      <Layout className={styles.layout}>
        <Content className="main-content">Resources</Content>
      </Layout>
    );
  }
}

export default ResourcesPage;
