export default function VerificationFailed() {
    return (
      <div className="flex flex-col h-[100vh] items-center justify-center gap-10">
        <h1 className="text-2xl font-bold text-red-800">Verification Failed</h1>
        <div className="flex flex-col items-center gap-5">
          <span>Sorry, we couldn't verify your email.</span>
          <span>Please try again later.</span>
        </div>
      </div>
    );
  }
  