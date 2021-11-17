import React, {useRef, useState} from 'react';
import {View, Text, TextInput, StyleSheet, Dimensions,ScrollView} from 'react-native';
import { Icon,Button} from 'react-native-material-ui';
import { debounce } from "lodash";
import service from '../../apis/check';
import Counter from '../../components/Counter/Counter';
import {useContextSelector} from 'use-context-selector';
import {snackBarContext} from '../../components/SnackBar/SnackBar';



const Restore=()=>{

  const[restoreList, setRestoreList] = useState({})
  const[quantity, setQuantity] = useState(1)
  const inputVal = useRef()
  const {show} = useContextSelector(snackBarContext,e=>e)


  const handleTextChange = debounce((text) =>{
    service.Inventory.getStockDetail({barcode:text})
      .then(res=>{
        setRestoreList(res.data)
      })
      .catch(err=>{
        console.log(err);
      })
  },500);


  const handleSubmit=async ()=>{
    if(['公斤','公克','台斤'].includes(restoreList.unit)){
     await service.Inventory.changeInventory({
        id:restoreList.inventoryId,
        barcode:restoreList.barcode,
        amount:restoreList.amount + 1
      })
        .then(res=>{
          console.log(res);
        })
    }else {
     await service.Inventory.changeInventory({
        id:restoreList.inventoryId,
        barcode:restoreList.barcode,
        amount:restoreList.amount + quantity
      })
        .then(res=>{
          console.log(res);
          setRestoreList({...restoreList,barcode:''})
        })
    }
    inputVal.current.clear()
    setQuantity(1)
    setRestoreList({})
  }

  const handleClear=()=>{
    inputVal.current.clear()
    setRestoreList({})
    setQuantity(1)
  }
  let deviceWidth = Dimensions.get('window').width

  return (
    <ScrollView style={{backgroundColor:'#FFF0E9',width:deviceWidth}}>
      <View><Text style={styles.textStyle1}>輸入商品</Text></View>
      <View style={styles.barcodeWrapper}>
        <Text style={styles.textStyle2}>商品條碼</Text>
        <TextInput
          ref={inputVal}
          style={styles.input}
          onChangeText={handleTextChange}
          placeholder={'可掃條碼 或 手動輸入'}
        />
      </View>
      <View><Text style={styles.textStyle1}>入庫商品資料</Text></View>
      {
        restoreList.inventoryId?(
          <View style={styles.contentWrapper}>
            <View style={styles.productWrapper}>
              <Text style={styles.textStyle}>商品名稱</Text>
              <Text style={styles.textStyle}>{restoreList.productName}</Text>
            </View>
            <View style={styles.numberWrapper}>
              <Text style={styles.textStyle}>數量</Text>
              {
                ['公斤','公克','台斤'].includes(restoreList.unit)?(
                  <View style={styles.weightWrapper}>
                    <Text style={styles.textStyle}>{restoreList.weight}</Text>
                  </View>
                ):(
                  <Counter quantity={quantity} setQuantity={setQuantity} />
                )
              }
            </View>
          </View>
        ):(
            <View style={styles.scanWarning}>
              <Icon style={{lineHeight:40}} name='add' />
              <Text style={styles.textStyle3}>請掃條碼添加商品</Text>
            </View>
        )
      }
      <View style={styles.btnWrapper}>
        <Button onPress={handleClear} raised text={'清空'} />
        <Button onPress={handleSubmit} raised primary text={'確定'} />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    textStyle1:{
      fontSize:18,backgroundColor:'white'
    },
    textStyle2:{marginRight:20, marginTop:15,fontSize:18},
    textStyle3:{fontSize:30},
    textStyle:{fontSize:20},
    barcodeWrapper:{flexDirection:'row',marginTop:40,marginBottom: 40},
    contentWrapper:{marginBottom:50,marginLeft:10,marginRight: 10},
    productWrapper:{flexDirection:'row', justifyContent:'space-between',width:'90%'},
    numberWrapper:{flexDirection:'row', justifyContent:'space-between',marginTop:30,marginBottom: 30},
    weightWrapper:{alignItems:'center',width:'50%'},
    input:{
      height: 50,
      width:'70%',
      borderColor: 'white',
      borderWidth: 1,
      backgroundColor:'white',
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    scanWarning:{flexDirection:'row',width:'100%',justifyContent:'center',marginTop:40,marginBottom: 40},
    btnWrapper:{flexDirection:'row', justifyContent:'space-around',alignItems:'center', width:'100%'}
});

export default Restore
