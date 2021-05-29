import io from "socket.io-client";
import jwt from "jsonwebtoken";
import generateObjectID, { ORDER_STATUS } from "./util";
import store from "../../redux";
import { newOrder, updateStatusCustomer } from "../../redux/reducers/customer";
import { TAG_EVENT } from "../TAG_EVENT";
// import { TAG_EVENT } from "../TAG_EVENT";

const config = { SERVER_URL_SOCKET: "http://localhost:8010" };

const infoCustomer = {
  id: "60abbfaabfbb5a38c0558d40",
  exp: new Date().getTime() / 1000 + 60 * 60 * 24,
  role: "customer",
  iat: new Date().getTime() / 1000,
};

export const getToken = () => jwt.sign(infoCustomer, "final-project");

const Socket = class {
  constructor() {
    this.socket = null;
  }

  async connect() {
    const token = await getToken();

    this.socket = io.connect(config.SERVER_URL_SOCKET);

    this.socket.on("connect", () => {
      this.socket.emit("authenticate", { token });
    });

    this.socket.on("unauthenticate", (message) => {
      // alert(message);
      // success
    });

    this.socket.on("authenticated", (message) => {
      // alert(message);
      // failed
    });

    this.socket.on(TAG_EVENT.RESPONSE_JOIN_ROOM, (res) => {
      console.log(res);
    });

    this.socket.on(TAG_EVENT.RESPONSE_DISCONNECT_ROOM, (res) =>
      console.log(res)
    );

    this.socket.on(TAG_EVENT.RESPONSE_CUSTOMER_RECONNECT, (res) => {
      const listOrder = res.data.listOrder;
      console.log(res.data);
      listOrder.forEach((order) => {
        store.dispatch(newOrder(order));
      });
    });

    // KH -> chi tiet don hang -> JOIN this.socket.emit(TAG.REQUEST_JOIN_ROOM)
    this.socket.on(TAG_EVENT.RESPONSE_CHANGE_STATUS_ROOM, (res) => {
      // check order is canceled
      const { status } = res.data;
      console.log(res);
      switch (status) {
        case ORDER_STATUS.CANCEL_BY_MERCHANT:
          alert("Order has been cancelled by merchant");
          break;

        case ORDER_STATUS.CANCEL_BY_SHIPPER:
          alert("Order has been cancelled by shipper");
          break;

        default:
          break;
      }

      store.dispatch(updateStatusCustomer(res.data));
    });

    this.socket.on(TAG_EVENT.RESPONSE_SHIPPER_CHANGE_COOR, (res) => {
      console.log(res);
    });

    return this.socket;
  }

  cancelOrder(orderID) {
    this.socket.emit(TAG_EVENT.REQUEST_CUSTOMER_CANCEL_ORDER, { orderID });
  }

  disconnect() {
    this.socket.disconnect();
    this.socket = null;
  }

  addCallback(tag, callback) {
    this.socket.on(tag, callback);
  }

  removeCallback(tag) {
    this.socket.removeListener(tag);
  }

  createOrder(restaurantID) {
    const order = {
      restaurantID,
      orderID: generateObjectID(),
    };
    this.socket.emit("new order", order);
    this.socket.emit(TAG_EVENT.REQUEST_JOIN_ROOM, { orderID: order.orderID });

    store.dispatch(newOrder({ id: order.orderID, status: 0 }));
  }
};

const socket = new Socket();

export default socket;
