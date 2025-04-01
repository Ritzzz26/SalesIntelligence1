import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/dashboard";
import Leads from "@/pages/leads";
import Pipeline from "@/pages/pipeline";
import Forecasting from "@/pages/forecasting";
import Team from "@/pages/team";
import SocialMediaDashboard from "@/pages/social-media";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/leads" component={Leads} />
        <Route path="/pipeline" component={Pipeline} />
        <Route path="/forecasting" component={Forecasting} />
        <Route path="/team" component={Team} />
        <Route path="/social-media" component={SocialMediaDashboard} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
