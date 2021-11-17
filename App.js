/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import Login from './src/pages/Login/Login';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Button, Dialog, Portal, Provider as PaperProvider} from 'react-native-paper';

import Restore from './src/pages/Restore/Restore';
import Header from './src/components/header/Header';
import Sales from './src/pages/Sales/Sales';
import SalesLog from './src/pages/Sales/SalesLog';
import RestoreLog from './src/pages/Restore/RestoreLog';
import CancelRestore from './src/pages/cancelRestore/CancelRestore';
import CancelRestoreLog from './src/pages/cancelRestore/CancelRestoreLog';
import {DialogProvider} from './src/components/Dialog/Dialog';
import SalesDetail from './src/pages/Sales/SalesDetail';
import SalesShipment from './src/pages/Sales/Shipment';
import {SnackBarProvider} from './src/components/SnackBar/SnackBar';
import {OrderListProvider} from './src/store/orderListProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {navigate,navigationRef} from './src/apis/navigationService'

const Stack = createNativeStackNavigator();

const App = () => {

  useEffect(()=>{
    AsyncStorage.getItem('token').then((value) => {
      if(JSON.parse(value) === "200"){
        navigate(Sales)
      }
      return JSON.parse(value);
    });
  },[])

  return (
    <PaperProvider>
      <SnackBarProvider>
        <DialogProvider>
          <OrderListProvider>
            <NavigationContainer ref={navigationRef}>
              <Stack.Navigator screenOptions={{
                header: Header,
              }} initailRouteName="Sales">
                <Stack.Screen name="Login" component={Login} options={{headerShown: false}}/>
                <Stack.Screen name="Sales" component={Sales} options={{headerTitle: '出貨'}}/>
                <Stack.Screen name="SalesLog" component={SalesLog} options={{headerTitle: '出貨清單'}}/>
                <Stack.Screen name="SalesDetail" component={SalesDetail} options={{headerTitle: '出貨明細'}}/>
                <Stack.Screen name="SalesShipment" component={SalesShipment} options={{headerTitle: '出貨資料'}}/>
                <Stack.Screen name="Restore" component={Restore} options={{headerTitle: '重新入庫'}}/>
                <Stack.Screen name="RestoreLog" component={RestoreLog} options={{headerTitle: '重新入庫清單'}}/>
                <Stack.Screen name="CancelRestore" component={CancelRestore} options={{headerTitle: '取消入庫'}}/>
                <Stack.Screen name="CancelRestoreLog" component={CancelRestoreLog} options={{headerTitle: '取消入庫清單'}}/>
              </Stack.Navigator>
            </NavigationContainer>
          </OrderListProvider>
        </DialogProvider>
      </SnackBarProvider>
    </PaperProvider>

  );
};

export default App;
