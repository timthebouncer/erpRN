import React, {useRef, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Dialog, Portal, Button, Modal} from 'react-native-paper';
import service from '../../apis/check';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContextSelector } from 'use-context-selector';
import {snackBarContext} from '../SnackBar/SnackBar';
export const dialogContext = createContext()

export const DialogProvider = ({children}) => {
  const [visible, setVisible] = useState(false)
  const [Content, setContent] = useState(null)
  const [value, setValue] = useState(null)
  const [type, setType] = useState(null)
  const modalRef = useRef(null)
  const {show} = useContextSelector(snackBarContext,e=>e)

  const showModal = ({content,onOk,onCancel,type}) => {
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
      if(value && value.title){
        service.Distribute.deleteOrderList(value.id)
          .then(res=>{
            console.log(res);
            show(res.data,'success')
          })
          .catch(err=>{
            console.log(err);
          })
      }
      if (success === false) return
    }

      setVisible(false)

    modalRef.current = null
  }

  return (
    <dialogContext.Provider value={{
      visible,
      Content,
      showModal,
      onOk,
      onCancel,
      type
    }}>
      <CustomDialog />
      {children}
    </dialogContext.Provider>
  )
}

function CustomDialog() {

  const {onCancel, onOk, Content, visible,type} = useContextSelector(dialogContext,e=>e)

  return (
    <Portal>
      {
        type === 'customer' || type === 'receiver' ? (
          <Modal visible={visible} onDismiss={onCancel} style = {[styles.bgFFF0E9,styles.p20]}>
            {Content}
            <View style={[styles.flexRow,styles.spaceAround]}>
              <Button onPress={onCancel} mode="contained" style={styles.cancelBtn}><Text style={styles.colorBlack}>??????</Text></Button>
              <Button onPress={onOk} mode="contained" style={styles.confirmBtn} >
                ??????
              </Button>
            </View>
          </Modal>
        ): type === 'sales' ? (
          <Modal visible={visible} onDismiss={onCancel} style = {[styles.bgFFF0E9,styles.p20,styles.mt30]}>
            {Content}
            <View style={[styles.flexRow,styles.spaceAround]}>
              <Button onPress={onCancel} mode="contained" style={styles.cancelBtn}><Text style={styles.colorBlack}>??????</Text></Button>
              <Button onPress={onOk} mode="contained" style={styles.confirmBtn} >
                ??????
              </Button>
            </View>
          </Modal>
        ):type === 'remark' ? (
          <Dialog visible={visible} style={styles.remarkModal}>
            <Dialog.Content style={styles.dialogContent}>
              {Content}
            </Dialog.Content>
            <Dialog.Actions style={styles.btnWrapper}>
              <Button onPress={onCancel} mode="contained" style={styles.cancelBtn} >
                <Text style={styles.colorBlack}>
                  ??????
                </Text>
              </Button>
              <Button onPress={onOk} mode="contained" style={styles.confirmBtn} >
                ??????
              </Button>
            </Dialog.Actions>
          </Dialog>
        ):(
          <Dialog visible={visible} style={styles.dialogWrapper}>
            <Dialog.Content style={styles.dialogContent}>
              {Content}
            </Dialog.Content>
            <Dialog.Actions style={styles.btnWrapper}>
              <Button onPress={onCancel} mode="contained" style={styles.cancelBtn} >
                <Text style={styles.colorBlack}>
                  ??????
                </Text>
              </Button>
              <Button onPress={onOk} mode="contained" style={styles.confirmBtn} >
                ??????
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
  remarkModal:{backgroundColor:'#FFF0E9',height:380},
  dialogContent:{flex: 0.7,alignItems:'center'},
  btnWrapper:{flex: 0.2, justifyContent:'space-around',marginLeft:60,marginRight:60},
  cancelBtn:{backgroundColor: 'transparent',width:70,height:40,elevation: 0,borderWidth:1,borderColor:'#e1d7cb'},
  confirmBtn:{backgroundColor: '#0e77c1',width:70,height:40,elevation: 0,borderWidth:1,borderColor:'#e1d7cb'},
  flexRow:{flexDirection:'row'},
  spaceAround:{justifyContent:'space-around'},
  bgFFF0E9:{backgroundColor: '#FFF0E9'},
  p20:{padding: 20},
  mt30:{marginTop: 30},
  colorBlack:{color:'black'}
});
