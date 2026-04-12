import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme";
import Home from "@/pages/Home";

function App() {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Home />
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
