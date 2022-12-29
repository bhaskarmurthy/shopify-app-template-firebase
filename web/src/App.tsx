import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavigationMenu } from "@shopify/app-bridge-react";
import {
  AppBridgeProvider,
  QueryProvider,
  PolarisProvider,
} from "./components";
import Products from "./pages/products";

export default function App() {
  return (
    <BrowserRouter>
      <PolarisProvider>
        <AppBridgeProvider>
          <QueryProvider>
            <NavigationMenu
              navigationLinks={[
                {
                  label: "Page name",
                  destination: "/pagename",
                },
              ]}
            />
            <Routes>
              <Route path="/" element={<Products />} />
            </Routes>
          </QueryProvider>
        </AppBridgeProvider>
      </PolarisProvider>
    </BrowserRouter>
  );
}
