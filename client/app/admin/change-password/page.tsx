import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ChangePassword() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="grid w-full max-w-sm items-center text-center">
        <h1 className="font-bold text-[32px] text-transparent bg-clip-text bg-gradient-to-r from-[#4caf50] via-[#76bf73] to-[#a0cf96]">
          Change your password
        </h1>
        <div className="pt-5">
          <Label htmlFor="password" className="pb-2 text-[#3E2723]">
            Password
          </Label>
          <Input
            type="password"
            id="password"
            placeholder="********"
            className="focus:outline-none focus:border-[#4CAF50] focus:shadow-sm focus:shadow-[#4CAF50]/30 transition-all duration-300"
          />
        </div>
        <div className="pt-5">
          <Label htmlFor="password" className="pb-2 text-[#3E2723]">
            Confirm Password
          </Label>
          <Input
            type="password"
            id="confirmPassword"
            placeholder="********"
            className="focus:outline-none focus:border-[#4CAF50] focus:shadow-sm focus:shadow-[#4CAF50]/30 transition-all duration-300"
          />
        </div>
        <div className="pt-5">
          <Button className="w-full bg-[#4CAF50] text-white py-5 px-4 rounded-md hover:bg-[#45a049] transition duration-200 cursor-pointer">
            Submit
          </Button>
        </div>
        <div className="pt-5">
          <Link href="/admin/login">
            <Button
              variant="link"
              className="cursor-pointer pt-3 text-[#3E2723]"
            >
              Go back to login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
