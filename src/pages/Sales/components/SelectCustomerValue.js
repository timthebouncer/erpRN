import React from 'react';
import {View, Text} from 'react-native';



const SelectedCustomer=({customerList,checkedCustomer})=>{
  if(!checkedCustomer) return<></>
    let customerInfo = customerList.find(item=>item.id === checkedCustomer)

    return(
      <View>
        <Text style={{color:'black',fontSize:17}}>{customerInfo.name}</Text>
        <Text style={{color:'black',fontSize:17}}>{customerInfo.tel}</Text>
      </View>
    )

}

export default SelectedCustomer
