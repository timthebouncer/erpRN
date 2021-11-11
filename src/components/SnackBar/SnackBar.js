import React, {useState} from 'react';
import {StyleSheet,Text,View} from 'react-native';
import { Snackbar } from 'react-native-paper';
import { createContext, useContextSelector } from 'use-context-selector';
import {dialogContext} from '../Dialog/Dialog';



export const snackBarContext = createContext()


export const SnackBarProvider = ({children}) =>{
  const [visible, setVisible] = useState(false)
  const [msg, setMsg] = useState('')
  const [type, setType] = useState('')

  const show =(msg,status)=>{
    setVisible(true)
    setMsg(msg)
    setType(status)
  }

  return (
    <snackBarContext.Provider value={{
      visible,
      show,
      setVisible,
      msg,
      type
    }}>
      {children}
    </snackBarContext.Provider>
  )
}


export const CustomSnackBar=()=>{

  const {visible,setVisible,msg,type} = useContextSelector(snackBarContext,e=>e)

return(
  <Snackbar
    duration={2000}
    onDismiss={()=>setVisible(false)}
    visible={visible}
    style={type === 'success' ? styles.successStyle:styles.errorStyle}
    wrapperStyle={{position:'absolute',top:0}}
  >
      <Text>
        {msg}
      </Text>
  </Snackbar>
)
}

const styles = StyleSheet.create({
  successStyle: {
    backgroundColor:'#eda62e',
  },
  errorStyle: {
    backgroundColor:'red',
  },
});


// action={{
//   label: 'Undo',
//     onPress: () => {
//     // Do something
//   },
// }}
