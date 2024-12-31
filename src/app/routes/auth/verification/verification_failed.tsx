export default function VerificationFailed() {
  return (
    <div className="flex flex-col h-[100vh] items-center justify-center gap-10">
      <h1 className="text-2xl font-bold text-red-800">
        Xác minh không thành công
      </h1>
      <div className="flex flex-col items-center gap-5">
        <span>Rất tiếc, chúng tôi không thể xác minh email của bạn.</span>
        <span>Vui lòng thử lại sau.</span>
      </div>
    </div>
  );
}
