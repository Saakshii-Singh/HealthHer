import { useState } from "react";

function Profile() {
  const storedUser = JSON.parse(localStorage.getItem("userInfo"));

  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(storedUser);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const saveChanges = () => {
    localStorage.setItem("userInfo", JSON.stringify(user));
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4">

      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md text-center">

        {/* AVATAR */}
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 rounded-full bg-pink-100 flex items-center justify-center text-3xl text-pink-500 font-bold shadow">
            {user?.name?.charAt(0)}
          </div>
        </div>

        <h1 className="text-2xl font-bold text-pink-500 mb-4">
          My Profile
        </h1>

        {/* FORM */}
        <div className="text-left space-y-4">

          {/* NAME */}
          <div>
            <label className="text-sm text-gray-500">Name</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg"
              />
            ) : (
              <p className="text-lg font-medium">{user?.name}</p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-500">Email</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg"
              />
            ) : (
              <p className="text-lg font-medium">{user?.email}</p>
            )}
          </div>
        </div>

        {/* BUTTONS */}
        <div className="mt-6 flex justify-center gap-4">
          {isEditing ? (
            <>
              <button
                onClick={saveChanges}
                className="bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600"
              >
                Save
              </button>

              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 px-4 py-2 rounded-full"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;