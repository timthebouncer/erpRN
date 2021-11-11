// import React, {createContext, useContext, useRef, useState} from 'react';
// import { Modal, Portal, Text, Button, Provider } from 'react-native-paper';
// import {View, StyleSheet} from 'react-native';
// import service from '../../apis/check';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {dialogContext} from '../Dialog/Dialog';
//
//
// export const modalContext = createContext()
//
//
// export const ModalProvider = ({children}) => {
//   const [visible, setVisible] = useState(false)
//   const [salesVisible, setSalesVisible] = useState(false)
//   const [Content, setContent] = useState(null)
//   const [value, setValue] = useState(null)
//   const [type, setType] = useState(null)
//   const modalRef = useRef(null)
//
//
//
//   const show = (Component, onOk, onCancel,getType) => {
//     setContent(Component)
//     setValue(onOk)
//     setVisible(true)
//     setType(getType)
//     if (onOk != null || onCancel != null) modalRef.current = {}
//     if (onOk != null) modalRef.current.onOk = onOk
//     if (onCancel != null) modalRef.current.onCancel = onCancel
//   }
//
//   // const getType=async ()=>{
//   //   if (modalRef.current != null) {
//   //     const success = await modalRef.current.getType()
//   //     if (success === false) return
//   //   }
//   //   // setVisible(false)
//   //   console.log(type);
//   //   modalRef.current = null
//   // }
//
//   const onCancel = async () => {
//     if (modalRef.current != null) {
//       const success = await modalRef.current.onCancel()
//       if (success === false) return
//     }
//     setVisible(false)
//     modalRef.current = null
//   }
//
//   const onOk = async () => {
//     if (modalRef.current != null) {
//       const success = await modalRef.current.onOk()
//       if (success === false) return
//     }
//     console.log(value.current);
//     // service.Customer.add(value.current)
//     //   .then(res=>{
//     //     console.log(res);
//     //   })
//
//     // service.Customer.update(value.current)
//     //   .then(res=>{
//     //     console.log(res);
//     //   })
//
//
//
//     modalRef.current = null
//   }
//
//   return (
//     <modalContext.Provider value={{
//       visible,
//       Content,
//       show,
//       onOk,
//       onCancel,
//       type
//     }}>
//       {children}
//     </modalContext.Provider>
//   )
// }
//
//
// export const CustomModal = () => {
//
//
//   const {onCancel, onOk, Content, visible,type} = useContext(modalContext)
//
//   return (
//       <Portal>
//         {
//           type === 'customer' || type === 'receiver' ? (
//             <Modal visible={visible} onDismiss={onCancel} style = {{backgroundColor: '#FFF0E9', padding: 20}}>
//               {Content}
//
//               <View style={{flexDirection:'row', justifyContent:'space-around'}}>
//                 <Button onPress={onCancel} mode="contained" style={styles.cancelBtn}><Text>取消</Text></Button>
//                 <Button onPress={onOk} mode="contained" style={styles.confirmBtn} >
//                   確定
//                 </Button>
//               </View>
//             </Modal>
//           ):(
//             <Modal visible={visible} onDismiss={onCancel} style = {{backgroundColor: '#FFF0E9', padding: 20,marginTop:50, height:550}}>
//               {Content}
//               <View style={{flexDirection:'row', justifyContent:'space-around'}}>
//                 <Button onPress={onCancel} mode="contained" style={styles.cancelBtn}><Text>取消</Text></Button>
//                 <Button onPress={onOk} mode="contained" style={styles.confirmBtn} >
//                   確定
//                 </Button>
//               </View>
//             </Modal>
//           )
//         }
//
//       </Portal>
//   );
// };
//
// export const ProductSalesModal = () =>{
//   return(
//     <Portal>
//       <Modal>
//         <View><Text>ProductSalesModal</Text></View>
//       </Modal>
//     </Portal>
//   )
// }
//
// const styles=StyleSheet.create({
//   cancelBtn:{backgroundColor: 'transparent',width:70,height:40,elevation: 0,borderWidth:1,borderColor:'#e1d7cb'},
//   confirmBtn:{backgroundColor: '#0e77c1',width:70,height:40,elevation: 0,borderWidth:1,borderColor:'#e1d7cb'},
// })
//
// // export default CustomModal;
