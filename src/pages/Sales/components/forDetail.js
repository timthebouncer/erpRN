import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {paymentMethods} from '../../../util/paymentTransfer';
import {deliveryMethods} from '../../../util/deliveryTransfer';
import {temperatureMethods} from '../../../util/temperatureTransfer';
import {volumeMethods} from '../../../util/volumeTransfer';
import {formatPrice} from '../../../util/formatPrice';

const ForDetail=({orderDetail})=>{
  console.log(2);
  return(
    <View>
    <View style={styles.firstPart}>
      <Text style={styles.textStyle}>出貨日期:{orderDetail.salesDay}</Text>
      <Text style={styles.textStyle}>出貨單號:{orderDetail.orderNo}</Text>
      <Text style={styles.textStyle}>客戶類別:{orderDetail.className}</Text>
      <Text style={styles.textStyle}>客戶資料:{orderDetail.clientName}</Text>
      {
        orderDetail.phoneNumber ?(
          <Text style={styles.textStyle8}>{orderDetail.phoneNumber}</Text>
        ):<></>
      }
      <Text style={styles.textStyle}>收件資料:{orderDetail.receiver}</Text>
      {
        orderDetail.receiverPhone?<Text style={styles.textStyle8}>{orderDetail.receiverPhone}</Text>:<></>
      }
      <Text style={styles.textStyle8}>{orderDetail.receiveAddress}</Text>
      <Text style={styles.textStyle}>付款方式:{paymentMethods(orderDetail.payment)}</Text>
      <Text style={styles.textStyle}>出貨方式:{deliveryMethods(orderDetail.shipment)}
        /{temperatureMethods(orderDetail.temperatureCategory)}
        /{volumeMethods(orderDetail.volume)}
      </Text>
      <Text style={styles.textStyle}>運費金額:{orderDetail.shippingFee}</Text>
      {/*<Text style={styles.textStyle}>商品內容:{productContent[orderList.chicken]}{productContent[orderList.egg]}{productContent[orderList.vegetable]}</Text>*/}
      <Text style={styles.textStyle}>件數:{orderDetail.piecesAmount}</Text>
      <View style={styles.remarkArea}>
        <Text style={styles.textStyle}>備註:</Text>
        <Text style={styles.remarkContent}>{orderDetail.remark}</Text>
      </View>
    </View>
    <View style={styles.productTitle}><Text style={{fontSize:18}}>商品資料</Text></View>
      <View>
        {
          orderDetail.orderDetailItemResponseList.map(item=>{
          return(
            <View key={item.id} style={styles.productContent}>
              <View style={styles.contentLeft}>
                <Text style={styles.textStyle6}>{item.barcode}</Text>
                <Text style={styles.textStyle6}>{item.alias}</Text>
                <Text style={styles.textStyle6}>{item.unit}</Text>
                <Text style={styles.textStyle6}>建議售價:{item.price}</Text>
                <Text style={styles.textStyle6}>備註{item.remark}</Text>
              </View>
              <View style={styles.contentRight}>
                <Text style={styles.textStyle6}>數量</Text>
                {
                  ['公斤','公克','台斤'].includes(item.unit) ? (
                    <Text style={styles.textStyle6}>{item.weight}</Text>
                  ):(
                    <Text style={styles.textStyle6}>{item.amount}</Text>
                  )
                }
                <Text style={styles.textStyle6}>單價${formatPrice(item.clientPrice)}</Text>
                <Text style={styles.textStyle6}>小計
                  {
                    ['公斤','公克','台斤'].includes(item.unit) ? (
                      <Text>
                        ${formatPrice((item.clientPrice*item.weight).toFixed(2))}
                      </Text>
                    ):(
                      <Text>
                        ${formatPrice((item.clientPrice*item.amount).toFixed(2))}
                      </Text>
                    )
                  }
                </Text>
              </View>
            </View>
          )
        })
        }
      </View>
    </View>
)
}

const styles = StyleSheet.create({
  textStyle:{fontSize:20,marginBottom:25},
  textStyle6:{fontSize:18,marginBottom:20},
  textStyle8:{fontSize:20,marginBottom:25,marginLeft:85},

  firstPart:{flex:0.5,padding:5,borderTopColor: '#e5cec6',
    borderTopWidth: 1,},

  productTitle:{backgroundColor:'#BBBBBB',marginLeft:5,height:30, marginBottom:10, borderRadius: 5},
  productContent:{flex:1, flexDirection:'row', justifyContent:'space-between', padding:15, backgroundColor:'white',height:250,width:400,marginLeft: 5,
    marginTop:-10,marginBottom:13,borderRadius:10,shadowColor: "#000",shadowOffset: { width: 0, height: 5,}, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 10,
  },
  contentLeft:{marginLeft: 5},
  contentRight:{marginRight: 70,marginTop:20},
  remarkArea:{flex:1, flexDirection:'row', justifyContent:'space-between',marginBottom:30},
  remarkContent:{backgroundColor:'#e9dbd5',width:310,marginRight:5,height:100,fontSize:25},
})

export default ForDetail
