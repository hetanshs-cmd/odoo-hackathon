import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { router } from "./routes";
import { Toaster } from "./components/ui/toaster";
import { ThemeProvider } from "./contexts/ThemeContext";

const queryClient = new QueryClient();

function App() {
  // Main application root component
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
