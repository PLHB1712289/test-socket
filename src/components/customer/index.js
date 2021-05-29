import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import socket, { getToken } from "./socket";
import generateObjectID, { convertStatusCode, ORDER_STATUS } from "./util";
import axios from "axios";
import { newOrder } from "../../redux/reducers/customer";
const Customer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    socket.connect();

    return () => socket.disconnect();
  }, []);

  const listOrder = useSelector((state) => state.customer);
  const [restaurantID, setRestaurantID] = useState("");

  return (
    <div className="customer">
      <div>
        <input
          className="id-restaurant"
          value={restaurantID}
          onChange={(e) => setRestaurantID(e.target.value)}
        />

        <button
          onClick={async () => {
            //  socket.createOrder(restaurantID);
            const data = {
              foods: [
                {
                  id: "60a79a9cb7245f28182cf906",
                  price: 104000,
                  quantity: 1,
                },
                {
                  id: "60a79a9cb7245f28182cf90a",
                  price: 35000,
                  quantity: 1,
                },
              ],
              subtotal: 139000,
              shippingfee: 10000,
              address: "273 Nguyễn Văn Cừ, P. 4, Quận 5, TP. HCM",
              phone: "0331234567",
              longitude: 100.1234567,
              latitude: 10.1234567,
              method: 0,
            };

            const res = await axios.post("http://localhost:8000/orders", data, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
              },
            });

            const orderID = res.data.data.id;
            dispatch(newOrder({ id: orderID, status: 0 }));
          }}
        >
          Create Order
        </button>
      </div>

      <div>
        {listOrder.map((order) => {
          return (
            <div>
              {order.id} - {convertStatusCode(order.status)}
              {order.status < ORDER_STATUS.DURING_GET && (
                <button onClick={() => socket.cancelOrder(order.id)}>
                  Cancel
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Customer;
