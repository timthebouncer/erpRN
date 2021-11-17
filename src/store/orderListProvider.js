import {createContext} from 'use-context-selector';
import React, {useState} from 'react';


export const orderListContext=createContext(null)


export const OrderListProvider=({children})=>{

  const [orderList, setOrderList] = useState({})
  const [getReceiver,setGetReceiver] = useState({})

  return (
    <orderListContext.Provider value={{
      orderList, setOrderList,getReceiver,setGetReceiver
    }}>
      {children}
    </orderListContext.Provider>
  )
}
