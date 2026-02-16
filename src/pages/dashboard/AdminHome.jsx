import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { FaDollarSign, FaUsers, FaBook, FaShoppingCart } from "react-icons/fa";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, PieChart, Pie, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// Define static helpers outside the component to prevent re-creation during render
const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#EF4444', '#EC4899'];

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

const AdminHome = () => {
    const axiosSecure = useAxiosSecure();

    // Fetch Top Stats
    const { data: stats = {}, isLoading: statsLoading } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            const res = await axiosSecure.get('/admin-stats');
            return res.data;
        }
    });

    // Fetch Chart Data
    const { data: chartData = [], isLoading: chartLoading } = useQuery({
        queryKey: ['order-stats'],
        queryFn: async () => {
            const res = await axiosSecure.get('/order-stats');
            return res.data;
        }
    });

    // Show a loading spinner while fetching data
    if (statsLoading || chartLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="w-full px-4">
            <h2 className="text-3xl font-cinzel font-bold mb-5 text-black  uppercase">Hi, Welcome Back!</h2>

            {/* Stats Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="flex items-center justify-center p-8 rounded-xl text-white bg-gradient-to-r from-[#BB34F5] to-[#FCDBFF] shadow-lg">
                    <FaDollarSign className="text-5xl mr-4" />
                    <div>
                        <div className="text-3xl font-black">${stats.revenue?.toFixed(2) || 0}</div>
                        <div className="text-lg opacity-80">Revenue</div>
                    </div>
                </div>

                <div className="flex items-center justify-center p-8 rounded-xl text-white bg-gradient-to-r from-[#D3A256] to-[#FDE8C0] shadow-lg">
                    <FaUsers className="text-5xl mr-4" />
                    <div>
                        <div className="text-3xl font-black">{stats.users || 0}</div>
                        <div className="text-lg opacity-80">Customers</div>
                    </div>
                </div>

                <div className="flex items-center justify-center p-8 rounded-xl text-white bg-gradient-to-r from-[#FE4880] to-[#FECDE9] shadow-lg">
                    <FaBook className="text-5xl mr-4" />
                    <div>
                        <div className="text-3xl font-black">{stats.menuItems || 0}</div>
                        <div className="text-lg opacity-80">Products</div>
                    </div>
                </div>

                <div className="flex items-center justify-center p-8 rounded-xl text-white bg-gradient-to-r from-[#6AAEFF] to-[#B6F7FF] shadow-lg">
                    <FaShoppingCart className="text-5xl mr-4" />
                    <div>
                        <div className="text-3xl font-black">{stats.orders || 0}</div>
                        <div className="text-lg opacity-80">Orders</div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="flex flex-col lg:flex-row gap-8 bg-white p-10 rounded-2xl shadow-xl border mb-10">
                {/* Bar Chart */}
                <div className="w-full lg:w-1/2 h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="category" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="quantity" fill="#8884d8" shape={<TriangleBar />} label={{ position: 'top' }}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
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
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={120}
                                dataKey="revenue" 
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;