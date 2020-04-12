import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const PageLoading = ({ tip, style, ...props }) => (
  <div className={`${props.className}`} style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", ...style }}>
    <Spin size="large" tip={tip} {...props} />
  </div>
);

export default PageLoading;
