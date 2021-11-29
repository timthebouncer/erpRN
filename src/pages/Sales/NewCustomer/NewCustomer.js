import React, {useEffect, useRef} from 'react';
import {View, Text, StyleSheet, TextInput,ScrollView} from 'react-native';


const NewCustomer=(props)=>{
  const{setNewCustomer,setNewReceiver,receiveInfo} = props
  const inputRef = useRef(null)
  const newValue = useRef({id:'',receiver: "",tel: "",postCode: "",address: ""})

  const handleInput=(key,e)=>{
    if(props.type === 'customer'){
      setNewCustomer(f => ({ ...f, [key]: e}));
    }else if(props.type === 'receiver'){
      newValue.current[key] = e
      setNewReceiver(f => ({
        ...f,recipientList: [...receiveInfo.recipientList, newValue.current]
      }))
    }
  }

  useEffect(()=>{
    inputRef.current.focus()
  })


  return(
    <ScrollView>
    {
      props.type === 'customer' ? (
        <>
          <View style={[styles.itemsCenter,styles.mt10,styles.mb30]}><Text style={styles.text30}>新增客戶資料</Text></View>
          <View style={[styles.flexRow,styles.spaceBetween,styles.mb50]}>
            <Text style={styles.infoTitle}>客戶名稱</Text>
            <TextInput ref={inputRef} onChangeText={(e)=>handleInput('name',e)} style={styles.input} />
          </View>
          <View style={[styles.flexRow,styles.spaceBetween,styles.mb50]}>
            <Text style={styles.infoTitle}>客戶電話</Text>
            <TextInput onChangeText={(e)=>handleInput('tel',e)} style={styles.input}/>
          </View>
          <View style={[styles.flexRow,styles.spaceBetween,styles.mb50]}>
            <Text style={styles.infoTitle}>郵遞區號</Text>
            <TextInput onChangeText={(e)=>handleInput('postCode',e)} style={styles.input}/>
          </View>
          <View style={[styles.flexRow,styles.spaceBetween,styles.mb50]}>
            <Text style={styles.infoTitle}>聯絡地址</Text>
            <TextInput onChangeText={(e)=>handleInput('address',e)} style={styles.input}/>
          </View>
        </>):(
          <>
          <View style={[styles.itemsCenter,styles.mt10,styles.mb30]}><Text style={styles.text30}>新增收件資料</Text></View>
          <View style={[styles.flexRow,styles.spaceBetween,styles.mb50]}>
          <Text style={styles.infoTitle}>收件人</Text>
          <TextInput ref={inputRef} onChangeText={(e)=>handleInput('receiver',e)} style={styles.input} />
          </View>
          <View style={[styles.flexRow,styles.spaceBetween,styles.mb50]}>
          <Text style={styles.infoTitle}>收件電話</Text>
          <TextInput onChangeText={(e)=>handleInput('tel',e)} style={styles.input}/>
          </View>
          <View style={[styles.flexRow,styles.spaceBetween,styles.mb50]}>
          <Text style={styles.infoTitle}>郵遞區號</Text>
          <TextInput onChangeText={(e)=>handleInput('postCode',e)} style={styles.input}/>
          </View>
          <View style={[styles.flexRow,styles.spaceBetween,styles.mb50]}>
          <Text style={styles.infoTitle}>收件地址</Text>
          <TextInput onChangeText={(e)=>handleInput('address',e)} style={styles.input}/>
          </View>
          </>
      )
    }
    </ScrollView>
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
  },
  itemsCenter:{alignItems:'center'},
  mt10:{ marginTop:10},
  mb30:{ marginBottom:30},
  text30:{fontSize:30},
  flexRow:{flexDirection:'row'},
  spaceBetween:{justifyContent:'space-between'},
  mb50:{marginBottom:50}

})

export default NewCustomer
