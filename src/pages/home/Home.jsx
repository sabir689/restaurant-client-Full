import React from 'react';
import Navbar from '../shared/Navbar';
import Banner from './Banner';
import Category from './Category';

const Home = () => {
    return (
        <div >
            <Navbar></Navbar>
            <Banner></Banner>
            <Category></Category>
        </div>
    );
};

export default Home;