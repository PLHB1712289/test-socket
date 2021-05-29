import { configureStore } from "@reduxjs/toolkit";
import shipper from "./reducers/shipper";
import merchant from "./reducers/merchant";
import customer from "./reducers/customer";

const store = configureStore({
  reducer: {
    shipper,
    merchant,
    customer,
  },
});

export default store;
