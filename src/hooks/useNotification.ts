import { useCallback } from "react";
import { useSnackbar } from "notistack";

export const useNotification = () => {
  const { enqueueSnackbar } = useSnackbar();

  const notifySuccess = useCallback(
    (message: string) => {
      enqueueSnackbar(message, {
        variant: "success",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
    },
    [enqueueSnackbar],
  );

  const notifyError = useCallback(
    (message: string) => {
      enqueueSnackbar(message, {
        variant: "error",
        autoHideDuration: null,
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
    },
    [enqueueSnackbar],
  );

  const notifyWarning = useCallback(
    (message: string) => {
      enqueueSnackbar(message, {
        variant: "warning",
        autoHideDuration: 5000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
    },
    [enqueueSnackbar],
  );

  return { notifySuccess, notifyError, notifyWarning };
};
