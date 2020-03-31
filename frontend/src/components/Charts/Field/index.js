import React from "react";
import styles from "./Field.modules.scss";

const Field = ({ label, value, ...rest }) => (
  <div className={styles.field} {...rest}>
    <span className={styles.label}>{label}</span>
    <span className={styles.number}>{value}</span>
  </div>
);

export default Field;
