import React, {useState, useEffect, useMemo} from 'react';
import {StyleSheet, Text, View, ScrollView, Dimensions} from 'react-native';
import service from '../../apis/check';
import {Button ,RadioButton} from 'react-native-paper';
import {useContextSelector} from 'use-context-selector';
import {orderListContext} from '../../store/orderListProvider';
import ForSales from './components/forSales';
import ForDetail from './components/forDetail';
import {snackBarContext} from '../../components/SnackBar/SnackBar';
import { CommonActions } from '@react-navigation/native';


const SalesDetail=({route,navigation})=>{
  const [orderDetail, setOrderDetail]=useState({})
  const [orderItemList, setOrderItemList]=useState([])
  const [firstChecked, setFirstChecked] = useState(1);
  const [secondChecked, setSecondChecked] = useState(1);
  const [clientInfo,setClientInfo] = useState({})
  const {orderList, getReceiver,setEditOrderDetail}  = useContextSelector(orderListContext,e=>e)
  const {params} = route.params

  const {show} = useContextSelector(snackBarContext,e=>e)


  const {quantity, total} = useMemo(() => {
    const result = { quantity: 0, total: 0 }
    orderItemList.forEach((e) => {
      result.quantity += e.amount
      result.total += ['公斤','公克','台斤'].includes(e.unit) ? parseInt(e.clientPrice) * e.weight : parseInt(e.clientPrice) * e.amount
    })
    return result
  }, [orderItemList])


  const submitHandler=(type)=>{
     service.Distribute.addOrder(orderList)
        .then(res=>{
          show('出貨成功','success')
          console.log(res);
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                { name: 'SalesDetail' ,params:{orderId:res.data.orderId}},
              ],
            })
          );
          switch (type) {
            case 1:
              service.Distribute.printOrder(res.data.orderId,firstChecked)
                .then(res=>{
                  console.log(res,'商用格式');
                })
              service.Distribute.printOrder(res.data.orderId,secondChecked)
                .then(res=>{
                  console.log(res,'有價格');
                })
              service.Distribute.tagPrint({deliveryOrderId: res.data.orderId})
                .then(res=>{
                  console.log(res,'貼箱');
                })
              break;
            case 2:
              service.Distribute.printOrder(res.data.orderId,firstChecked)
                .then(res=>{
                  console.log(res,'商用格式');
                })
              service.Distribute.printOrder(res.data.orderId,secondChecked)
                .then(res=>{
                  console.log(res,'有價格');
                })
              break;
            case 3:
              service.Distribute.tagPrint(res.data.orderId)
                .then(res=>{
                  console.log(res,'貼箱');
                })
          }
        })
       .catch(err=>{
         const {message} = err.response.data
         show(message,'error')
       })
  }


  const lastPage =()=> {
    if(route.params.orderId){
      navigation.navigate({name:'Sales',params: {orderId: route.params.orderId}});
    }else {
      navigation.goBack();
    }
  }



  useEffect(()=>{
    if(route.params.orderId){
      service.Distribute.getDistributeDetail(route.params.orderId)
        .then(res=>{
          const {orderDetailItemResponseList} =res.data
          setOrderItemList(orderDetailItemResponseList)
          setOrderDetail(res.data)
          setEditOrderDetail(res.data)
        })
    }else {
      setOrderDetail(orderList)
      const {orderItemRequestList} = orderList
      setOrderItemList(orderItemRequestList)
      service.Customer.getClient(orderList.clientId)
        .then(res=>{
          setClientInfo(res.data)
        })
    }

  },[route])

  if(!orderDetail.orderItemRequestList && !orderDetail.orderDetailItemResponseList){
    return <View><Text>Loading</Text></View>
  }
  let deviceWidth = Dimensions.get('screen').width

  return(
    <ScrollView style={{backgroundColor:'#FFF0E9', width:deviceWidth}}>
      <View style={{alignItems:'center'}}><Text style={styles.textStyle5}>出貨單</Text></View>
      {
        orderDetail.orderItemRequestList ? <ForSales orderDetail={orderDetail} clientInfo={clientInfo} checkboxes={params} getReceiver={getReceiver} />:<ForDetail orderDetail={orderDetail} />
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
          <Text style={styles.textStyle7}>{quantity}</Text>
          <Text style={styles.textStyle7}>${total.toFixed(2)}</Text>
          <Text style={styles.textStyle7}>${orderDetail.allowance}</Text>
          <Text style={styles.textStyle7}>${orderDetail.shippingFee}</Text>
          <Text style={styles.textStyle7}>${(total + orderDetail.shippingFee - orderDetail.allowance).toFixed(2)}</Text>
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
        <Button onPress={lastPage} mode="contained" style={styles.btnBack} >
          <Text style={[styles.textStyle2,styles.textStyle4]}>返回修改</Text>
        </Button>
        <Button onPress={()=>{submitHandler(2)}} mode="contained" style={styles.btnPrint} >
          <Text style={styles.textStyle2}>列印出貨單</Text>
        </Button>
        <Button onPress={()=>{submitHandler(3)}} mode="contained" style={styles.btnPrintTag} >
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
  textStyle7:{fontSize:28,marginBottom:20},
  productTitle:{backgroundColor:'#BBBBBB',marginLeft:5,height:30, marginBottom:10, borderRadius: 5},
  checkoutWrapper:{flex:1, flexDirection:'row', justifyContent:'space-between', padding:10},
  radioWrapper:{flexDirection:'row', justifyContent:'space-between',alignItems: "center",paddingLeft:10,paddingRight:10},
  radioBtn:{flexDirection:'row',marginRight:55},
  radioTitle:{fontSize:20,alignItems:"center"},
  radioText:{fontSize:17, alignItems: "center", lineHeight: 32},
  radioPriceBtn:{flexDirection:'row',marginTop:15},
  radioPrice:{fontSize:17, alignItems: "center", width:125},
  btnDistributeTag:{alignItems:'center',marginBottom: 5, marginTop:25},
  confirmBtn:{width:'70%',height:60,elevation: 0,borderWidth:1,borderColor:'#e1d7cb',backgroundColor:'#2B81D6'},
  btnWrapper:{flexDirection:'row',justifyContent:'space-between', padding:4},
  btnBack:{flex:0.6,backgroundColor: 'white',height:40,elevation: 0,borderWidth:1,borderColor:'#e1d7cb'},
  btnPrint:{flex:1,backgroundColor: '#8EC82E',height:40,elevation: 0,borderWidth:1,borderColor:'#e1d7cb',marginLeft:1,marginRight:1,minWidth:30},
  btnPrintTag:{flex:1,backgroundColor: '#8EC82E',height:40,elevation: 0,borderWidth:1,borderColor:'#e1d7cb',minWidth: 30},

})

export default SalesDetail
