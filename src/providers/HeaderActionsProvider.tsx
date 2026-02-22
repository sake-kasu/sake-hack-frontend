import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type HeaderActionsContextValue = {
  actions: ReactNode | null;
  setActions: (actions: ReactNode | null) => void;
};

const HeaderActionsContext = createContext<
  HeaderActionsContextValue | undefined
>(undefined);

export const HeaderActionsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [actions, setActions] = useState<ReactNode | null>(null);

  return (
    <HeaderActionsContext.Provider value={{ actions, setActions }}>
      {children}
    </HeaderActionsContext.Provider>
  );
};

export const useHeaderActions = (): ReactNode | null => {
  const context = useContext(HeaderActionsContext);
  if (context === undefined) {
    throw new Error(
      "useHeaderActions must be used within a HeaderActionsProvider",
    );
  }
  return context.actions;
};

export const useSetHeaderActions = (actions: ReactNode): void => {
  const context = useContext(HeaderActionsContext);
  if (context === undefined) {
    throw new Error(
      "useSetHeaderActions must be used within a HeaderActionsProvider",
    );
  }
  const { setActions } = context;

  const stableSetActions = useCallback(
    (value: ReactNode | null) => {
      setActions(value);
    },
    [setActions],
  );

  useEffect(() => {
    stableSetActions(actions);
    return () => {
      stableSetActions(null);
    };
  }, [actions, stableSetActions]);
};
