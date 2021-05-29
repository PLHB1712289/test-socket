import { createSlice } from "@reduxjs/toolkit";

const customer = createSlice({
  name: "customer",
  initialState: [],
  reducers: {
    newOrderCustomer(state, action) {
      state.push(action.payload);
    },
    updateStatusCustomer(state, action) {
      state.forEach((order) => {
        if (order.id !== action.payload.orderID) return;

        order.status = action.payload.status;
      });
    },
  },
});

const { actions, reducer } = customer;
export const newOrder = actions.newOrderCustomer;
export const { updateStatusCustomer } = actions;

export default reducer;
