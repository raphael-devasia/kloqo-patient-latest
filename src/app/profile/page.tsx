import ProfileForm from "@/components/profile-form";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Your Profile</h1>
        <p className="text-muted-foreground">
          View and update your personal and contact information.
        </p>
      </div>
      <ProfileForm />
    </div>
  );
}
