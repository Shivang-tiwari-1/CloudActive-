import React, { useContext, useEffect } from "react";
import UserContext from "../context/User/UserContext";
import AlertContext from "../context/Alert/AlertContext";

interface UserProfile {
  id: string;
  name: string;
  phone: string;
  created_at: string;
}

const Profile: React.FC = () => {
  const { getMe, user } = useContext(UserContext);
  const { showAlert } = useContext(AlertContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await getMe();
      } catch (error) {
        console.error(error);
        showAlert("Failed to fetch user profile", "danger");
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 text-center">
          My Profile
        </h1>

        <div className="mb-2 flex justify-between">
          <span className="font-semibold text-gray-700">Name:</span>
          <span className="text-gray-600">{user?.name ?? "error"}</span>
        </div>

        <div className="mb-2 flex justify-between">
          <span className="font-semibold text-gray-700">Phone:</span>
          <span className="text-gray-600">{user?.phone ?? "error"}</span>
        </div>

        <div className="mb-2 flex justify-between">
          <span className="font-semibold text-gray-700">User ID:</span>
          <span className="text-gray-600">{user?.id ?? "error"}</span>
        </div>

        <div className="mb-2 flex justify-between">
          <span className="font-semibold text-gray-700">Joined At:</span>
          <span className="text-gray-600">
            {user?.created_at ? new Date(user.created_at).toLocaleString() : "error"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
