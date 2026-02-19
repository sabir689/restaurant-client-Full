import { useState } from 'react';
import orderCoverImg from '../../assets/shop/banner2.jpg'
import Cover from '../menu/Cover';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import useMenu from '../../hooks/UseMenu';
import OrderTab from '../order/OrderTab';
import { useParams } from 'react-router';


const Order = () => {
    // 1. Keep this consistent!
    const categories = ['popular', 'offered', 'salad', 'pizza', 'soup', 'dessert', 'drinks'];
    const { category } = useParams();
    
    // indexof will return -1 if category is undefined, so we default to 0
    const initialIndex = categories.indexOf(category) > -1 ? categories.indexOf(category) : 0;
    const [tabIndex, setTabIndex] = useState(initialIndex);
    const [menu] = useMenu();

    const desserts = menu.filter(item => item.category === 'dessert');
    const soup = menu.filter(item => item.category === 'soup');
    const salad = menu.filter(item => item.category === 'salad');
    const pizza = menu.filter(item => item.category === 'pizza');
    const drinks = menu.filter(item => item.category === 'drinks');
    const offered = menu.filter(item => item.category === 'offered');
    const popular = menu.filter(item => item.category === 'popular');

    return (
        <div>
            <Cover img={orderCoverImg} title="Order Food" />
            
            {/* onSelect ensures the state updates when you click a tab */}
            <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
                <div className='flex justify-center my-10'>
                    <TabList className="border-b-2 border-yellow-500">
                        <Tab>Popular</Tab>
                        <Tab>Offered</Tab>
                        <Tab>Salad</Tab>
                        <Tab>Pizza</Tab>
                        <Tab>Soup</Tab>
                        <Tab>Dessert</Tab>
                        <Tab>Drinks</Tab>
                    </TabList>
                </div>

                <div className='max-w-7xl mx-auto px-4 my-20'>
                    {/* PANELS MUST MATCH TAB ORDER ABOVE */}
                    <TabPanel><OrderTab items={popular} /></TabPanel>
                    <TabPanel><OrderTab items={offered} /></TabPanel>
                    <TabPanel><OrderTab items={salad} /></TabPanel>
                    <TabPanel><OrderTab items={pizza} /></TabPanel>
                    <TabPanel><OrderTab items={soup} /></TabPanel>
                    <TabPanel><OrderTab items={desserts} /></TabPanel>
                    <TabPanel><OrderTab items={drinks} /></TabPanel>
                </div>
            </Tabs>
        </div>
    );
};
export default Order;