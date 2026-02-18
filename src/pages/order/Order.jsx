import { useState } from 'react';
import orderCoverImg from '../../assets/shop/banner2.jpg'
import Cover from '../menu/Cover';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import useMenu from '../../hooks/UseMenu';
import OrderTab from '../order/OrderTab';
import { useParams } from 'react-router';


const Order = () => {
    const categories = ['salad', 'pizza', 'soup', 'dessert', 'drinks', 'offered', 'popular'];
    const { category } = useParams();
    const initialIndex = categories.indexOf(category);
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

            <Cover img={orderCoverImg} title="Order Food"></Cover>
            <Tabs defaultIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
                <div className='flex justify-center m-10  '>
                    <TabList>
                        <Tab>Popular</Tab>
                        <Tab>Offered</Tab>
                        <Tab>Salad</Tab>
                        <Tab>Pizza</Tab>
                        <Tab>Soup</Tab>
                        <Tab>Dessert</Tab>
                        <Tab>Drinks</Tab>

                    </TabList>
                </div>
                <div className='mx-10 my-20 text-center '>
                    <TabPanel>
                        <OrderTab items={salad}></OrderTab>
                    </TabPanel>
                    <TabPanel>
                        <OrderTab items={pizza}></OrderTab>
                    </TabPanel>
                    <TabPanel>
                        <OrderTab items={soup}></OrderTab>
                    </TabPanel>
                    <TabPanel>
                        <OrderTab items={desserts}></OrderTab>
                    </TabPanel>
                    <TabPanel>
                        <OrderTab items={drinks}></OrderTab>
                    </TabPanel>
                    <TabPanel>
                        <OrderTab items={offered}></OrderTab>
                    </TabPanel>
                    <TabPanel>
                        <OrderTab items={popular}></OrderTab>
                    </TabPanel>
                </div>
            </Tabs>
        </div>
    );
};

export default Order;