import React from "react";
import styles from "./Field.modules.scss";

const Field = ({ label, value, className, ...rest }) => (
  <div className={`${styles.field} ${className}`} {...rest}>
    <span className={styles.label}>{label}</span>
    <span className={styles.number}>{value}</span>
  </div>
);

export default Field;
