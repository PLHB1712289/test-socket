const generateObjectID = () => {
  // return "6055849d6480d31ec55b2898"
  return "xxxxxxxxxxxxxxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const ENUM = (function* () {
  var index = 0;
  while (true) yield index++;
})();

export const ORDER_STATUS = {
  WAITING_PAYMENT: ENUM.next().value,
  WAITING: ENUM.next().value,
  MERCHANT_CONFIRM: ENUM.next().value,
  DURING_GET: ENUM.next().value,
  // SHIPPER_ARRIVED: ENUM.next().value,
  DURING_SHIP: ENUM.next().value,
  DELIVERED: ENUM.next().value,
  CANCEL_BY_CUSTOMER: ENUM.next().value,
  CANCEL_BY_MERCHANT: ENUM.next().value,
  CANCEL_BY_SHIPPER: ENUM.next().value,
};

export const convertStatusCode = (status) => {
  const STATUS = Object.keys(ORDER_STATUS);
  return STATUS[Object.values(ORDER_STATUS).indexOf(status)];
};

export default generateObjectID;
