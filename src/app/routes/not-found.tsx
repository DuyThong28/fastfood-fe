import { Link } from "react-router-dom";

export default function NotFoundRoute() {
  return (
    <div className="mt-52 flex flex-col items-center font-semibold">
      <h1>404 - Không tìm thấy</h1>
      <p>Rất tiếc, trang bạn đang tìm kiếm không tồn tại.</p>
      <Link to="/" replace>
        Đi đến trang chủ
      </Link>
    </div>
  );
}
