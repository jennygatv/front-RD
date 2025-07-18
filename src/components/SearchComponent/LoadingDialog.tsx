import { CircularProgress, Dialog, DialogContent } from "@mui/material";
import React from "react";
import styles from "@/styles/Search.module.css";

const LoadingDialog = ({
  open,
  loadingMsg,
}: {
  open: boolean;
  loadingMsg: string;
}) => {
  return (
    <Dialog open={open} fullWidth>
      <DialogContent>
        <div className={styles.loadingDialog}>
          <h6>{loadingMsg}</h6>
          <CircularProgress sx={{ color: "var(color--primary)" }} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoadingDialog;
