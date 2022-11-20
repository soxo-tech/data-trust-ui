import React, { useEffect, useContext, useState } from 'react';

import './App.scss';

import *  as CustomComponents from './modules';

import { RootApplicationAPI } from 'soxo-bootstrap-core';


let appSettings = {
  brandLogo: require(process.env.REACT_APP_BRAND_LOGO),
  heroImage: require(process.env.REACT_APP_HERO_IMAGE),
  footerLogo: require(process.env.REACT_APP_FOOTER_LOGO),
  // registerImage: require(process.env.REACT_APP_REGISTER_IMAGE)

  headers: {
    // db_ptr: process.env.REACT_APP_DB_PTR
  },

  /**
   * Function Defines what auth token to be passed with every api 
   * Call 
   * 
   * @returns 
   */
  getToken: async () => {

    return new Promise((resolve) => {

      resolve(localStorage.access_token);
    })
  },
  renderCustomHeader: () => {
    return <h3 className="location-display">

      {process.env.REACT_APP_LOCATION}</h3>;
  },
}



function App(props) {

  useEffect(() => {
    return () => { };
  }, []);

  return (

    <RootApplicationAPI CustomModels={{}} CustomComponents={CustomComponents} appSettings={appSettings} />
  );
}


export default App;
