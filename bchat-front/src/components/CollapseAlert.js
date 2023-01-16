import React from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";

export const ALERT_TYPE = {
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
  SUCCESS: "success",
};
const CollapseAlert = ({
  children,
  alertType,
  isOpen = false,
  ...otherProps
}) => {
  return (
    <Box sx={{ width: "100%" }}>
      <Collapse in={isOpen}>
        <Alert severity={alertType} {...otherProps} sx={{ mb: 2 }}>
          {isOpen && children}
        </Alert>
      </Collapse>
    </Box>
  );
};
export default CollapseAlert;
