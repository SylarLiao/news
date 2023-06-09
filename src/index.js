import "./index.css";
import ReactDOM from "react-dom/client";
import IndexRouter from "./router/IndexRouter";
import "./util/http";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <IndexRouter></IndexRouter>
);
