
const payment={
  1:'貨到付款',
  2:'匯款',
  3:'現金'
}

export const paymentMethods=(val)=>{
  return payment[val]
}
