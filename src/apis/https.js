import axios from "axios";
import CustomSnackBar from '../components/SnackBar/SnackBar';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/core';


// create an axios instance
const service = axios.create({
  baseURL: 'http://erp-inventory.tc-tech.tw/api',
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
    console.log(error.response.data, "res error");

    if (status === 403 || status === 401) {
      const navigation = useNavigation();
      navigation.navigate('Login')
      AsyncStorage.removeItem('token')
    }
    return Promise.reject(error)
  }
);

export default service;
