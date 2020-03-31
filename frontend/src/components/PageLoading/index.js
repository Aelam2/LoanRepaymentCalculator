import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const PageLoading = ({ tip, ...props }) => (
  <div className={`${props.className}`} style={{ paddingTop: 100, textAlign: "center" }}>
    <Spin size="large" indicator={loadingIcon} tip={tip} {...props} />
  </div>
);

export default PageLoading;
