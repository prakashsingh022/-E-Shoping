import React from 'react';
import OfferZone from '../components/home/OfferZone';
import Collection from '../components/home/Collection';
import ExploreAndBuy from '../components/home/ExploreAndBuy';
import SuitSet from '../components/home/SuitSet';
import LuxeSet from '../components/home/LuxeSet';
import Features from '../components/home/Features';
import HappyCustomers from '../components/home/HappyCustomers';
import ProductDetails from '../components/product/ProductDetails';

const Home = () => {
  return (
    <>
      <OfferZone />
      <Collection />
      <ExploreAndBuy />
      <SuitSet />
      <LuxeSet />
      <Features />
      <ProductDetails />
      <HappyCustomers />
    </>
  );
};

export default Home;
