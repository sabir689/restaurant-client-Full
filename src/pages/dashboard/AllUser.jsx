import { useQuery } from "@tanstack/react-query";
import { FaTrashAlt, FaUsers, FaUserShield } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const AllUsers = () => {
    const axiosSecure = useAxiosSecure();
    const { data: users = [], refetch } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users');
            return res.data;
        }
    });

    // Handle Role Change (Make Admin or Revoke)
    const handleUpdateRole = (user, newRole) => {
        const actionText = newRole === 'admin' ? "Make Admin" : "Revoke Admin";
        
        Swal.fire({
            title: `Are you sure?`,
            text: `You want to ${actionText} for ${user.name}`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#D1A054",
            cancelButtonColor: "#d33",
            confirmButtonText: `Yes, ${newRole === 'admin' ? 'Promote' : 'Demote'}!`
        }).then((result) => {
            if (result.isConfirmed) {
                // Ensure your backend patch route can handle the newRole in the body or params
                axiosSecure.patch(`/users/role/${user._id}`, { role: newRole })
                    .then(res => {
                        if (res.data.modifiedCount > 0) {
                            refetch();
                            Swal.fire({
                                icon: "success",
                                title: "Updated!",
                                text: `${user.name} is now a ${newRole}.`,
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
            title: "Are you sure?",
            text: "This user will be permanently removed!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete them!"
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.delete(`/users/${user._id}`)
                    .then(res => {
                        if (res.data.deletedCount > 0) {
                            refetch();
                            Swal.fire("Deleted!", "User has been removed.", "success");
                        }
                    });
            }
        });
    };

    return (
        <div className="bg-gray-400 p-8 rounded-lg shadow-md">
            <div className="flex justify-between items-center text-black mb-8 font-cinzel">
                <h2 className="text-3xl font-bold">All Users</h2>
                <h2 className="text-3xl font-bold font-sans">Total: {users.length}</h2>
            </div>
            <div className="overflow-x-auto rounded-t-xl">
                <table className="table table-zebra w-full">
                    <thead className="bg-[#D1A054] text-black">
                        <tr>
                            <th className="py-4">#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user._id}>
                                <th>{index + 1}</th>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    {user.role === 'admin' ? (
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-green-600">Admin</span>
                                            <button
                                                onClick={() => handleUpdateRole(user, 'user')}
                                                className="btn btn-xs btn-outline btn-error"
                                                title="Revoke Admin Status"
                                            >
                                                Revoke
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleUpdateRole(user, 'admin')}
                                            className="btn bg-orange-500 hover:bg-orange-600 text-white"
                                        >
                                            <FaUsers className="text-xl" />
                                        </button>
                                    )}
                                </td>
                                <td>
                                    <button
                                        onClick={() => handleDeleteUser(user)}
                                        className="btn btn-ghost bg-red-600 text-white hover:bg-red-700"
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllUsers;