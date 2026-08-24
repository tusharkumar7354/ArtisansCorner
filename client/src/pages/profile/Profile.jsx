import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Button from "../../components/common/Button";

const Profile = () => {
  const { user } = useAuth();

  const profileImage = user?.profileImage;
  const initials = (user?.name || "U").charAt(0).toUpperCase();

  return (
    <main className="mx-auto max-w-5xl space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black">My Profile</h1>

        <p className="mt-2 text-stone-600">View your account information.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Profile Card */}
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          {/* Profile Image */}
          <div className="mx-auto h-28 w-28 overflow-hidden rounded-full bg-amber-700">
            {profileImage ? (
              <img
                src={profileImage}
                alt={user?.name || "Profile"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-white">
                {initials}
              </div>
            )}
          </div>

          <h2 className="mt-6 text-2xl font-bold">
            {user?.name || "Not provided"}
          </h2>

          <p className="mt-2 break-all text-stone-500">
            {user?.email || "Not provided"}
          </p>

          <Link to="/profile/edit">
            <Button fullWidth className="mt-8">
              Edit Profile
            </Button>
          </Link>
        </div>

        {/* Account Details */}
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="mb-8 text-2xl font-bold">Account Details</h2>

          <div className="grid gap-x-10 gap-y-7 md:grid-cols-2">
            {/* Full Name */}
            <div>
              <p className="text-sm text-stone-500">Full Name</p>

              <p className="mt-2 font-semibold">
                {user?.name || "Not provided"}
              </p>
            </div>

            {/* Role */}
            <div>
              <p className="text-sm text-stone-500">Role</p>

              <p className="mt-2 font-semibold">
                {user?.roles?.join(", ") || "Buyer"}
              </p>
            </div>

            {/* Email */}
            <div>
              <p className="text-sm text-stone-500">Email</p>

              <p className="mt-2 break-all font-semibold">
                {user?.email || "Not provided"}
              </p>
            </div>

            {/* Phone */}
            {/* <div>
              <p className="text-sm text-stone-500">Phone</p>

              <p className="mt-2 font-semibold">
                {user?.phone || "Not provided"}
              </p>
            </div> */}

            {/* Seller */}
            <div>
              <p className="text-sm text-stone-500">Seller</p>

              <p className="mt-2 font-semibold">
                {user?.isSeller ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
