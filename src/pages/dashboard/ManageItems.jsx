import { FaEdit, FaTrashAlt, FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useMenu from "../../hooks/UseMenu";

const ManageItems = () => {
    const axiosSecure = useAxiosSecure();
    const [, , refetch] = useMenu();

    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);

    const [paginatedMenu, setPaginatedMenu] = useState([]);
    const [totalCount, setTotalCount] = useState(0);

    const [loading, setLoading] = useState(true);

    // Search states
    const [searchText, setSearchText] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Debounce effect (smooth typing search)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchText.trim().toLowerCase());
        }, 400);

        return () => clearTimeout(timer);
    }, [searchText]);

    // Fetch paginated data
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

    useEffect(() => {
        fetchCurrentPage();
    }, [fetchCurrentPage]);

    const handleItemsPerPage = (e) => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(0);
    };

    // Delete Handler
    const handleDeleteItem = async (item) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: `You are removing ${item.name}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#B58130",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        if (!result.isConfirmed) return;

        try {
            const res = await axiosSecure.delete(`/menu/${item._id}`);

            if (res.data.deletedCount > 0) {
                setPaginatedMenu((prev) => prev.filter((i) => i._id !== item._id));
                setTotalCount((prev) => prev - 1);

                Swal.fire({
                    title: "Deleted!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1000,
                });

                if (typeof refetch === "function") {
                    refetch();
                }

                // Fix pagination after delete
                if (paginatedMenu.length === 1 && currentPage > 0) {
                    setCurrentPage((prev) => prev - 1);
                } else {
                    setTimeout(() => {
                        fetchCurrentPage().catch(() => { });
                    }, 300);
                }
            } else {
                Swal.fire("Note", "Item could not be found.", "info");
            }
        } catch (error) {
            console.error("Delete error:", error);
            Swal.fire("Error!", "Failed to delete item from server.", "error");
        }
    };

    // Filter menu based on search
    const filteredMenu = paginatedMenu.filter((item) => {
        if (!debouncedSearch) return true;

        const nameMatch = item?.name?.toLowerCase().includes(debouncedSearch);
        const categoryMatch = item?.category?.toLowerCase().includes(debouncedSearch);

        return nameMatch || categoryMatch;
    });

    const numberOfPages = Math.ceil(totalCount / itemsPerPage);
    const pages = [...Array(numberOfPages).keys()];

    return (
        <div className="w-full min-h-screen pb-10 px-4 md:px-0">
            {/* Header */}
            <div className="mb-10">
                <p className="text-[#B58130] font-bold tracking-[0.3em] uppercase text-xs mb-2">
                    Inventory Control
                </p>
                <h2 className="text-4xl font-black text-gray-800 uppercase tracking-tight font-cinzel">
                    Manage All <span className="text-[#B58130]">Items</span>
                </h2>
                <div className="h-1 w-20 bg-[#B58130] mt-3 rounded-full"></div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Toolbar */}
                <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between md:items-center gap-5 bg-gray-50/50">
                    <div>
                        <h3 className="text-xl font-bold text-gray-700 uppercase">Stock Overview</h3>
                        <p className="text-sm text-gray-400 font-medium">Total: {totalCount}</p>
                    </div>

                    {/* Search Box */}
                    <div className="relative w-full md:w-72">
                        <FaSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                            type="text"
                            value={searchText}
                            onChange={(e) => {
                                setSearchText(e.target.value);
                                setCurrentPage(0);
                            }}
                            placeholder="Search item..."
                            className="input input-bordered w-full pl-10 font-semibold"
                        />
                    </div>

                    {/* Items per page */}
                    <select
                        value={itemsPerPage}
                        onChange={handleItemsPerPage}
                        className="select select-bordered select-sm font-bold text-[#B58130]"
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
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
                            ) : filteredMenu.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-10 font-bold text-gray-400">
                                        No items found 😕
                                    </td>
                                </tr>
                            ) : (
                                filteredMenu.map((item, index) => (
                                    <tr
                                        key={item._id}
                                        className="hover:bg-gray-50 transition-all border-b border-gray-50"
                                    >
                                        <td className="pl-8 font-bold text-gray-300">
                                            {(currentPage * itemsPerPage) + index + 1}
                                        </td>

                                        <td>
                                            <div className="flex items-center gap-4">
                                                <div className="mask mask-squircle w-12 h-12 shadow-sm">
                                                    <img src={item.image} alt={item.name} />
                                                </div>
                                                <div className="font-bold text-gray-700 uppercase text-sm">
                                                    {item.name}
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            <span className="badge badge-ghost font-bold text-[10px] uppercase">
                                                {item.category}
                                            </span>
                                        </td>

                                        <td className="font-bold text-gray-700">
                                            ${item.price.toFixed(2)}
                                        </td>

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

                {/* Pagination Controls (hide when searching) */}
                {numberOfPages > 0 && !debouncedSearch && (
                    <div className="p-8 flex justify-center items-center gap-2 bg-gray-50/30">
                        <button
                            disabled={currentPage === 0}
                            onClick={() => setCurrentPage((prev) => prev - 1)}
                            className="btn btn-sm btn-ghost"
                        >
                            <FaChevronLeft />
                        </button>

                        {pages.map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${currentPage === page
                                    ? "bg-[#B58130] text-white shadow-md"
                                    : "text-gray-400 hover:bg-gray-200"
                                    }`}
                            >
                                {page + 1}
                            </button>
                        ))}

                        <button
                            disabled={currentPage === numberOfPages - 1}
                            onClick={() => setCurrentPage((prev) => prev + 1)}
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
