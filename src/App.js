import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Customer from "./components/customer";
import Merchant from "./components/merchant";
import Shipper from "./components/shipper";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/customer">
          <Customer />
        </Route>
        <Route path="/merchant">
          <Merchant />
        </Route>
        <Route path="/shipper">
          <Shipper />
        </Route>
        <Route path="/">
          <ul className="menu">
            <li className="menu__item">
              <Link className="menu__link" to="/customer">
                Customer
              </Link>
            </li>

            <li className="menu__item">
              <Link className="menu__link" to="/merchant">
                Merchant
              </Link>
            </li>

            <li className="menu__item">
              <Link className="menu__link" to="/shipper">
                Shipper
              </Link>
            </li>
          </ul>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
