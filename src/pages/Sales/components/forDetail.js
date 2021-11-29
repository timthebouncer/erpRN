import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {paymentMethods} from '../../../util/paymentTransfer';
import {deliveryMethods} from '../../../util/deliveryTransfer';
import {temperatureMethods} from '../../../util/temperatureTransfer';
import {volumeMethods} from '../../../util/volumeTransfer';
import {formatPrice} from '../../../util/formatPrice';
import {Icon} from 'react-native-material-ui';

const ForDetail=({orderDetail})=>{
  const [checkboxes] = useState([])

  useEffect(()=>{
    checkboxes.push({id:1,title:'雞肉',checked:orderDetail.chicken})
    checkboxes.push({id:2,title:'雞蛋',checked:orderDetail.egg})
    checkboxes.push({id:3,title:'蔬菜',checked:orderDetail.vegetable})
  },[])

  return(
    <View>
    <View style={styles.firstPart}>
      <View style={[styles.makeRow]}>
        <Text style={[styles.textStyle,styles.makeMarginR]}>出貨日期:</Text>
        <Text style={styles.textStyle}>{orderDetail.salesDay}</Text>
      </View>
      <View style={[styles.makeRow]}>
        <Text style={[styles.textStyle,styles.makeMarginR]}>出貨單號:</Text>
        <Text style={styles.textStyle}>{orderDetail.orderNo}</Text>
      </View>
      <View style={[styles.makeRow]}>
        <Text style={[styles.textStyle,styles.makeMarginR]}>客戶類別:</Text>
        <Text style={styles.textStyle}>{orderDetail.className}</Text>
      </View>
      <View style={styles.makeRow}>
        <Text style={[styles.textStyle,styles.makeMarginR]}>客戶資料:</Text>
        <Text style={styles.textStyle}>{orderDetail.clientName}</Text>
      </View>
      {
        orderDetail.phoneNumber?(
          <Text style={[styles.textStyle8,styles.makeMarginL107]}>{orderDetail.phoneNumber}</Text>
        ):<></>
      }

      <View style={styles.makeRow}>
        <Text style={[styles.textStyle,styles.makeMarginR]}>收件資料:</Text>
        <Text style={styles.textStyle}>{orderDetail.receiver}</Text>
      </View>
      {
        orderDetail.receiverPhone?<Text style={[styles.textStyle8,styles.makeMarginL107]}>{orderDetail.receiver}</Text>:<></>
      }
      <View style={styles.flexCol}>
        <Text style={[styles.textStyle2,styles.makeMarginL107]}>{orderDetail.postCode}</Text>
        <Text multiline={true} style={[styles.textStyle,styles.makeMarginL107]}>{orderDetail.receiveAddress}</Text>
      </View>
      <View style={[styles.makeRow]}>
        <Text style={[styles.textStyle,styles.makeMarginR]}>付款方式:</Text>
        <Text style={styles.textStyle}>{paymentMethods(orderDetail.payment)}</Text>
      </View>


      <View style={[styles.makeRow]}>
        <Text style={[styles.textStyle,styles.makeMarginR]}>出貨方式: </Text>
        <Text style={styles.textStyle}>
          {
            orderDetail.shipment === 3 ? deliveryMethods(orderDetail.shipment):deliveryMethods(orderDetail.shipment)+'/'
              +temperatureMethods(orderDetail.temperatureCategory)+'/'+volumeMethods(orderDetail.volume)
          }
        </Text>
      </View>
      {
        orderDetail.trackingNo ?  <View style={[styles.makeRow,styles.makeMarginR]}>
          <Text style={styles.textStyle}>物流編號</Text>
          <Text style={styles.textStyle}>{orderDetail.trackingNo}</Text>
        </View>:<></>
      }
      <View style={[styles.makeRow]}>
        <Text style={[styles.textStyle,styles.makeMarginR]}>運費金額:</Text>
        <Text style={styles.textStyle}>{orderDetail.shippingFee}</Text>
      </View>
      <View style={[styles.makeRow,styles.makeMarginR]}>
        <Text style={styles.textStyle}>商品內容:</Text>
        {
          checkboxes && checkboxes.map(item=>{
            return(
              <View key={item.id} >
                {
                  item.checked === true ? <View style={styles.makeInline}>
                    <Icon name='check-box' /><Text style={[styles.textStyle,styles.makeMarginR]}>{item.title}</Text>
                  </View>:<></>
                }
              </View>
            )
          })
        }
      </View>
      <View style={[styles.makeRow]}>
        <Text style={[styles.textStyle,styles.makeMarginR]}>件數:</Text>
        <Text style={styles.textStyle}>{orderDetail.piecesAmount}</Text>
      </View>

      <View style={styles.remarkArea}>
        <Text style={styles.textStyle}>備註:</Text>
        <Text style={styles.remarkContent}>{orderDetail.remark}</Text>
      </View>

    </View>
    <View style={styles.productTitle}><Text style={styles.text18}>商品資料</Text></View>
      <View>
        {
          orderDetail.orderDetailItemResponseList.map((item,index)=>{
          return(
            <View key={item.id} style={styles.productContent}>
              <View style={styles.contentLeft}>
                <Text style={styles.textStyle6}>{item.barcode}</Text>
                <Text style={styles.textStyle6}>{item.alias ? item.alias:item.productName}</Text>
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
  text18:{fontSize:18},
  firstPart:{flex:0.5,padding:5,borderTopColor: '#e5cec6',
    borderTopWidth: 1,},

  productTitle:{backgroundColor:'#BBBBBB',marginLeft:5,height:30, marginBottom:10, borderRadius: 5},
  productContent:{flex:1, flexDirection:'row', justifyContent:'space-between', padding:15, backgroundColor:'white',height:250,marginLeft: 5,marginRight: 5,
    marginTop:-10,marginBottom:13,borderRadius:10,shadowColor: "#000",shadowOffset: { width: 0, height: 5,}, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 10,
  },
  contentLeft:{marginLeft: 5},
  contentRight:{marginRight: 70,marginTop:20},
  remarkArea:{flex:1, flexDirection:'row', justifyContent:'space-between',marginBottom:30},
  remarkContent:{backgroundColor:'#e9dbd5',width:'80%',marginRight:5,height:100,fontSize:25},

  makeRow:{flexDirection:'row'},
  makeMarginR:{marginRight:20},
  makeMarginL107:{marginLeft:107},
  textStyle2:{fontSize:20,marginBottom:20,marginLeft:85},
  makeInline:{
    paddingHorizontal: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline"
  },
  flexCol:{flexDirection:'column'}
})

export default ForDetail
