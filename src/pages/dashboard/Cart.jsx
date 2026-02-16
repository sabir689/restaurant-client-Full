import { FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import useCart from "../../hooks/useCart";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Cart = () => {
    const [cart, refetch] = useCart();
    const totalPrice = cart.reduce((total, item) => total + item.price, 0);
    const axiosSecure = useAxiosSecure();

    const handleDelete = id => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#D1A054", // Bistro theme gold
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.delete(`/carts/${id}`)
                    .then(res => {
                        if (res.data.deletedCount > 0) {
                            refetch();
                            Swal.fire({
                                title: "Deleted!",
                                text: "Item has been removed from cart.",
                                icon: "success"
                            });
                        }
                    })
            }
        });
    }

    return (
        <div className="bg-white p-10 rounded-lg shadow-xl">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-10 font-cinzel">
                <h2 className="text-3xl font-bold text-black uppercase">Total Orders: {cart.length}</h2>
                <h2 className="text-3xl text-black font-bold uppercase">Total Price: ${totalPrice.toFixed(2)}</h2>
                {cart.length ? 
                    <button className="btn bg-[#D1A054] border-none text-white hover:bg-[#b88d4a] px-8">
                        Pay
                    </button> 
                    : 
                    <button disabled className="btn btn-disabled px-8">Pay</button>
                }
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto rounded-t-xl">
                <table className="table w-full">
                    {/* head */}
                    <thead className="bg-[#D1A054] text-white uppercase">
                        <tr>
                            <th className="py-5">#</th>
                            <th>Item Image</th>
                            <th>Item Name</th>
                            <th>Price</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.map((item, index) => (
                            <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                                <td className="font-bold">
                                    {index + 1}
                                </td>
                                <td>
                                    <div className="avatar">
                                        <div className="mask mask-squircle w-16 h-16">
                                            <img src={item.image} alt={item.name} />
                                        </div>
                                    </div>
                                </td>
                                <td className="text-gray-600 font-medium">
                                    {item.name}
                                </td>
                                <td className="text-gray-600">
                                    ${item.price.toFixed(2)}
                                </td>
                                <td>
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="btn btn-ghost btn-md bg-red-600 hover:bg-red-700 text-white"
                                        title="Delete Item"
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {cart.length === 0 && (
                    <div className="text-center py-20 bg-gray-50 rounded-b-xl">
                        <p className="text-2xl font-cinzel text-gray-400">Your cart is empty</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;