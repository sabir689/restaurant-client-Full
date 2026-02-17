import { FaEdit, FaTrashAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useMenu from "../../hooks/UseMenu";

const ManageItems = () => {
    const axiosSecure = useAxiosSecure();
    // We only need refetch from the hook; menu/loading are handled locally for pagination
    const [, , refetch] = useMenu();

    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [paginatedMenu, setPaginatedMenu] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);

    // 1. Fetch paginated data
    const fetchCurrentPage = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axiosSecure.get(`/menu?page=${currentPage}&size=${itemsPerPage}`);
            setPaginatedMenu(res.data.result || []);
            setTotalCount(res.data.count || 0);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    }, [axiosSecure, currentPage, itemsPerPage]);

    // 2. Load data on mount and when page/size changes
    useEffect(() => {
        fetchCurrentPage();
    }, [fetchCurrentPage]);

    const handleItemsPerPage = (e) => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(0);
    };

    // 3. Delete Handler
    const handleDeleteItem = async (item) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: `You are removing ${item.name}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#B58130",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        });

        if (!result.isConfirmed) return;

        try {
            const res = await axiosSecure.delete(`/menu/${item._id}`);

            if (res.data.deletedCount > 0) {
                // UI: Update locally first for instant feedback
                setPaginatedMenu((prev) => prev.filter((i) => i._id !== item._id));
                setTotalCount((prev) => prev - 1);

                Swal.fire({
                    title: "Deleted!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1000
                });

                // Sync: Update the global useMenu state
                if (typeof refetch === 'function') {
                    refetch();
                }

                // Logic: Handle page jumps or refills
                if (paginatedMenu.length === 1 && currentPage > 0) {
                    setCurrentPage((prev) => prev - 1);
                } else {
                    setTimeout(() => {
                        fetchCurrentPage().catch(() => { });
                    }, 500);
                }
            } else {
                Swal.fire("Note", "Item could not be found.", "info");
            }
        } catch (error) {
            console.error("Delete error:", error);
            Swal.fire("Error!", "Failed to delete item from server.", "error");
        }
    };

    const numberOfPages = Math.ceil(totalCount / itemsPerPage);
    const pages = [...Array(numberOfPages).keys()];

    return (
        <div className="w-full min-h-screen pb-10 px-4 md:px-0">
            {/* Header */}
            <div className="mb-10">
                <p className="text-[#B58130] font-bold tracking-[0.3em] uppercase text-xs mb-2">Inventory Control</p>
                <h2 className="text-4xl font-black text-gray-800 uppercase tracking-tight font-cinzel">
                    Manage All <span className="text-[#B58130]">Items</span>
                </h2>
                <div className="h-1 w-20 bg-[#B58130] mt-3 rounded-full"></div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Toolbar */}
                <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h3 className="text-xl font-bold text-gray-700 uppercase">Stock Overview</h3>
                        <p className="text-sm text-gray-400 font-medium">Total: {totalCount}</p>
                    </div>
                    <select
                        value={itemsPerPage}
                        onChange={handleItemsPerPage}
                        className="select select-bordered select-sm font-bold text-[#B58130]"
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                    </select>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr className="text-gray-400 uppercase text-xs h-14 border-b border-gray-100">
                                <th className="pl-8">#</th>
                                <th>Item Details</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-10">
                                        <span className="loading loading-spinner text-warning"></span>
                                    </td>
                                </tr>
                            ) : (
                                paginatedMenu.map((item, index) => (
                                    <tr key={item._id} className="hover:bg-gray-50 transition-all border-b border-gray-50">
                                        <td className="pl-8 font-bold text-gray-300">
                                            {(currentPage * itemsPerPage) + index + 1}
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-4">
                                                <div className="mask mask-squircle w-12 h-12 shadow-sm">
                                                    <img src={item.image} alt={item.name} />
                                                </div>
                                                <div className="font-bold text-gray-700 uppercase text-sm">{item.name}</div>
                                            </div>
                                        </td>
                                        <td><span className="badge badge-ghost font-bold text-[10px] uppercase">{item.category}</span></td>
                                        <td className="font-bold text-gray-700">${item.price.toFixed(2)}</td>
                                        <td className="flex justify-center items-center gap-3 py-4">
                                            {/* Update Button */}
                                            <Link to={`/dashboard/updateItem/${item._id}`}>
                                                <button className="btn btn-md bg-orange-500 hover:bg-orange-600 text-white border-none shadow-md">
                                                    <FaEdit className="text-lg" />
                                                </button>
                                            </Link>

                                            {/* Delete Button */}
                                            <button
                                                onClick={() => handleDeleteItem(item)}
                                                className="btn btn-md bg-red-500 hover:bg-red-600 text-white border-none shadow-md"
                                            >
                                                <FaTrashAlt className="text-lg" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {numberOfPages > 0 && (
                    <div className="p-8 flex justify-center items-center gap-2 bg-gray-50/30">
                        <button
                            disabled={currentPage === 0}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="btn btn-sm btn-ghost"
                        >
                            <FaChevronLeft />
                        </button>
                        {pages.map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${currentPage === page ? 'bg-[#B58130] text-white shadow-md' : 'text-gray-400 hover:bg-gray-200'}`}
                            >
                                {page + 1}
                            </button>
                        ))}
                        <button
                            disabled={currentPage === numberOfPages - 1}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="btn btn-sm btn-ghost"
                        >
                            <FaChevronRight />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageItems;