import React, {useEffect} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';


const NewCustomer=(props)=>{
  const{setNewCustomer,setNewReceiver} = props


  const handleInput=(key,e)=>{
    if(props.type === 'customer'){
      setNewCustomer(f => ({ ...f, [key]: e}));
    }else if(props.type === 'receiver'){
      setNewReceiver(f => ({
        ...f,recipientList: {...f.recipientList,[key]: e}
      }))
    }
  }


  return(
    <View>
    {
      props.type === 'customer' ? (
        <>
        <View style={{alignItems:'center', marginTop:-50,marginBottom:30}}><Text style={{fontSize:30}}>新增客戶資料</Text></View>
        <View>
          <View style={{flexDirection:'row', justifyContent:'space-between',marginBottom:50}}>
            <Text style={styles.infoTitle}>客戶名稱</Text>
            <TextInput onChangeText={(e)=>handleInput('name',e)} style={styles.input} />
          </View>
          <View style={{flexDirection:'row', justifyContent:'space-between',marginBottom:50}}>
            <Text style={styles.infoTitle}>客戶電話</Text>
            <TextInput onChangeText={(e)=>handleInput('tel',e)} style={styles.input}/>
          </View>
          <View style={{flexDirection:'row', justifyContent:'space-between',marginBottom:50}}>
            <Text style={styles.infoTitle}>郵遞區號</Text>
            <TextInput onChangeText={(e)=>handleInput('postCode',e)} style={styles.input}/>
          </View>
          <View style={{flexDirection:'row', justifyContent:'space-between',marginBottom:50}}>
            <Text style={styles.infoTitle}>聯絡地址</Text>
            <TextInput onChangeText={(e)=>handleInput('address',e)} style={styles.input}/>
          </View>
        </View></>):(
          <>
          <View style={{alignItems:'center', marginTop:-50,marginBottom:30}}><Text style={{fontSize:30}}>新增收件資料</Text></View>
          <View>
          <View style={{flexDirection:'row', justifyContent:'space-between',marginBottom:50}}>
          <Text style={styles.infoTitle}>收件人</Text>
          <TextInput onChangeText={(e)=>handleInput('receiver',e)} style={styles.input} />
          </View>
          <View style={{flexDirection:'row', justifyContent:'space-between',marginBottom:50}}>
          <Text style={styles.infoTitle}>收件電話</Text>
          <TextInput onChangeText={(e)=>handleInput('tel',e)} style={styles.input}/>
          </View>
          <View style={{flexDirection:'row', justifyContent:'space-between',marginBottom:50}}>
          <Text style={styles.infoTitle}>郵遞區號</Text>
          <TextInput onChangeText={(e)=>handleInput('postCode',e)} style={styles.input}/>
          </View>
          <View style={{flexDirection:'row', justifyContent:'space-between',marginBottom:50}}>
          <Text style={styles.infoTitle}>收件地址</Text>
          <TextInput onChangeText={(e)=>handleInput('address',e)} style={styles.input}/>
          </View>
          </View>
          </>
      )
    }
    </View>
  )
}

const styles = StyleSheet.create({
  infoTitle:{fontSize:20, lineHeight: 50},
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
  }
})

export default NewCustomer
