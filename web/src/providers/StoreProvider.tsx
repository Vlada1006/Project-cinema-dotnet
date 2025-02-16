"use client";

import { AppStore, makeStore } from "@/stores/store";
import { SessionProvider } from "next-auth/react";
import { useRef } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>(undefined);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <SessionProvider>
      <Provider store={storeRef.current}>
        <PersistGate loading={null} persistor={storeRef.current.__persistor}>
          {children}{" "}
        </PersistGate>
      </Provider>
    </SessionProvider>
  );
}
