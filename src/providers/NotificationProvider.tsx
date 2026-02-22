import { type ReactNode, useEffect } from "react";
import { SnackbarProvider, useSnackbar } from "notistack";
import { AppSnackbar } from "@/components/common/AppSnackbar";
import { setEnqueueSnackbar } from "@/lib/notification/notificationRef";

interface NotificationProviderProps {
  children: ReactNode;
}

const NotificationRefSetter = ({ children }: { children: ReactNode }) => {
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setEnqueueSnackbar(enqueueSnackbar);
  }, [enqueueSnackbar]);

  return <>{children}</>;
};

export const NotificationProvider = ({
  children,
}: NotificationProviderProps) => {
  return (
    <SnackbarProvider
      maxSnack={5}
      Components={{
        error: AppSnackbar,
        success: AppSnackbar,
        warning: AppSnackbar,
      }}
    >
      <NotificationRefSetter>{children}</NotificationRefSetter>
    </SnackbarProvider>
  );
};
