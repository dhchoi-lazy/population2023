import logo from "./logo.svg";
import "./App.css";
import Cartogram from "./components/Cartogram";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route
          path="/cartogram"
          element={<Cartogram bgColor={"black"} />}
        ></Route>
        <Route>
          <Route
            path="/cartogram/mbc"
            element={<Cartogram bgColor={"white"} />}
          ></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
