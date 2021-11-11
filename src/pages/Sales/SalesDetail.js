import React,{useState,useEffect} from 'react'
import {StyleSheet,Text, View, ScrollView} from 'react-native';
import service from '../../apis/check';
// import { RadioButton } from 'react-native-material-ui';
import {Button ,RadioButton} from 'react-native-paper';
import {paymentMethods} from '../../util/paymentTransfer';
import {deliveryMethods} from '../../util/deliveryTransfer';
import {temperatureMethods} from '../../util/temperatureTransfer';
import {volumeMethods} from '../../util/volumeTransfer';
import {formatPrice} from '../../util/formatPrice';
import {useContextSelector} from 'use-context-selector';
import {orderListContext} from '../../store/orderListProvider';

const SalesDetail=({route})=>{
  const [orderDetail, setOrderDetail]=useState({})
  const [totalPackage, setTotalPackage] = useState(0)
  const [totalMoney, setTotalMoney] = useState(0)
  const [firstChecked, setFirstChecked] = React.useState(1);
  const [secondChecked, setSecondChecked] = React.useState(1);

  const [orderList]  = useContextSelector(orderListContext,e=>[e.orderList])

  const calculateTotalPack=(orderDetailItemResponseList)=>{
    let total=0;
    let totalM=0;
    orderDetailItemResponseList.forEach(item=>{
      total += parseInt(item.amount)
      totalM += item.clientPrice * item.amount
    })
    setTotalPackage(total)
    setTotalMoney(totalM)
  }


  const submitHandler=()=>{

  }


  useEffect(()=>{

    if(route.params !== undefined){
      service.Distribute.getDistributeDetail(route.params.orderId)
        .then(res=>{
          const {orderDetailItemResponseList} =res.data
          setOrderDetail(res.data)
          calculateTotalPack(orderDetailItemResponseList)
        })
    }else {
      console.log(orderList,123);
      // setOrderDetail(...orderList)
      return
    }

  },[])

  if(!orderDetail.orderDetailItemResponseList){
    return <View><Text>Loading</Text></View>
  }


  return(
    <ScrollView style={{backgroundColor:'#FFF0E9'}}>
      <View style={{alignItems:'center'}}><Text style={styles.textStyle5}>出貨單</Text></View>
      <View style={styles.firstPart}>
        <Text style={styles.textStyle}>出貨日期:{orderDetail.salesDay}</Text>
        <Text style={styles.textStyle}>出貨單號:{orderDetail.orderNo}</Text>
        <Text style={styles.textStyle}>客戶類別:{orderDetail.className}</Text>
        <Text style={styles.textStyle}>客戶資料:{orderDetail.clientName}</Text>
        {
          orderDetail.phoneNumber?(
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
        <Text style={styles.textStyle}>商品內容:-</Text>
        <Text style={styles.textStyle}>件數:{orderDetail.piecesAmount}</Text>
        <View style={styles.remarkArea}>
          <Text style={styles.textStyle}>備註:</Text>
          <Text style={styles.remarkContent}>{orderDetail.remark}</Text>
        </View>

      </View>
      <View style={styles.productTitle}><Text style={{fontSize:18}}>商品資料</Text></View>
      {
        orderDetail.orderDetailItemResponseList.length ? (
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
          ):(
            <View>
                <Text>000</Text>
            </View>
          )
      }
      <View style={styles.checkoutWrapper}>
        <View>
          <Text style={styles.textStyle7}>總包數</Text>
          <Text style={styles.textStyle7}>合計</Text>
          <Text style={styles.textStyle7}>折讓</Text>
          <Text style={styles.textStyle7}>運費</Text>
          <Text style={styles.textStyle7}>總計</Text>
        </View>
        <View>
          <Text style={styles.textStyle7}>{totalPackage}</Text>
          <Text style={styles.textStyle7}>${totalMoney.toFixed(2)}</Text>
          <Text style={styles.textStyle7}>${orderDetail.allowance}</Text>
          <Text style={styles.textStyle7}>${orderDetail.shippingFee}</Text>
          <Text style={styles.textStyle7}>${(totalMoney + orderDetail.shippingFee - orderDetail.allowance).toFixed(2)}</Text>
        </View>
      </View>
      <View style={styles.productTitle}><Text style={{fontSize:18}}>列印資料</Text></View>
      <View>
        <View style={styles.radioWrapper}>
          <Text style={styles.radioTitle}>1.</Text>
          <View style={styles.radioBtn}>
            <RadioButton
              value={1}
              color={'#1976D2'}
              status={ firstChecked === 1 ? 'checked' : 'unchecked' }
              onPress={() => setFirstChecked(1)}
            />
            <Text style={styles.radioText}>商用格式</Text>
          </View>

          <View style={styles.radioBtn}>
            <RadioButton value={2}
                         color={'#1976D2'}
                         status={ firstChecked === 2 ? 'checked' : 'unchecked' }
                         onPress={() => setFirstChecked(2)}
            />
            <Text style={styles.radioText}>零售格式</Text>
          </View>
        </View>

        <View style={styles.radioWrapper}>
          <Text style={styles.radioTitle}>2.</Text>
          <View style={styles.radioPriceBtn}>
            <RadioButton
              value={1}
              color={'#1976D2'}
              status={ secondChecked === 1 ? 'checked' : 'unchecked' }
              onPress={() => setSecondChecked(1)}
            />
            <Text style={styles.radioPrice}>有價格+無價格(各一份)</Text>
          </View>
          <View style={styles.radioPriceBtn}>
            <RadioButton
              value={2}
              color={'#1976D2'}
              status={ secondChecked === 2 ? 'checked' : 'unchecked' }
              onPress={() => setSecondChecked(2)}
            />
            <Text style={styles.radioPrice}>無價格(一式兩份)</Text>
          </View>
        </View>
      </View>
      <View style={styles.btnDistributeTag}>
        <Button onPress={()=>{submitHandler(1)}} mode="contained" style={styles.confirmBtn} >
          <Text style={styles.textStyle3}> 列印出貨單/貼箱標籤</Text>
        </Button>
      </View>
      <View style={styles.btnWrapper}>
        <Button onPress={()=>{}} mode="contained" style={styles.btnBack} >
          <Text style={[styles.textStyle2,styles.textStyle4]}>返回修改</Text>
        </Button>
        <Button onPress={()=>{}} mode="contained" style={styles.btnPrint} >
          <Text style={styles.textStyle2}>列印出貨單</Text>
        </Button>
        <Button onPress={()=>{}} mode="contained" style={styles.btnPrintTag} >
          <Text style={styles.textStyle2}>列印貼箱標籤</Text>
        </Button>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  textStyle:{fontSize:20,marginBottom:25},
  textStyle2:{fontSize: 15},
  textStyle3:{fontSize: 22,lineHeight:40},
  textStyle4:{color:'black'},
  textStyle5:{fontSize: 35, justifyContent:'center', alignItems:'center'},
  textStyle6:{fontSize:18,marginBottom:20},
  textStyle7:{fontSize:28,marginBottom:20},
  textStyle8:{fontSize:20,marginBottom:25,marginLeft:85},

  firstPart:{flex:0.5,padding:5,borderTopColor: '#e5cec6',
    borderTopWidth: 1,},

  productTitle:{backgroundColor:'#BBBBBB',marginLeft:5,height:30, width:400, marginBottom:10, borderRadius: 5},
  productContent:{flex:1, flexDirection:'row', justifyContent:'space-between', padding:15, backgroundColor:'white',height:250,width:400,marginLeft: 5,
    marginTop:-10,marginBottom:13,borderRadius:10,shadowColor: "#000",shadowOffset: { width: 0, height: 5,}, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 10,
  },
  contentLeft:{marginLeft: 5},
  contentRight:{marginRight: 70,marginTop:20},
  remarkArea:{flex:1, flexDirection:'row', justifyContent:'space-between',marginBottom:30},
  remarkContent:{backgroundColor:'#e9dbd5',width:310,marginRight:5,height:100,fontSize:25},

  checkoutWrapper:{flex:1, flexDirection:'row', justifyContent:'space-between', padding:10},

  radioWrapper:{flexDirection:'row', justifyContent:'space-between',alignItems: "center",paddingLeft:10,paddingRight:10},
  radioBtn:{flexDirection:'row',marginRight:55},
  radioTitle:{fontSize:20,alignItems:"center"},
  radioText:{fontSize:17, alignItems: "center", lineHeight: 32},
  radioPriceBtn:{flexDirection:'row',marginTop:15},
  radioPrice:{fontSize:17, alignItems: "center", width:125},
  btnDistributeTag:{alignItems:'center',marginBottom: 5, marginTop:25},
  confirmBtn:{width:300,height:60,elevation: 0,borderWidth:1,borderColor:'#e1d7cb',backgroundColor:'#2B81D6'},
  btnWrapper:{flexDirection:'row',justifyContent:'space-between', padding:10},
  btnBack:{backgroundColor: 'white',width:125,height:40,elevation: 0,borderWidth:1,borderColor:'#e1d7cb'},
  btnPrint:{backgroundColor: '#8EC82E',width:120,height:40,elevation: 0,borderWidth:1,borderColor:'#e1d7cb'},
  btnPrintTag:{backgroundColor: '#8EC82E',width:135,height:40,elevation: 0,borderWidth:1,borderColor:'#e1d7cb'},

})

export default SalesDetail
