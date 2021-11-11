import React, {useRef, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Dialog, Portal, Button, Modal} from 'react-native-paper';
import service from '../../apis/check';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContextSelector } from 'use-context-selector';

export const dialogContext = createContext()

export const DialogProvider = ({children}) => {
  const [visible, setVisible] = useState(false)
  const [Content, setContent] = useState(null)
  const [value, setValue] = useState(null)
  const [type, setType] = useState(null)
  const modalRef = useRef(null)

  const show = ({content,onOk,onCancel,type}) => {
    setContent(content)
    setValue(onOk)
    setVisible(true)
    setType(type)
    if (onOk != null || onCancel != null) modalRef.current = {}
    if (onOk != null) modalRef.current.onOk = onOk
    if (onCancel != null) modalRef.current.onCancel = onCancel
  }

  const onCancel = async () => {
    if (modalRef.current != null) {
      if (modalRef.current.onCancel == null) {
        setVisible(false)
        return modalRef.current = null
      }

      const success = await modalRef.current.onCancel()
      if (success === false) return
      setVisible(false)
      modalRef.current = null
    }
  }

  const onOk = async () => {
    if (modalRef.current != null) {
      const success = await modalRef.current.onOk()
      if (success === false) return
    }


    // if(value.title === 'delete'){
    //   service.Distribute.deleteOrderList(value.id)
    //     .then(res=>{
    //       console.log(res);
    //       setVisible(false)
    //     })
    //     .catch(err=>{/
    //       setVisible(true)
    //     })
    // }else if(value.title === 'header'){
    //
    //   AsyncStorage.setItem("ip", value.ip);
    //   AsyncStorage.setItem("printName", value.printName);
      setVisible(false)
    // }

    modalRef.current = null
  }

  return (
    <dialogContext.Provider value={{
      visible,
      Content,
      show,
      onOk,
      onCancel,
      type
    }}>
      {children}
    </dialogContext.Provider>
  )
}

export const CustomDialog = () => {

  const {onCancel, onOk, Content, visible,type} = useContextSelector(dialogContext,e=>e)

  return (
    <Portal>
      {
        type === 'customer' || type === 'receiver' ? (
          <Modal visible={visible} onDismiss={onCancel} style = {{backgroundColor: '#FFF0E9', padding: 20}}>
            {Content}
            <View style={{flexDirection:'row', justifyContent:'space-around'}}>
              <Button onPress={onCancel} mode="contained" style={styles.cancelBtn}><Text style={{color:'black'}}>取消</Text></Button>
              <Button onPress={onOk} mode="contained" style={styles.confirmBtn} >
                確定
              </Button>
            </View>
          </Modal>
        ): type === 'sales' ? (
          <Modal visible={visible} onDismiss={onCancel} style = {{backgroundColor: '#FFF0E9', padding: 20,marginTop:50, height:550}}>
            {Content}
            <View style={{flexDirection:'row', justifyContent:'space-around'}}>
              <Button onPress={onCancel} mode="contained" style={styles.cancelBtn}><Text style={{color:'black'}}>取消</Text></Button>
              <Button onPress={onOk} mode="contained" style={styles.confirmBtn} >
                確定
              </Button>
            </View>
          </Modal>
        ):(
          <Dialog visible={visible} style={styles.dialogWrapper}>
            <Dialog.Content style={styles.dialogContent}>
              {Content}
            </Dialog.Content>
            <Dialog.Actions style={styles.btnWrapper}>
              <Button onPress={onCancel} mode="contained" style={styles.cancelBtn} >
                <Text style={{color:'black'}}>
                  取消
                </Text>
              </Button>
              <Button onPress={onOk} mode="contained" style={styles.confirmBtn} >
                確定
              </Button>
            </Dialog.Actions>
          </Dialog>
        )
      }
    </Portal>
  )
};

const styles = StyleSheet.create({
  dialogWrapper:{backgroundColor:'#FFF0E9',height:180},
  dialogContent:{flex: 0.7,alignItems:'center'},
  btnWrapper:{flex: 0.2, justifyContent:'space-around',marginLeft:60,marginRight:60},
  cancelBtn:{backgroundColor: 'transparent',width:70,height:40,elevation: 0,borderWidth:1,borderColor:'#e1d7cb'},
  confirmBtn:{backgroundColor: '#0e77c1',width:70,height:40,elevation: 0,borderWidth:1,borderColor:'#e1d7cb'},
});
