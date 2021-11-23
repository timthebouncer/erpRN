import {createContext} from 'use-context-selector';
import React, {useState} from 'react';


export const orderListContext=createContext(null)


export const OrderListProvider=({children})=>{

  const [orderList, setOrderList] = useState({})
  const [getReceiver,setGetReceiver] = useState({})
  const [editOrderDetail,setEditOrderDetail] = useState({})

  return (
    <orderListContext.Provider value={{
      orderList, setOrderList,getReceiver,setGetReceiver,editOrderDetail,setEditOrderDetail
    }}>
      {children}
    </orderListContext.Provider>
  )
}
