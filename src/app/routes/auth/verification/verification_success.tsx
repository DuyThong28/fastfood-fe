import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function VerificationSuccess() {

  return (
    <div className="h-[100vh] flex flex-col items-center justify-center gap-10">
      <span className="font-bold text-2xl">Verification Success</span>
      <div className="flex flex-col">
        <span>
          Thank you for your support, we have successfully verified your email.
        </span>
        <span className="text-center">You can now login to your account.</span>
      </div>
      <Button>
        <Link to="/auth/sign-in">Go to the log in page</Link>
      </Button>
    </div>
  );
}
