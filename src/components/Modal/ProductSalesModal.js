import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, TextInput,ScrollView} from 'react-native';
import {Picker} from '@react-native-picker/picker'
import {Button} from 'react-native-paper';
import Counter from '../Counter/Counter';


const ProductSalesModal=(props)=>{
  const{productSales,itemRef} = props

  const [selectedValue, setSelectedValue] = useState("");
  const[quantity, setQuantity] = useState(1)
  const [newProductList,setNewProductList] = useState({})
  const [depotList,setDepotList] = useState([])
  const inputRef = useRef(null)

  const handleInput=(key,e)=>{
    itemRef.current[key] = e
  }
  const onChangeSelect=(e)=>{
    setSelectedValue(e)
    itemRef.current = productSales.find(item=>item.depotId === e)
    itemRef.current.quantity = ['公斤','公克','台斤'].includes(newProductList.unit) ? 1:quantity
  }

  const setProductList =()=>{
   itemRef.current = newProductList
   itemRef.current.quantity = ['公斤','公克','台斤'].includes(newProductList.unit) ? 1:quantity
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

    inputRef.current.focus()

  },[])

  useEffect(setProductList,[newProductList])

  const onChange=(e)=>{
    setQuantity(e)
    itemRef.current.quantity = e
  }

  return(
    <ScrollView>
      <View style={styles.mt10}>
              <View style={styles.rowWrapper}>
                <Text style={styles.makeText}>商品條碼</Text>
                <Text style={styles.makeText}>{newProductList?.barcode}</Text>
              </View>
              <View style={styles.rowWrapper}>
                <Text style={styles.makeText}>商品名稱</Text>
                <Text style={styles.makeText}>{newProductList?.alias ? newProductList?.alias: newProductList?.productName}</Text>
              </View>
                {
                  depotList.length > 1 && <View style={styles.rowWrapper}>
                    <Text style={styles.makeText}>庫存倉庫</Text>
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
                }
              <View style={styles.rowWrapper}>
                <Text style={styles.makeText}>單位</Text>
                <Text style={styles.makeText}>{newProductList?.unit}</Text>
              </View>
              <View style={styles.rowWrapper}>
                <Text style={styles.makeText}>數量</Text>
                {
                  ['公斤','公克','台斤'].includes(newProductList.unit) ? (
                    <Text style={styles.makeText}>{newProductList.weight.toFixed(3)}</Text>
                  ):<Counter quantity={quantity} setQuantity={e=>onChange(e)} />
                }
              </View>
              <View style={styles.rowWrapper}>
                <Text style={styles.makeText}>備註</Text>
                <TextInput ref={inputRef} multiline onChangeText={(e)=>handleInput('remark',e)} style={styles.textArea}/>
              </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  rowWrapper:{flexDirection:'row', justifyContent:'space-between',marginBottom:35},
  makeText: {fontSize: 20},
  textArea:{
    textAlignVertical: 'top',
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
  mt10:{marginTop:10}
})

export default ProductSalesModal
