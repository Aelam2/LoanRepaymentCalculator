import React from "react";
import { FormattedMessage } from "react-intl";
import { FallOutlined, CarryOutOutlined, ReadOutlined } from "@ant-design/icons";

export default [
  {
    key: "1",
    path: "/",
    text: <FormattedMessage id="layout.authorized.overview" defaultMessage="Dashboard" />,
    icon: <FallOutlined />,
    children: []
  },
  {
    key: "2",
    path: "/payment-schedule",
    text: <FormattedMessage id="layout.authorized.paymentSchedule" defaultMessage="Payment Schedule" />,
    icon: <CarryOutOutlined />,
    children: []
  },
  {
    key: "3",
    path: "/resources",
    text: <FormattedMessage id="layout.authorized.resources" defaultMessage="Resources" />,
    icon: <ReadOutlined />,
    children: []
  }
];
