import React, { useState } from "react";
import NumericInput from 'react-native-numeric-input'

const Counter=({setQuantity,quantity})=>{
  return(
    <NumericInput
      value={quantity}
      onChange={value => setQuantity(value)}
      onLimitReached={(isMax,msg) => console.log(isMax,msg)}
      totalWidth={220}
      totalHeight={50}
      iconSize={25}
      valueType='integer'
      rounded
      textColor='black'
      containerStyle={{backgroundColor:'white'}}
      iconStyle={{ color: 'black' }}
      rightButtonBackgroundColor='white'
      leftButtonBackgroundColor='white'
      minValue={1}
      initValue={quantity}
    />
  )
}

export default Counter
