import "./App.css";
import LiquidEther from "./components/liquidEther/LiquidEther";
import Login from "./pages/login/Login";
import { auth } from "./db/firebase.config.js";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import Dock from "./components/dock/Dock.jsx";
import PlaylistAddCheckRoundedIcon from "@mui/icons-material/PlaylistAddCheckRounded";
import SettingsSuggestRoundedIcon from "@mui/icons-material/SettingsSuggestRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import AppRouter from "./routes/AppRouter.jsx";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const dockItems = [
    {
      icon: <PlaylistAddCheckRoundedIcon sx={{ fontSize: "30px" }} />,
      label: "Your Tasks",
      path: "/",
    },
    {
      icon: <InsightsRoundedIcon sx={{ fontSize: "30px" }} />,
      label: "Analytics",
      path: "/analytics",
    },
    {
      icon: <SettingsSuggestRoundedIcon sx={{ fontSize: "30px" }} />,
      label: "Settings",
      path: "/settings",
    },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      {user ? (
        <div className="app__content">
          <AppRouter user={user} />
          <Dock
            items={dockItems}
            panelHeight={60}
            baseItemSize={42}
            magnification={65}
          />
        </div>
      ) : (
        <Login loading={loading} />
      )}
      <LiquidEther
        colors={["#3c096c", "#5a189a", "#9d4edd"]}
        mouseForce={20}
        cursorSize={100}
        isViscous={true}
        viscous={10}
        iterationsViscous={32}
        iterationsPoisson={32}
        resolution={0.5}
        isBounce={false}
        autoDemo={true}
        autoSpeed={0.5}
        autoIntensity={2.2}
        takeoverDuration={0.25}
        autoResumeDelay={1000}
        autoRampDuration={0.6}
      />
    </div>
  );
}

export default App;
