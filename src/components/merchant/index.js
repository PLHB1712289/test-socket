import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { convertStatusCode, ORDER_STATUS } from "../customer/util";
import socket from "./socket";

const Merchant = () => {
  useEffect(() => {
    socket.connect();

    return () => socket.disconnect();
  }, []);

  const listOrder = useSelector((state) => state.merchant);

  const confirmOrder = (orderID) => {
    socket.confirmOrder(orderID);
  };

  const cancelOrder = (orderID) => {
    socket.cancelOrder(orderID);
  };

  return (
    <div>
      <div>Merchant ID: 605590f06480d31ec55b289d</div>
      <div>
        {listOrder.map((order) => (
          <div key={order.id} style={{ display: "flex" }}>
            <div>
              {order.id} - {convertStatusCode(order.status)}
            </div>

            {order.status === ORDER_STATUS.WAITING && (
              <>
                <button
                  onClick={() => {
                    confirmOrder(order.id);
                  }}
                >
                  Confirm
                </button>
                <button
                  onClick={() => {
                    cancelOrder(order.id);
                  }}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Merchant;
