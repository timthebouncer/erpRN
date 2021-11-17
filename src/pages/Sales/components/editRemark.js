import {View, Text, TextInput,StyleSheet} from 'react-native'
import React, {useEffect, useState} from 'react';


const EditRemark=({item,setRemark})=>{


  return <View>
    <View style={styles.makeRow}><Text style={styles.makeText}>商品條碼</Text><Text style={styles.makeText}>{item.barcode}</Text></View>
    <View style={styles.makeRow}><Text style={styles.makeText}>商品名稱</Text><Text style={styles.makeText}>{item?.alias ? item?.alias: item?.productName}</Text></View>
    <View style={styles.makeRow}><Text style={[styles.makeText,styles.marginLeft10]}>備註</Text><TextInput defaultValue={item.remark} onChangeText={(e)=>setRemark(e)} multiline style={styles.input} /></View>
  </View>
}

const styles = StyleSheet.create({
  makeText:{fontSize:20,lineHeight:50,width:'80%'},
  marginLeft10:{marginLeft:10},
  makeRow:{flexDirection:'row', justifyContent:'space-around', width:'100%'},
  input:{
    marginRight:10,
    height: 110,
    width:230,
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

export default EditRemark
