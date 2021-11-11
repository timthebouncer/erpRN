const temperature ={
  1:'常溫',
  2:'冷藏',
  3:'冷凍',
}

export const temperatureMethods=(val)=>{
  return temperature[val]
}
