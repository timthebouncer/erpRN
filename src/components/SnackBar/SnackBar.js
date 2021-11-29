import React, {useState} from 'react';
import {StyleSheet,Text} from 'react-native';
import { Snackbar } from 'react-native-paper';
import { createContext, useContextSelector } from 'use-context-selector';



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
      <CustomSnackBar/>
      {children}
    </snackBarContext.Provider>
  )
}


function CustomSnackBar(){

  const {visible,setVisible,msg,type} = useContextSelector(snackBarContext,e=>e)

return(
  <Snackbar
    duration={2000}
    onDismiss={()=>setVisible(false)}
    visible={visible}
    style={type === 'success' ? styles.successStyle:styles.errorStyle}
    wrapperStyle={styles.wrapperStyle}
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
  wrapperStyle:{position:'absolute',top:0,left:'8%',width:'85%',alignItems:'center',justifyContent:'center'}
});


// action={{
//   label: 'Undo',
//     onPress: () => {
//     // Do something
//   },
// }}
