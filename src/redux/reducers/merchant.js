import { createSlice } from "@reduxjs/toolkit";

const merchant = createSlice({
  name: "merchant",
  initialState: [],
  reducers: {
    newOrderMerchant(state, action) {
      state.push(action.payload);
    },
    updateStatusMerchant(state, action) {
      state.forEach((order) => {
        if (order.id !== action.payload.orderID) return;

        order.status = action.payload.status;
      });
    },
  },
});

const { actions, reducer } = merchant;
export const newOrder = actions.newOrderMerchant;
export const { updateStatusMerchant } = actions;
export default reducer;
