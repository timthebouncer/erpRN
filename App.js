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
import {SpinnerProvider} from './src/components/spinner/spin';
import {ToTopProvider} from './src/components/scrollTopBtn/toTop';

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
      <SpinnerProvider>
      <SnackBarProvider>
        <ToTopProvider>
        <DialogProvider>
          <OrderListProvider>
            <NavigationContainer ref={navigationRef}>
              <Stack.Navigator screenOptions={{
                header: Header,
              }} initailRouteName="Login">
                <Stack.Screen name="Login" component={Login} options={{headerShown: false}}/>
                <Stack.Screen name="Sales" component={Sales} options={{headerTitle: '??????'}}/>
                <Stack.Screen name="SalesLog" component={SalesLog} options={{headerTitle: '????????????'}}/>
                <Stack.Screen name="SalesDetail" component={SalesDetail} options={{headerTitle: '????????????'}}/>
                <Stack.Screen name="SalesShipment" component={SalesShipment} options={{headerTitle: '????????????'}}/>
                <Stack.Screen name="Restore" component={Restore} options={{headerTitle: '????????????'}}/>
                <Stack.Screen name="RestoreLog" component={RestoreLog} options={{headerTitle: '??????????????????'}}/>
                <Stack.Screen name="CancelRestoreLog" component={CancelRestoreLog} options={{headerTitle: '??????????????????'}}/>
                <Stack.Screen name="CancelRestore" component={CancelRestore} options={{headerTitle: '????????????'}}/>
              </Stack.Navigator>
            </NavigationContainer>
          </OrderListProvider>
        </DialogProvider>
        </ToTopProvider>
      </SnackBarProvider>
      </SpinnerProvider>
    </PaperProvider>

  );
};

export default App;
