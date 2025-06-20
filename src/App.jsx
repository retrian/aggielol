// src/App.jsx
import { Routes, Route } from "react-router-dom";
import NavBar      from "./components/NavBar";

import Home        from "./pages/Home";
import Teams       from "./pages/Teams";
import Players     from "./pages/Players";
import Leaderboard from "./pages/Leaderboard";
import Schedule    from "./pages/Schedule";
import Streams     from "./pages/Streams";
import Profile     from "./pages/Profile";
import About       from "./pages/About";

import TeamDetail      from "./pages/TeamDetail";
import PlayerProfile   from "./pages/PlayerProfile";

// quick sanity check inside any component
useEffect(() => {
  fetch(`${import.meta.env.VITE_API_BASE_URL}/api/leaderboard/entries`)
    .then(r => r.json())
    .then(d => console.log('API HEALTH →', d))
    .catch(err => console.error('API FAIL →', err));
}, []);


export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/"              element={<Home />} />
        <Route path="/teams"         element={<Teams />} />
        <Route path="/teams/:slug"   element={<TeamDetail />} /> 
        <Route path="/players"       element={<Players />} />
        <Route path="/players/:id"   element={<PlayerProfile />} />
        <Route path="/leaderboard"   element={<Leaderboard />} />
        <Route path="/schedule"      element={<Schedule />} />
        <Route path="/streams"       element={<Streams />} />
        <Route path="/about"         element={<About />} />
        <Route path="/profile"       element={<Profile />} />
      </Routes>
    </>
  );
}
