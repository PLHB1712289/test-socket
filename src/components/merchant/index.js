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
      <div>Merchant ID: 60a771e2b7245f28182cf82f</div>
      <div>Merchant name: Trà Sữa Tiên Hưởng - Cống Quỳnh</div>
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
