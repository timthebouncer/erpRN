import axios from "axios";
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import {useNavigation} from '@react-navigation/core';
import {navigate} from './navigationService'



// create an axios instance
const service = axios.create({
  baseURL: 'http://test-erp-web.tc-tech.tw/api',
  headers: {
    // "Content-Type": "application/json"
  },
  timeout: 60000 // request timeout
});
service.interceptors.request.use(
  function(config) {
    // if (sessionStorage.getItem("token")) {
    //     config.headers["X-XSRF-TOKEN"] = sessionStorage.getItem("token");
    // }
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);


service.interceptors.response.use(
  function(response) {

    return response;
  },
  function(error) {
    // show(error.response.data.msg,'error')
    console.log(error.response.data, "res error");
    const { status } = error.response;
    if (status === 403 || status === 401) {
      navigate('Login')
    }
    return Promise.reject(error)
  }
);

export default service;
