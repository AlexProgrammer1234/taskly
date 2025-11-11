import { Route, Routes } from "react-router-dom";
import Home from "../pages/home/Home";
import Analytics from "../pages/analytics/Analytics";
import Settings from "../pages/settings/Settings";

export default function AppRouter({ user }) {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/settings" element={<Settings user={user} />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
