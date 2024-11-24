export const ORDER_STATUS = {
  PENDING: "Chờ xác nhận",
  PROCESSING: "Đang xử lý",
  DELIVERED: "Đang vận chuyển",
  SUCCESS: "Hoàn tất",
  CANCELLED: "Đã hủy bởi bạn",
  REJECT: "Đã hủy bởi người bán",
};

export const ADMIN_ORDER_STATUS = {
  PENDING: "Chờ xác nhận",
  PROCESSING: "Đang xử lý",
  DELIVERED: "Đang vận chuyển",
  SUCCESS: "Hoàn tất",
  CANCELLED: "Đã hủy bởi người mua",
  REJECT: "Đã hủy bởi người bán",
}

export const ORDER_ACTION_TITLE = {
  PENDING: "Xác nhận chuẩn bị hàng?",
  PROCESSING: `Sẵn sàng giao?`,
  DELIVERED: "Xác nhận giao hàng thành công?",
};

export const ORDER_ACTION_DESCRIPTION = {
  PENDING: "Vui lòng kiểm tra lại chi tiết đơn hàng trước khi tiếp tục.",
  PROCESSING: `Vui lòng đảm bảo mọi chi tiết đơn hàng đã được kiểm tra trước khi tiếp tục.`,
  DELIVERED: "Vui lòng kiểm tra kỹ trước khi hoàn tất.",
};