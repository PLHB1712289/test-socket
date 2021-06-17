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

  const [room, setRoom] = useState("");
  const [mess, setMess] = useState("");

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
              shippingfee: 15000,
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

            console.log(res.data.data);

            const orderID = res.data.data.id;
            dispatch(newOrder({ id: orderID, status: 0 }));
          }}
        >
          Create Order
        </button>
      </div>

      <div style={{ margin: "20px 0" }}>
        Room:{" "}
        <input
          type="text"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        Mess:
        <input
          type="text"
          value={mess}
          onChange={(e) => setMess(e.target.value)}
        />
        <button
          onClick={() => {
            socket.sendMess(room, mess);
          }}
        >
          Send message
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
