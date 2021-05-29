import io from "socket.io-client";
import { TAG_EVENT } from "../TAG_EVENT";
import jwt from "jsonwebtoken";
import store from "../../redux";
import { newOrder, updateStatusMerchant } from "../../redux/reducers/merchant";

const config = { SERVER_URL_SOCKET: "http://localhost:8010" };

const infoMerchant = {
  // id: "605590f06480d31ec55b289d",
  id: "60a77a2eb7245f28182cf831",
  exp: new Date().getTime() / 1000 + 60 * 60 * 24,
  role: "merchant",
  iat: new Date().getTime() / 1000,
};

const getToken = () => jwt.sign(infoMerchant, "final-project");

console.log(getToken());
// Token shipper:
// Token merchant:

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

    this.socket.on(TAG_EVENT.RESPONSE_MERCHANT_RECONNECT, (res) => {
      const listOrder = res.data.listOrder;
      console.log(res.data);
      listOrder.forEach((order) => {
        store.dispatch(newOrder(order));
      });
    });

    this.socket.on(TAG_EVENT.RESPONSE_DISCONNECT_ROOM, (res) =>
      console.log(res)
    );

    this.socket.on(TAG_EVENT.RESPONSE_MERCHANT_CONFIRM_ORDER, (res) => {
      console.log(res);
      store.dispatch(newOrder({ id: res.data._id, status: res.data.Status }));
    });

    this.socket.on(TAG_EVENT.RESPONSE_JOIN_ROOM, (res) => {
      console.log(res);
    });

    this.socket.on(TAG_EVENT.RESPONSE_CHANGE_STATUS_ROOM, (res) => {
      store.dispatch(updateStatusMerchant(res.data));
    });

    return this.socket;
  }

  confirmOrder(orderID) {
    if (!this.socket) return;

    this.socket.emit(TAG_EVENT.REQUEST_MERCHANT_CONFIRM_ORDER, {
      orderID,
    });
  }

  cancelOrder(orderID) {
    if (!this.socket) return;

    this.socket.emit(TAG_EVENT.REQUEST_MERCHANT_CANCEL_ORDER, {
      orderID,
    });
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
};

const socket = new Socket();

export default socket;
