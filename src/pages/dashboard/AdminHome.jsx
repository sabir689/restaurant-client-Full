import React from 'react';
import { useQuery } from '@tanstack/react-query';

import { FaWallet, FaUsers, FaBook, FaTruck } from 'react-icons/fa';
import { 
    BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, 
    PieChart, Pie, ResponsiveContainer, Legend, Tooltip 
} from 'recharts';
import useAxiosSecure from '../../hooks/useAxiosSecure';

// --- Static Configuration ---
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FB5200', '#F222FF'];



const TriangleBar = (props) => {
    const { fill, x, y, width, height } = props;

    const getPath = (x, y, width, height) => {
        return `M${x},${y + height}
                C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3} ${x + width / 2}, ${y}
                C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width}, ${y + height}
                Z`;
    };

    return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
};

/**
 * Custom Label for Pie Chart: Renders percentage inside slices
 */
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text 
            x={x} y={y} 
            fill="white" 
            textAnchor={x > cx ? 'start' : 'end'} 
            dominantBaseline="central"
            className="text-xs font-bold"
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

// --- Main Component ---

const AdminHome = () => {
    const axiosSecure = useAxiosSecure();

    // Fetch Overview Stats
    const { data: stats = {}, isLoading: isStatsLoading } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            const res = await axiosSecure.get('/admin-stats');
            return res.data;
        }
    });

    // Fetch Data for Charts
    const { data: chartData = [], isLoading: isChartLoading } = useQuery({
        queryKey: ['order-stats'],
        queryFn: async () => {
            const res = await axiosSecure.get('/order-stats');
            return res.data;
        }
    });

    if (isStatsLoading || isChartLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg text-[#B58130]"></span>
            </div>
        );
    }

    return (
        <div className="w-full px-6 py-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <h2 className="text-3xl font-bold font-cinzel mb-8 uppercase text-gray-800">
                Hi, Welcome Back!
            </h2>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {/* Revenue Card */}
                <div className="flex items-center justify-between px-8 py-10 rounded-xl text-white bg-gradient-to-r from-[#BB34F5] to-[#FCDBFF] shadow-lg">
                    <FaWallet className="text-5xl opacity-80" />
                    <div className="text-right">
                        <p className="text-4xl font-black">${stats.revenue?.toLocaleString() || 0}</p>
                        <p className="text-xl font-medium">Revenue</p>
                    </div>
                </div>

                {/* Customers Card */}
                <div className="flex items-center justify-between px-8 py-10 rounded-xl text-white bg-gradient-to-r from-[#D3A256] to-[#FDE8C0] shadow-lg">
                    <FaUsers className="text-5xl opacity-80" />
                    <div className="text-right">
                        <p className="text-4xl font-black">{stats.users || 0}</p>
                        <p className="text-xl font-medium">Customers</p>
                    </div>
                </div>

                {/* Menu Items Card */}
                <div className="flex items-center justify-between px-8 py-10 rounded-xl text-white bg-gradient-to-r from-[#FE4880] to-[#FECDE9] shadow-lg">
                    <FaBook className="text-5xl opacity-80" />
                    <div className="text-right">
                        <p className="text-4xl font-black">{stats.menuItems || 0}</p>
                        <p className="text-xl font-medium">Products</p>
                    </div>
                </div>

                {/* Orders Card */}
                <div className="flex items-center justify-between px-8 py-10 rounded-xl text-white bg-gradient-to-r from-[#6AAEFF] to-[#B6F7FF] shadow-lg">
                    <FaTruck className="text-5xl opacity-80" />
                    <div className="text-right">
                        <p className="text-4xl font-black">{stats.orders || 0}</p>
                        <p className="text-xl font-medium">Orders</p>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="flex flex-col xl:flex-row gap-8 items-stretch">
                
                {/* Bar Chart (Orders per Category) */}
                <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[500px]">
                    <h3 className="text-lg font-bold text-gray-700 mb-6 uppercase tracking-wider text-center">Items Sold by Category</h3>
                    <ResponsiveContainer width="99%" height={400}>
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                            <YAxis />
                            <Tooltip cursor={{ fill: '#f9fafb' }} />
                            <Bar 
                                dataKey="quantity" 
                                shape={TriangleBar} 
                                label={{ position: 'top', fontSize: 12, fontWeight: 'bold' }}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart (Revenue Distribution) */}
                <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[500px]">
                    <h3 className="text-lg font-bold text-gray-700 mb-6 uppercase tracking-wider text-center">Revenue Share</h3>
                    <ResponsiveContainer width="99%" height={400}>
                        <PieChart>
                            <Pie
                                data={chartData.map(item => ({ name: item.category, value: item.revenue }))}
                                cx="50%" cy="50%" 
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius={130} 
                                fill="#8884d8" 
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `$${value}`} />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

            </div>
        </div>
    );
};

export default AdminHome;