import { useQuery } from "@tanstack/react-query";
import { FaTrashAlt, FaUserShield, FaUserEdit, FaEnvelope, FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useState } from "react";

const AllUsers = () => {
    const axiosSecure = useAxiosSecure();
    const [searchTerm, setSearchTerm] = useState("");

    const { data: users = [], refetch } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users');
            return res.data;
        }
    });

    // Handle Role Change (Make Admin or Revoke)
    const handleUpdateRole = (user, newRole) => {
        const actionText = newRole === 'admin' ? "Promote to Admin" : "Demote to User";

        Swal.fire({
            title: "Are you sure?",
            text: `You are about to ${actionText} for ${user.name}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#D1A054",
            cancelButtonColor: "#333",
            confirmButtonText: `Yes, ${newRole === 'admin' ? 'Promote' : 'Demote'}!`
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.patch(`/users/role/${user._id}`, { role: newRole })
                    .then(res => {
                        if (res.data.modifiedCount > 0) {
                            refetch();
                            Swal.fire({
                                icon: "success",
                                title: "Updated!",
                                text: `${user.name} status: ${newRole}`,
                                showConfirmButton: false,
                                timer: 1500
                            });
                        }
                    });
            }
        });
    };

    const handleDeleteUser = user => {
        Swal.fire({
            title: "Delete User?",
            text: "This action cannot be undone!",
            icon: "error",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#333",
            confirmButtonText: "Yes, Delete"
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.delete(`/users/${user._id}`)
                    .then(res => {
                        if (res.data.deletedCount > 0) {
                            refetch();
                            Swal.fire("Deleted!", "User removed from system.", "success");
                        }
                    });
            }
        });
    };

    // Filter users based on search
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#f8f9fa] p-6 md:p-12 text-black">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto mb-10 overflow-hidden bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row items-stretch">
                <div className="bg-gradient-to-br from-[#D1A054] to-[#ab8141] p-10 text-white flex-1">
                    <h2 className="text-4xl font-black font-cinzel tracking-tighter">User Directory</h2>
                    <p className="mt-2 opacity-90 uppercase text-xs tracking-[0.3em] font-bold">Total Members: {users.length}</p>
                </div>

                <div className="p-10 flex items-center bg-white">
                    <div className="relative w-full md:w-80">
                        <input
                            type="text"
                            placeholder="Search accounts..."
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#D1A054] outline-none transition-all shadow-inner"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <FaSearch className="absolute left-4 top-5 text-gray-300" />
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="max-w-7xl mx-auto bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="py-6 px-10 text-gray-400 font-bold uppercase text-[10px] tracking-widest">Profile</th>
                                <th className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Access Level</th>
                                <th className="text-right px-10 text-gray-400 font-bold uppercase text-[10px] tracking-widest">Management</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50/50 transition-all border-b border-gray-50 last:border-0">
                                    <td className="py-6 px-10">
                                        <div className="flex items-center gap-5">
                                            <div className="avatar">
                                                <div className="bg-gradient-to-tr from-[#D1A054] to-[#f3dbb3] text-white rounded-2xl w-14 shadow-lg shadow-[#D1A054]/20 font-bold text-xl flex items-center justify-center overflow-hidden">
                                                    {user?.image ? (
                                                        /* Show Image if it exists */
                                                        <img
                                                            src={user.image}
                                                            alt={user.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        /* Fallback to Initial if image is missing */
                                                        <span>{user?.name?.charAt(0).toUpperCase() || "U"}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-800 text-lg">{user.name}</div>
                                                <div className="flex items-center gap-1 text-gray-400 text-sm">
                                                    <FaEnvelope className="text-[10px]" />
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td>
                                        {user.role === 'admin' ? (
                                            <div className="flex flex-col items-start gap-1">
                                                <span className="px-4 py-1.5 rounded-lg bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest border border-green-100">
                                                    Administrator
                                                </span>
                                                <button
                                                    onClick={() => handleUpdateRole(user, 'user')}
                                                    className="text-[10px] text-gray-300 hover:text-red-400 font-bold transition-colors ml-1"
                                                >
                                                    Revoke Access
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleUpdateRole(user, 'admin')}
                                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 hover:bg-[#D1A054] text-gray-400 hover:text-white transition-all group border border-gray-100 hover:border-[#D1A054]"
                                            >
                                                <FaUserShield className="text-sm" />
                                                <span className="text-[10px] font-bold uppercase tracking-wider">Grant Admin</span>
                                            </button>
                                        )}
                                    </td>

                                    {/* REPLACE THIS SECTION */}
                                    <td className="px-10">
                                        <div className="flex justify-end items-center gap-4">
                                            {/* Edit Button - Sleek & Subtle */}
                                            <button className="p-3 rounded-2xl bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-500 transition-all duration-300 shadow-sm border border-gray-100">
                                                <FaUserEdit className="text-lg" />
                                            </button>

                                            {/* Delete Button - This is the line that makes it bigger and better */}
                                            <button
                                                onClick={() => handleDeleteUser(user)}
                                                className="group flex items-center justify-center w-12 h-12 rounded-2xl bg-red-50 hover:bg-red-600 text-red-500 hover:text-white transition-all duration-300 shadow-md hover:shadow-red-200 border border-red-100"
                                                title="Delete User"
                                            >
                                                <FaTrashAlt className="text-xl transform group-hover:scale-110 transition-transform" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredUsers.length === 0 && (
                    <div className="p-20 text-center text-gray-300 font-cinzel text-xl uppercase tracking-widest">
                        No matches found
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllUsers;