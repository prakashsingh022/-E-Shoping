import React from 'react';
import OfferZone from '../components/home/OfferZone';
import Collection from '../components/home/Collection';
import ExploreAndBuy from '../components/home/ExploreAndBuy';
import SuitSet from '../components/home/SuitSet';
import LuxeSet from '../components/home/LuxeSet';
import Features from '../components/home/Features';
import HappyCust from '../components/home/HappyCustomers';

const Home = () => {
  return (
    <>
      <OfferZone />
      <Collection />
      <ExploreAndBuy />
      <SuitSet />
      <LuxeSet />
      <Features />
      <HappyCustomers />
    </>
  );
};

export default Home;
