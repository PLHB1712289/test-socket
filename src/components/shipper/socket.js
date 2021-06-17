import io from "socket.io-client";
import { TAG_EVENT } from "../TAG_EVENT";
import store from "../../redux";
import {
  deleteOrderShipper,
  newOrder,
  updateStatusShipper,
} from "../../redux/reducers/shipper";
import jwt from "jsonwebtoken";
import generateObjectID from "../customer/util";

const config = { SERVER_URL_SOCKET: "http://localhost:8010" };

const infoShipper = (shipperID) => ({
  // id: "60abbfaabfbb5a38c0558d40",
  id: shipperID || "61b7a2fc53834634c61332b3",
  // id: generateObjectID(),
  exp: new Date().getTime() / 1000 + 60 * 60 * 24,
  iat: new Date().getTime() / 1000,
  role: "shipper",
});

const getToken = (shipperID) =>
  jwt.sign(infoShipper(shipperID), "final-project");

console.log(getToken());

const Socket = class {
  constructor() {
    this.socket = null;
  }

  async connect(shipperID) {
    const token = await getToken(shipperID);

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

    this.socket.on(TAG_EVENT.RESPONSE_SHIPPER_RECONNECT, (res) => {
      const listOrder = res.data.listOrder;
      console.log(res.data);
      listOrder.forEach((order) => {
        store.dispatch(newOrder(order));
      });
    });

    this.socket.on(TAG_EVENT.RESPONSE_DISCONNECT_ROOM, (res) =>
      console.log(res)
    );

    this.socket.on(TAG_EVENT.RESPONSE_SHIPPER_SKIP_CONFIRM_ORDER, (res) => {
      store.dispatch(deleteOrderShipper(res.data.orderID));
    });

    this.socket.on(TAG_EVENT.RESPONSE_SHIPPER_CONFIRM_ORDER, (res) => {
      console.log(res);
      store.dispatch(newOrder({ id: res.data._id, status: res.data.Status }));
    });

    this.socket.on(TAG_EVENT.RESPONSE_SHIPPER_CONFIRM_ORDER_FAILED, (res) => {
      alert(res.message);
      store.dispatch(deleteOrderShipper(res.data.orderID));
    });

    this.socket.on(TAG_EVENT.RESPONSE_CHANGE_STATUS_ROOM, (res) => {
      store.dispatch(updateStatusShipper(res.data));
    });

    this.socket.on(TAG_EVENT.RESPONSE_CHAT, (res) => console.log(res));

    this.socket.on(TAG_EVENT.RESPONSE_NOTIFICATION, (res) => console.log(res));

    return this.socket;
  }

  confirmOrder(orderID) {
    this.socket.emit(TAG_EVENT.REQUEST_SHIPPER_CONFIRM_ORDER, { orderID });
  }

  skipOrder(orderID) {
    this.socket.emit(TAG_EVENT.REQUEST_SHIPPER_SKIP_ORDER, { orderID });
    store.dispatch(deleteOrderShipper(orderID));
  }

  updateCoor(coor) {
    this.socket.emit(TAG_EVENT.REQUEST_SHIPPER_CHANGE_COOR, { coor });
  }

  cancelOrder(orderID) {
    this.socket.emit(TAG_EVENT.REQUEST_SHIPPER_CANCEL_ORDER, { orderID });
  }

  tookFood(orderID) {
    this.socket.emit(TAG_EVENT.REQUEST_SHIPPER_TOOK_FOOD, { orderID });
  }

  delivered(orderID) {
    this.socket.emit(TAG_EVENT.REQUEST_SHIPPER_DELIVERED, { orderID });
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

  sendMess(roomID, message) {
    this.socket.emit(TAG_EVENT.REQUEST_CHAT, { roomID, message });
  }
};

const socket = new Socket();

export default socket;
