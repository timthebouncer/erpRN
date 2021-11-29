import {Text, View,StyleSheet} from 'react-native';
import React from 'react';

export const formatData=(type,item)=>{
  if(type === 'customer'){
    return <View style={[styles.flexRow,styles.itemsCenter]}>
      <Text style={[styles.textStyle,styles.w200]}>{item.name}</Text>
      <Text style={[styles.textStyle,styles.w85]}>{item.tel?item.tel:''}</Text>
    </View>
  }else {
    return <View style={[styles.flexCol,styles.justifyCenter]}>
      <View style={[styles.flexRow,styles.itemsCenter]}>
        <Text style={item.id === 0 || item.id === 1? [styles.textStyle,styles.mt23] :[styles.textStyle,styles.mr15]}>{item.receiver}</Text>
        <Text style={styles.textStyle}>{item.tel?item.tel:''}</Text>
      </View>
      <View style={[styles.flexRow,styles.justifyCenter]}>
        <Text style={[styles.textStyle,styles.mr30]}>{item.postCode}</Text>
        <Text  style={[styles.textStyle,styles.w250]}>{item.address}</Text>
      </View>
    </View>
  }
}

const styles = StyleSheet.create({
  textStyle:{fontSize:18},
  w200:{width:200},
  w250:{width:250},
  w85:{width:85},
  flexRow:{flexDirection:'row'},
  itemsCenter:{alignItems:'center'},
  flexCol:{flexDirection:'column'},
  justifyCenter:{justifyContent:'center'},
  mt23: {marginTop: 23},
  mr15:{marginRight:15},
  mr30:{marginRight:30}

})
