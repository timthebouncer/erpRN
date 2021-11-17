import React,{useState,useEffect} from 'react';
import {View, Text,TextInput, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';



export const PrintModal=(props)=>{

  const[printName, setPrintName] = useState('')
  const {itemRef} = props

  const handleInput=(key,e)=>{
    itemRef.current = e
  }

  useEffect(()=>{
    AsyncStorage.getItem('printName').then((value) => {
      setPrintName(value)
      return JSON.parse(value);
    });
  },[])

  return(
    <View style={styles.makeRow}>
        <Text style={styles.makeText}>列印機名稱</Text>
        <TextInput defaultValue={printName} style={styles.input} onChangeText={(e)=>handleInput('printName',e)} />
    </View>
  )
}

const styles = StyleSheet.create({
  makeRow:{flexDirection:'row',width:'100%',justifyContent:'space-around'},
  makeText:{fontSize:20,lineHeight:50},
  input:{
    height: 50,
    width:150,
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
