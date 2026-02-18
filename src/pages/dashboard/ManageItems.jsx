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
        <div className="w-full min-h-screen pb-10 px-2 md:px-6 lg:px-0">
            {/* Header - Responsive alignment */}
            <div className="mb-6 md:mb-10 text-center md:text-left pt-6 md:pt-0">
                <p className="text-[#B58130] font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase text-[10px] md:text-xs mb-2">
                    Inventory Control
                </p>
                <h2 className="text-2xl md:text-4xl font-black text-gray-800 uppercase tracking-tight font-cinzel">
                    Manage All <span className="text-[#B58130]">Items</span>
                </h2>
                <div className="h-1 w-16 md:w-20 bg-[#B58130] mt-3 rounded-full mx-auto md:mx-0"></div>
            </div>

            <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Toolbar - Stacks on mobile */}
                <div className="p-4 md:p-8 border-b border-gray-50 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-gray-50/50">
                    <div className="text-center sm:text-left">
                        <h3 className="text-lg md:text-xl font-bold text-gray-700 uppercase">Stock Overview</h3>
                        <p className="text-xs md:text-sm text-gray-400 font-medium">Total: {totalCount}</p>
                    </div>

                    {/* Search Box */}
                    <div className="relative w-full sm:w-64 md:w-72">
                        <FaSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                            type="text"
                            value={searchText}
                            onChange={(e) => {
                                setSearchText(e.target.value);
                                setCurrentPage(0);
                            }}
                            placeholder="Search item..."
                            className="input input-sm md:input-md input-bordered w-full pl-10 font-semibold"
                        />
                    </div>

                    {/* Items per page */}
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-xs font-bold text-gray-400 uppercase">Show:</span>
                        <select
                            value={itemsPerPage}
                            onChange={handleItemsPerPage}
                            className="select select-bordered select-xs md:select-sm font-bold text-[#B58130]"
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr className="text-gray-400 uppercase text-[10px] md:text-xs h-12 md:h-14 border-b border-gray-100">
                                <th className="pl-4 md:pl-8">#</th>
                                <th>Item Details</th>
                                <th className="hidden sm:table-cell">Category</th>
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
                                        <td className="pl-4 md:pl-8 font-bold text-gray-300 text-xs md:text-base">
                                            {(currentPage * itemsPerPage) + index + 1}
                                        </td>

                                        <td>
                                            <div className="flex items-center gap-2 md:gap-4">
                                                <div className="avatar">
                                                    <div className="mask mask-squircle w-10 h-10 md:w-12 md:h-12 shadow-sm">
                                                        <img src={item.image} alt={item.name} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-700 uppercase text-[10px] md:text-sm line-clamp-1 md:line-clamp-none">
                                                        {item.name}
                                                    </div>
                                                    {/* Category sub-text visible only on mobile */}
                                                    <div className="sm:hidden text-[9px] font-bold text-[#B58130] uppercase mt-0.5">
                                                        {item.category}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="hidden sm:table-cell">
                                            <span className="badge badge-ghost font-bold text-[10px] uppercase">
                                                {item.category}
                                            </span>
                                        </td>

                                        <td className="font-bold text-gray-700 text-xs md:text-base">
                                            ${item.price.toFixed(2)}
                                        </td>

                                        <td className="py-4">
                                            <div className="flex justify-center items-center gap-1.5 md:gap-3">
                                                {/* Update Button */}
                                                <Link to={`/dashboard/updateItem/${item._id}`}>
                                                    <button className="btn btn-xs md:btn-md bg-orange-500 hover:bg-orange-600 text-white border-none shadow-md">
                                                        <FaEdit className="text-xs md:text-lg" />
                                                    </button>
                                                </Link>

                                                {/* Delete Button */}
                                                <button
                                                    onClick={() => handleDeleteItem(item)}
                                                    className="btn btn-xs md:btn-md bg-red-500 hover:bg-red-600 text-white border-none shadow-md"
                                                >
                                                    <FaTrashAlt className="text-xs md:text-lg" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls - Added overflow-x-auto for many pages on small screens */}
                {numberOfPages > 0 && !debouncedSearch && (
                    <div className="p-4 md:p-8 flex justify-center items-center gap-1 md:gap-2 bg-gray-50/30">
                        <button
                            disabled={currentPage === 0}
                            onClick={() => setCurrentPage((prev) => prev - 1)}
                            className="btn btn-xs md:btn-sm btn-ghost"
                        >
                            <FaChevronLeft />
                        </button>

                        <div className="flex items-center gap-1 overflow-x-auto max-w-[150px] sm:max-w-none no-scrollbar">
                            {pages.map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`min-w-[24px] h-6 md:w-8 md:h-8 rounded md:rounded-lg text-[10px] md:text-xs font-bold transition-all shrink-0 ${currentPage === page
                                        ? "bg-[#B58130] text-white shadow-md"
                                        : "text-gray-400 hover:bg-gray-200"
                                        }`}
                                >
                                    {page + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            disabled={currentPage === numberOfPages - 1}
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                            className="btn btn-xs md:btn-sm btn-ghost"
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