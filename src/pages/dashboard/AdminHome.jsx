import React from 'react';
import { useQuery } from '@tanstack/react-query';

import { FaWallet, FaUsers, FaBook, FaTruck } from 'react-icons/fa';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, PieChart, Pie, ResponsiveContainer, Legend } from 'recharts';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', 'red', 'pink'];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminHome = () => {
    const axiosSecure = useAxiosSecure();

    // Fetch Card Stats
    const { data: stats = {} } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            const res = await axiosSecure.get('/admin-stats');
            return res.data;
        }
    });

    // Fetch Chart Data
    const { data: chartData = [] } = useQuery({
        queryKey: ['order-stats'],
        queryFn: async () => {
            const res = await axiosSecure.get('/order-stats');
            return res.data;
        }
    });

    // Custom shape for the Bar Chart (Triangle style)
    const getPath = (x, y, width, height) => {
        return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3}
        ${x + width / 2}, ${y}
        C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width}, ${y + height}
        Z`;
    };

    const TriangleBar = (props) => {
        const { fill, x, y, width, height } = props;
        return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
    };

    return (
        <div className="w-full px-6 py-8">
            <h2 className="text-3xl font-bold font-cinzel mb-8 uppercase text-black">
                Hi, Welcome Back!
            </h2>

            {/* Gradient Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
                <div className="flex items-center justify-center gap-6 py-8 rounded-lg text-white bg-gradient-to-r from-[#BB34F5] to-[#FCDBFF]">
                    <FaWallet className="text-4xl" />
                    <div className="text-center">
                        <p className="text-3xl font-bold">${stats.revenue || 0}</p>
                        <p className="text-lg">Revenue</p>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-6 py-8 rounded-lg text-white bg-gradient-to-r from-[#D3A256] to-[#FDE8C0]">
                    <FaUsers className="text-4xl" />
                    <div className="text-center">
                        <p className="text-3xl font-bold">{stats.users || 0}</p>
                        <p className="text-lg">Customers</p>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-6 py-8 rounded-lg text-white bg-gradient-to-r from-[#FE4880] to-[#FECDE9]">
                    <FaBook className="text-4xl" />
                    <div className="text-center">
                        <p className="text-3xl font-bold">{stats.menuItems || 0}</p>
                        <p className="text-lg">Products</p>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-6 py-8 rounded-lg text-white bg-gradient-to-r from-[#6AAEFF] to-[#B6F7FF]">
                    <FaTruck className="text-4xl" />
                    <div className="text-center">
                        <p className="text-3xl font-bold">{stats.orders || 0}</p>
                        <p className="text-lg">Orders</p>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="flex flex-col lg:flex-row bg-white p-6 rounded-lg shadow-sm border">
                {/* Bar Chart */}
                <div className="w-full lg:w-1/2 h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="category" />
                            <YAxis />
                            <Bar dataKey="quantity" fill="#8884d8" shape={<TriangleBar />} label={{ position: 'top' }}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index % 6]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                <div className="w-full lg:w-1/2 h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData.map(data => ({ name: data.category, value: data.revenue }))}
                                cx="50%" cy="50%" labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80} fill="#8884d8" dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;