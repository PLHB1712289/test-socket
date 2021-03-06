import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { convertStatusCode, ORDER_STATUS } from "../customer/util";
import socket from "./socket";

const Shipper = () => {
  useEffect(() => {
    return () => socket.disconnect();
  }, []);

  const listOrder = useSelector((state) => state.shipper);
  const [shipperID, setShipperID] = useState("61b7a2fc53834634c61332b3");

  const [coor, setCoor] = useState({ lat: 0, lng: 0 });

  const handleSubmiForm = (e) => {
    e.preventDefault();

    socket.updateCoor(coor);
  };

  const [room, setRoom] = useState("");
  const [mess, setMess] = useState("");

  return (
    <div>
      listShipper: 60abbfaabfbb5a38c0558d40, 61b7a2fc53834634c61332b3 Shipper:{" "}
      {shipperID}
      <div>
        ID:
        <input
          value={shipperID}
          onChange={(e) => setShipperID(e.target.value)}
        />
        <button
          onClick={() => {
            socket.connect(shipperID);
          }}
        >
          connect
        </button>
      </div>
      <form onSubmit={handleSubmiForm}>
        <input
          type="number"
          placeholder="lat"
          value={coor.lat}
          onChange={(e) => {
            setCoor((prevCoor) => ({ ...prevCoor, lat: e.target.value }));
          }}
        />
        <input
          type="number"
          placeholder="lng"
          value={coor.lng}
          onChange={(e) => {
            setCoor((prevCoor) => ({ ...prevCoor, lng: e.target.value }));
          }}
        />

        <button type="submit">Update Coor</button>
      </form>
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
        {listOrder.map((order) => (
          <div key={order.id}>
            {order.id} - {convertStatusCode(order.status)}
            {order.status === ORDER_STATUS.MERCHANT_CONFIRM && (
              <div>
                <button onClick={() => socket.confirmOrder(order.id)}>
                  Confirm
                </button>
                <button onClick={() => socket.skipOrder(order.id)}>Skip</button>
              </div>
            )}
            {order.status === ORDER_STATUS.DURING_GET && (
              <div>
                <button onClick={() => socket.tookFood(order.id)}>
                  Took food
                </button>
                <button onClick={() => socket.cancelOrder(order.id)}>
                  Cancel
                </button>
              </div>
            )}
            {order.status === ORDER_STATUS.DURING_SHIP && (
              <div>
                <button onClick={() => socket.delivered(order.id)}>
                  Delivered
                </button>
                <button onClick={() => socket.cancelOrder(order.id)}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shipper;
