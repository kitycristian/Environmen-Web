import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import Portal from "@/pages/Portal";
import PortalAdmin from "@/pages/PortalAdmin";
import Vera from "@/components/Vera";

const queryClient = new QueryClient();

function AppContent() {
  const path = window.location.pathname;

  if (path.startsWith("/portal-admin")) {
    return <PortalAdmin />;
  }

  if (path.startsWith("/portal")) {
    return <Portal />;
  }

  return (
    <>
      <Home />
      <Vera />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
