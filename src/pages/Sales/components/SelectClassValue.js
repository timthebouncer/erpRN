import React from 'react';
import {View, Text} from 'react-native';



const SelectedVal=({classList,checkedClassId})=>{
  if(!checkedClassId) return <></>
  let s = classList.find(item=>item.id === checkedClassId)
    return(
      <View>
        <Text style={{color:'black',fontSize:17}}>{s.className}</Text>
      </View>
    )
}

export default SelectedVal
