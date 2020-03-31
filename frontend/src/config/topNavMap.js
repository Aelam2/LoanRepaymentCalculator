import React from "react";
import { FormattedMessage } from "react-intl";

export default [
  {
    key: "1",
    path: "/",
    text: <FormattedMessage id="layout.authorized.Overview" defaultMessage="Loan Overview" />,
    children: []
  },
  {
    key: "2",
    path: "/payment-schedule",
    text: <FormattedMessage id="layout.authorized.paymentSchedule" defaultMessage="Payment Schedule" />,
    children: []
  },
  {
    key: "3",
    path: "/resources",
    text: <FormattedMessage id="layout.authorized.Resources" defaultMessage="Resources" />,
    children: []
  }
];
