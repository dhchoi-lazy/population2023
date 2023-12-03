import logo from "./logo.svg";
import "./App.css";
import Cartogram from "./components/Cartogram";
import { Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <div className="App">
      {/* Direct URL Links */}
      <div>
        <Link to="/cartogram">Go to Cartogram Black</Link>
      </div>
      <div>
        <Link to="/cartogram/mbc">Go to Cartogram White</Link>
      </div>

      {/* Routes */}
      <Routes>
        <Route path="/cartogram" element={<Cartogram bgColor={"black"} />} />
        <Route
          path="/cartogram/mbc"
          element={<Cartogram bgColor={"white"} />}
        />
      </Routes>
    </div>
  );
}

export default App;
