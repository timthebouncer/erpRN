import {StyleSheet, Text, View} from 'react-native';
import {paymentMethods} from '../../../util/paymentTransfer';
import {deliveryMethods} from '../../../util/deliveryTransfer';
import {temperatureMethods} from '../../../util/temperatureTransfer';
import {volumeMethods} from '../../../util/volumeTransfer';
import {formatPrice} from '../../../util/formatPrice';
import React, {useState} from 'react';
import {Icon} from 'react-native-material-ui';


const ForSales=({orderDetail,clientInfo,checkboxes,getReceiver})=>{
  const {defaultReceiveInfo}=orderDetail

  return(
    <View>
      <View style={styles.firstPart}>
        <Text style={styles.textStyle}>出貨日期:{orderDetail.stockOutDate}</Text>
        <Text style={styles.textStyle}>出貨單號:{orderDetail.orderNo}</Text>
        <Text style={styles.textStyle}>客戶類別:{clientInfo?.classes?.name}</Text>
        <Text style={styles.textStyle}>客戶資料:{clientInfo.name}</Text>
        {
          clientInfo.tel?(
            <Text style={styles.textStyle8}>{clientInfo.tel}</Text>
          ):<></>
        }
        <View style={styles.makeRow}>
          <Text style={[styles.textStyle]}>收件資料:</Text>
          <Text style={styles.textStyle}>{defaultReceiveInfo === 0 ? clientInfo.name : defaultReceiveInfo === 1 ? clientInfo.companyName:getReceiver.receiver}</Text>
        </View>
        <Text style={styles.textStyle8}>{defaultReceiveInfo === 0 ? clientInfo.tel : defaultReceiveInfo === 1 ? clientInfo.companyTel:getReceiver.tel}</Text>
        <View style={{flexDirection:'column'}}>
          <Text style={[styles.textStyle2]}>{defaultReceiveInfo === 0 ? clientInfo.postCode : defaultReceiveInfo === 1 ? clientInfo.companyPostCode:getReceiver.postCode}</Text>
          <Text multiline={true} style={[styles.textStyle,styles.makeMarginL]}>{defaultReceiveInfo === 0 ? clientInfo.address : defaultReceiveInfo === 1 ? clientInfo.companyAddress:getReceiver.address}</Text>
        </View>
        <Text style={styles.textStyle}>付款方式:{paymentMethods(orderDetail.payment)}</Text>
        <Text style={styles.textStyle}>出貨方式:{deliveryMethods(orderDetail.shipment)}
          /{temperatureMethods(orderDetail.temperatureCategory)}
          /{volumeMethods(orderDetail.volume)}
        </Text>
        {
          orderDetail.trackingNo ?<Text style={styles.textStyle}>物流編號:{orderDetail.trackingNo}</Text>:<></>
        }
        <Text style={styles.textStyle}>運費金額:{orderDetail.shippingFee}</Text>
        <View style={{flexDirection:'row'}}>
          <Text style={styles.textStyle}>商品內容:</Text>
          {
            checkboxes && checkboxes.map(item=>{
              return(
                item.checked === true ? <View style={styles.makeInline}><Icon name='check-box' /><Text style={[styles.textStyle,styles.makeMarginR]}>{item.title}</Text></View>:<></>
              )
            })
          }
        </View>
        <Text style={styles.textStyle}>件數:{orderDetail.piecesAmount}</Text>
        <View style={styles.remarkArea}>
          <Text style={styles.textStyle}>備註:</Text>
          <Text style={styles.remarkContent}>{orderDetail.remark}</Text>
        </View>

      </View>
      <View style={styles.productTitle}><Text style={{fontSize:18}}>商品資料</Text></View>
      {
          orderDetail.orderItemRequestList.map((item,index)=>{
            return(
              <View key={index} style={styles.productContent}>
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
  )
}


const styles = StyleSheet.create({
  textStyle:{fontSize:20,marginBottom:25},
  textStyle2:{fontSize:20,marginBottom:20,marginLeft:85},
  textStyle6:{fontSize:18,marginBottom:20},
  textStyle8:{fontSize:20,marginBottom:25,marginLeft:85},
  makeRow:{flexDirection:'row'},
  makeInline:{
    paddingHorizontal: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline"
  },
  makeMarginR:{marginRight:20},
  makeMarginL:{marginLeft:85},
  // makeMarginL:{marginLeft:-20},
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

export default ForSales;
