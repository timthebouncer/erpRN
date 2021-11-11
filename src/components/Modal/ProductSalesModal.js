import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import {Picker} from '@react-native-picker/picker'
import {Button} from 'react-native-paper';
import Counter from '../Counter/Counter';


const ProductSalesModal=(props)=>{
  const{checkedClassId,productSales,itemRef} = props

  const [selectedValue, setSelectedValue] = useState("");
  const[quantity, setQuantity] = useState(1)
  const [newProductList,setNewProductList] = useState({})
  const [depotList,setDepotList] = useState([])

  const handleInput=(key,e)=>{
    itemRef.current[key] = e
  }
  const onChangeSelect=(e)=>{
    setSelectedValue(e)
    itemRef.current = productSales.find(item=>item.depotId === e)
    itemRef.current.quantity = quantity
  }


  useEffect(()=>{
      const newProductSales = [...productSales]
      setNewProductList({...newProductSales[0]})
      const depotList = newProductSales.map(item => {
        let newObject = {}
        newObject.depotId = item.depotId
        newObject.depotName = item.depotName
        return newObject
      })
      setDepotList(depotList)
      itemRef.current = newProductList
      itemRef.current.quantity = quantity
    console.log(itemRef,'itemRef');
  },[])

  // useEffect(()=>{
  //   itemRef.current.quantity = quantity
  //   console.log(1);
  // },[setQuantity])

  const onChange=(e)=>{
    setQuantity(e)
    itemRef.current.quantity = e
  }

  return(
    <View>
              <View style={{flexDirection:'row', justifyContent:'space-between',marginBottom:35}}>
                <Text style={{fontSize:20}}>商品條碼</Text>
                <Text style={{fontSize:20}}>{newProductList?.barcode}</Text>
              </View>
              <View style={{flexDirection:'row', justifyContent:'space-between',marginBottom:35}}>
                <Text style={{fontSize:20}}>商品名稱</Text>
                <Text style={{fontSize:20}}>{newProductList?.alias ? newProductList?.alias: newProductList?.productName}</Text>
              </View>
              <View style={{flexDirection:'row', justifyContent:'space-between',marginBottom:35}}>
                <Text style={{fontSize:20}}>庫存倉庫</Text>
                <Picker
                  selectedValue={selectedValue}
                  style={{ height: 50, width: 160 }}
                  onValueChange={(itemValue) => onChangeSelect(itemValue)}
                >
                  {
                    depotList.map(item =>{
                      return(
                        <Picker.Item style={{width:150}} key={item.depotId} label={item.depotName} value={item.depotId} />
                      )
                    })
                  }
                </Picker>
              </View>
              <View style={{flexDirection:'row', justifyContent:'space-between',marginBottom:35}}>
                <Text style={{fontSize:20}}>單位</Text>
                <Text style={{fontSize:20}}>{newProductList?.unit}</Text>
              </View>
              <View style={{flexDirection:'row', justifyContent:'space-between',marginBottom:35}}>
                <Text style={{fontSize:20}}>數量</Text>
                <Counter quantity={quantity} setQuantity={e=>onChange(e)} itemRef={itemRef.current} />
              </View>
              <View style={{flexDirection:'row', justifyContent:'space-between',marginBottom:35}}>
                <Text style={{fontSize:20}}>備註</Text>
                <TextInput multiline onChangeText={(e)=>handleInput('remark',e)} style={styles.textArea}/>
              </View>
    </View>
  )
}

const styles = StyleSheet.create({
  textArea:{
    height: 100,
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
})

export default ProductSalesModal
