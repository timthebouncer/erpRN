import React, {useRef, useState} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import { Button,Icon } from 'react-native-material-ui';
import { debounce } from "lodash";
import service from '../../apis/check';
import Counter from '../../components/Counter/Counter';
import {useContextSelector} from 'use-context-selector';
import {snackBarContext} from '../../components/SnackBar/SnackBar';


const CancelRestore=()=>{

  const[canCelRestoreList, setCancelRestoreList] = useState({})
  const[quantity, setQuantity] = useState(1)
  const inputVal = useRef()
  const {show} = useContextSelector(snackBarContext,e=>e)

  const handleTextChange = debounce((text) =>{
    console.log(text);
    service.Inventory.getStockDetail({barcode:text})
      .then(res=>{
        console.log(res.data);
        setCancelRestoreList(res.data)
      })
      .catch(err=>{
        console.log(err);
      })
  },500);


  const handleSubmit=()=>{
    if(['公斤','公克','台斤'].includes(canCelRestoreList.unit)){
      service.Inventory.changeInventory({
        id:canCelRestoreList.inventoryId,
        barcode:canCelRestoreList.barcode,
        amount:canCelRestoreList.amount - 1
      })
        .then(res=>{
          console.log(res);
        })
    }else {
      service.Inventory.changeInventory({
        id:canCelRestoreList.inventoryId,
        barcode:canCelRestoreList.barcode,
        amount:canCelRestoreList.amount + quantity
      })
        .then(res=>{
          console.log(res);
          setCancelRestoreList({...canCelRestoreList,barcode:''})
        })
    }
    inputVal.current.clear()
    setQuantity(1)
    setCancelRestoreList({})
  }

  const handleClear=()=>{
    inputVal.current.clear()
    setQuantity(1)
  }

  return (
    <View style={styles.container}>
      <View style={styles.firstTitle}><Text style={styles.textStyle1}>輸入商品</Text></View>
      <View style={styles.barCodeWrapper}>
        <Text style={styles.textStyle2}>商品條碼</Text>
        <TextInput
          ref={inputVal}
          style={styles.input}
          onChangeText={handleTextChange}
          placeholder={'可掃條碼 或 手動輸入'}
        />
      </View>
      <View style={{flex:0.1}}><Text style={styles.textStyle1}>取消入庫商品資料</Text></View>
      {
        canCelRestoreList.inventoryId?(
          <View style={{flex:0.2}}>
            <View style={{flex:0.5,flexDirection:'row', justifyContent:'space-between',width:300}}>
              <Text style={{fontSize:20}}>商品名稱</Text>
              <Text style={{fontSize:20}}>{canCelRestoreList.productName}</Text>
            </View>
            <View style={{flex:0.5,flexDirection:'row', justifyContent:'space-between',width:330}}>
              <Text style={{fontSize:20}}>數量</Text>
              {
                ['公斤','公克','台斤'].includes(canCelRestoreList.unit)?(
                  <View style={{flex:0.4,justifyContent:'center'}}>
                    <Text style={{fontSize:20}}>{canCelRestoreList.weight}</Text>
                  </View>
                ):(
                  <Counter quantity={quantity} setQuantity={setQuantity} />
                )
              }
            </View>
          </View>
        ):(
          <View style={styles.functionWrapper}>
            <View style={{flexDirection:'row'}}>
              <Icon name='add' />
              <Text style={styles.textStyle3}>請掃條碼添加商品</Text>
            </View>
          </View>
        )
      }
      <View style={styles.btnWrapper}>
        <Button onPress={handleClear} raised text={'清空'} />
        <Button onPress={handleSubmit} raised primary text={'確定'} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:'#FFF0E9',flex:1
  },
  textStyle1:{
    fontSize:18,backgroundColor:'white'
  },
  textStyle2:{marginRight:20, marginTop:15,fontSize:18},
  textStyle3:{fontSize:18},
  firstTitle:{flex: 0.1,marginTop:0},
  input:{
    height: 50,
    width:250,
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
  barCodeWrapper:{flex:0.2, flexDirection:'row', padding:12, marginTop:0, marginBottom:-20},
  functionWrapper:{flex:0.2, justifyContent:'center', alignItems:'center', marginTop:0},
  btnWrapper:{flex:0.4, flexDirection:'row', justifyContent:'space-around',alignItems:'center', width:300, marginLeft:60}
});

export default CancelRestore

