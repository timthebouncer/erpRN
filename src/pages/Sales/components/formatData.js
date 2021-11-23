import {Text, View,StyleSheet} from 'react-native';
import React from 'react';

export const formatData=(type,item)=>{
  if(type === 'customer'){
    return <View style={{flexDirection:'row',alignItems:'center'}}>
      <Text style={[styles.textStyle8,styles.width100]}>{item.name}</Text>
      <Text style={[styles.textStyle8,styles.width50]}>{item.tel?item.tel:''}</Text>
    </View>
  }else {
    return <View style={{flexDirection:'column',justifyContent:'center'}}>
      <View style={{flexDirection:'row',alignItems:'center'}}>
        <Text style={item.id === 0 || item.id === 1? {fontSize:18,marginTop:23}:{fontSize:18,marginRight:15}}>{item.receiver}</Text>
        <Text style={{fontSize:18}}>{item.tel?item.tel:''}</Text>
      </View>
      <View style={{flexDirection:'row',justifyContent:'center'}}>
        <Text style={{fontSize:18,marginRight:30}}>{item.postCode}</Text>
        <Text  style={{fontSize:18,width:250}}>{item.address}</Text>
      </View>
    </View>
  }
}

const styles = StyleSheet.create({
  textStyle8:{fontSize:18},
  width100:{width:200},
  width50:{width:85},
})
