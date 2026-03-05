import type { OptionsObject, SnackbarKey, SnackbarMessage } from "notistack";

type EnqueueSnackbar = (
  message: SnackbarMessage,
  options?: OptionsObject,
) => SnackbarKey;

let enqueueRef: EnqueueSnackbar | null = null;

export const setEnqueueSnackbar = (fn: EnqueueSnackbar): void => {
  enqueueRef = fn;
};

export const getEnqueueSnackbar = (): EnqueueSnackbar | null => {
  return enqueueRef;
};
