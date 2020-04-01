import React from "react";
import { Layout } from "antd";
import styles from "./PaymentSchedulePage.module.scss";

const { Content } = Layout;

class PaymentSchedulePage extends React.Component {
  render() {
    return (
      <Layout className={styles.layout}>
        <Content className="main-content">Payment Schedule Page</Content>
      </Layout>
    );
  }
}

export default PaymentSchedulePage;
