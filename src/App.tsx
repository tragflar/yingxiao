import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import BatchUpload from './pages/BatchUpload';
import Dashboard from './pages/Dashboard';
import MaterialList from './pages/MaterialList';
import AccountList from './pages/AccountList';
import SystemSettings from './pages/SystemSettings';
import UserOutreach from './pages/UserOutreach';
import ReturnVisitRules from './pages/ReturnVisitRules';
import OpeningConfiguration from './pages/OpeningConfiguration';
import BillingDashboard from './pages/BillingDashboard';
import RegionDashboard from './pages/RegionDashboard';
import InsightDashboard from './pages/InsightDashboard';
import AIMarketing from './pages/AIMarketing';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<BatchUpload />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="billing" element={<BillingDashboard />} />
        <Route path="region" element={<RegionDashboard />} />
        <Route path="insight" element={<InsightDashboard />} />
        <Route path="ai-marketing" element={<AIMarketing />} />
        <Route path="outreach" element={<UserOutreach />} />
        <Route path="return-visit-rules" element={<ReturnVisitRules />} />
        <Route path="opening-config" element={<OpeningConfiguration />} />
        <Route path="materials" element={<MaterialList />} />
        <Route path="accounts" element={<AccountList />} />
        <Route path="settings" element={<SystemSettings />} />
      </Route>
    </Routes>
  );
}

export default App;
