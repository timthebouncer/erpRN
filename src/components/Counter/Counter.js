import React, { useState } from "react";
import NumericInput from 'react-native-numeric-input'

const Counter=({setQuantity,quantity,itemRef})=>{
  // if(itemRef === null) return
  // itemRef.quantity = quantity
  return(
    <NumericInput
      value={quantity}
      onChange={value => setQuantity(value)}
      onLimitReached={(isMax,msg) => console.log(isMax,msg)}
      totalWidth={240}
      totalHeight={50}
      iconSize={25}
      valueType='integer'
      rounded
      textColor='#B0228C'
      iconStyle={{ color: 'white' }}
      rightButtonBackgroundColor='#EA3788'
      leftButtonBackgroundColor='#E56B70'
      minValue={1}
      initValue={quantity}
    />
  )
}

export default Counter
