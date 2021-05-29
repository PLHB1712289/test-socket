import { createSlice } from "@reduxjs/toolkit";

const shipper = createSlice({
  name: "shipper",
  initialState: [],
  reducers: {
    newOrderShipper(state, action) {
      console.log("NEW ORDER, DO YOU WANNA GET IT?");
      state.push(action.payload);
    },

    deleteOrderShipper(state, action) {
      // const indexOrder = state.map((order) => order.id).indexOf(action.payload);

      // if (indexOrder < 0) return;

      // state.splice(indexOrder, 1);

      return state.filter((order) => order.id !== action.payload);
    },

    updateStatusShipper(state, action) {
      state.forEach((order) => {
        if (order.id !== action.payload.orderID) return;

        order.status = action.payload.status;
      });
    },
  },
});

const { actions, reducer } = shipper;
export const newOrder = actions.newOrderShipper;
export const { deleteOrderShipper, updateStatusShipper } = actions;
export default reducer;
