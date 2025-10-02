import ProfileForm from "@/components/profile-form";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function EditProfilePage() {
  return (
    <div className="space-y-6">
       <div className="flex items-center relative justify-center mt-4">
        <Link href="/profile" className="absolute left-0">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-bold">Edit Profile</h1>
      </div>
       <div className="pt-4">
        <ProfileForm />
      </div>
    </div>
  );
}