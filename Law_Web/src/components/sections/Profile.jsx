import React from "react";

const Profile = ({ onClose }) => {
  return (
    <div className="absolute right-4 top-20 z-50 bg-[#1e1e1e] text-white rounded-2xl shadow-xl w-[600px] p-6">
      <h2 className="text-3xl font-bold mb-2">Profile</h2>
      <p className="text-sm text-gray-400 mb-6">View all your profile details here.</p>
      <div className="grid grid-cols-2 gap-6">
       
        <div className="flex flex-col items-center text-center border border-gray-700 p-4 rounded-xl">
          <img
            src="https://i.imgur.com/WxNkKXl.png" // replace with actual image or avatar
            alt="Profile"
            className="w-36 h-36 rounded-full mb-4"
          />
          <h3 className="text-xl font-semibold">Maria Fernanda</h3>
          <span className="text-green-400 font-medium">Premium User</span>
        </div>

        
        <div className="border border-gray-700 p-4 rounded-xl">
          <h4 className="text-lg font-semibold mb-4">Bio & other details</h4>
          <div className="space-y-2 text-sm">
            <p><span className="font-semibold">My Role:</span> Beatmaker</p>
            <p><span className="font-semibold">My Experience Level:</span> Intermediate</p>
            <p><span className="font-semibold">My 3 Favorite Artists:</span> Ninho, Travis Scott, Metro Boomin</p>
            <p><span className="font-semibold">My Favorite Music Genre:</span> Trap</p>
            <p><span className="font-semibold">The Software I Use:</span> Ableton</p>
            <p><span className="font-semibold">My Preferred Music Mood:</span> Melancholic</p>
            <p><span className="font-semibold">My Region:</span> California, USA</p>
            <p><span className="font-semibold">Badges:</span> 🧿 Top Collaborator</p>
            <p>
              <span className="font-semibold">Availability:</span>{" "}
              <span className="text-green-400">Available for Collaboration</span>
            </p>
            <p><span className="font-semibold">Tags:</span> #Drill, #Melancholic, #Rap-US</p>
          </div>
        </div>
      </div>
      <button
        onClick={onClose}
        className="mt-4 text-sm text-gray-400 hover:text-white underline"
      >
        Close
      </button>
    </div>
  );
};

export default Profile;
