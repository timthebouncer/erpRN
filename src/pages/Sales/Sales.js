import React, {useEffect, useMemo, useRef, useState} from 'react';
import {View, ScrollView, Text, StyleSheet, TextInput} from 'react-native';
import {List,RadioButton, Button} from 'react-native-paper';
import service from '../../apis/check';
import SelectedVal from './components/SelectClassValue';
import SelectedCustomer from './components/SelectCustomerValue';
import ReceiverInfo from './components/receiverInfo';
import NewCustomer from './NewCustomer/NewCustomer';
import { debounce } from "lodash";
import {useContextSelector} from 'use-context-selector';
import {dialogContext} from '../../components/Dialog/Dialog';
import ProductSalesModal from '../../components/Modal/ProductSalesModal';
import {formatPrice} from '../../util/formatPrice';
import {SwipeRow} from'react-native-swipe-list-view'
import Counter from '../../components/Counter/Counter';
import {orderListContext} from '../../store/orderListProvider';
import {Icon} from 'react-native-material-ui';
import { Dimensions } from 'react-native'
import {snackBarContext} from '../../components/SnackBar/SnackBar';
import EditRemark from './components/editRemark';

const Sales=({navigation})=>{
  const[searchName, setSearchName] = useState('')
  const[classList, setClassList] = useState([])
  const[customerList, setCustomerList] = useState([])
  const[checkedClassId, setCheckedClassId] = useState('')
  const[checkedCustomer, setCheckedCustomer] = useState('')
  const[receiveInfo, setReceiveInfo] = useState({})
  const[checkedReceiver, setCheckedReceiver] = useState(null)
  const[originalData, setOriginalData] = useState([])
  const[expandedId, setExpandedId] = useState('1');
  const newCustomerData = useRef(null)
  const newReceiverData = useRef(null)
  const[newCustomer, setNewCustomer] = useState(()=>{return {name:"",tel:"",postCode:"",address:"",classesId:'',defaultReceiveInfo:0}})
  const[newReceiver, setNewReceiver] = useState(()=>{return {classesId:"",clientId:"",defaultReceiveInfo:0,recipientList:{id: "", receiver: "", tel: "", postCode: "", address: ""}} })
  const[productSales, setProductSales] = useState({})
  const[orderItemResponseList, setOrderItem] = useState([])
  const currentOrderItemRef = useRef(null)
  const [discountVal, setDiscountVal] = useState(0)
  const[receiveList, setReceiveList] = useState(()=>{return [{id:1,receiver:'同客戶資料'},{id:2,receiver:'同公司資料'}]})
  const [readyToGo, setReadyToGo] = useState(false);
  const inputRef = useRef(null)
  const swipeRef = useRef(null)
  const showModal  = useContextSelector(dialogContext,e=>e.showModal)
  const show  = useContextSelector(snackBarContext,e=>e.show)
  const [setOrderList, getReceiver]  = useContextSelector(orderListContext,e=>[e.setOrderList])

  const onSave = async () => {
    if(currentOrderItemRef.current === null)return
    await setOrderItem(e => [...e, currentOrderItemRef.current])
    setReadyToGo(true)
    currentOrderItemRef.current = null
  }
  const canCelHandler=()=>{
    currentOrderItemRef.current = null
  }
  const onChangeModalValue=(i,type)=>value=>{
    if(type === 'quantity'){
      setOrderItem(e => {
        const e2 = e.slice()
        e2[i].quantity = value
        return e2
      })
    }else {
      setOrderItem(e => {
        const e2 = e.slice()
        e2[i].remark = value
        return e2
      })
    }
  }
  const onConfirm=(type)=>{
    if(newCustomerData.current !== null && type === 'customer'){
      newCustomerData.current.classesId = checkedClassId

      if(!newCustomerData.current.name) return
      service.Customer.add(newCustomerData.current)
        .then(()=>{
          show('新增客戶成功','success')
          service.Customer.getClientList(checkedClassId)
            .then(res=>{
              setCustomerList(res.data)
              setOriginalData(res.data)
              newCustomerData.current = null
            })
            .catch(err=>{
              console.log(err);
            })
        })

    }else if(newReceiverData.current !== null && type === 'receiver'){
      newReceiverData.current.classesId = checkedClassId
      newReceiverData.current.clientId = checkedCustomer
      newReceiverData.current.defaultReceiveInfo = checkedReceiver

      if(!newReceiverData.current.name) return
      service.Customer.update(newReceiverData.current)
        .then(res=>{
          console.log(res);
          newReceiverData.current = null
        })
    }
  }

  useEffect(() => {
    newCustomerData.current = newCustomer
    newReceiverData.current = newReceiver
  }, [newCustomer,newReceiver])


  const {quantity, total} = useMemo(() => {
    const result = { quantity: 0, total: 0 }
    orderItemResponseList.forEach((e) => {
      result.quantity += e.quantity
      result.total += ['公斤','公克','台斤'].includes(e.unit) ? e.dealPrice * e.weight : e.dealPrice * e.quantity
    })
    return result
  }, [orderItemResponseList])

  const newCustomerOrReceiver = (type) =>{
    showModal({ type, onOk:()=>onConfirm(type), content: () => <View>
        {
          <
            NewCustomer  setNewCustomer={setNewCustomer} setNewReceiver={setNewReceiver} type={type}
          />
        }
      </View>})
  }

  const addProductSales=(type,productSales)=>{
    showModal({ type, onOk:()=>onSave(),onCancel:()=>canCelHandler(), content: () => <View>
        {
          <
            ProductSalesModal itemRef={currentOrderItemRef}  productSales={productSales}
          />
        }
      </View>})
  }

  const handleChange=async (id,type)=>{
    if(type === "class"){
      await setCheckedClassId(id)
      await setCheckedReceiver(null)
      await setCheckedCustomer('')
      await setReceiveInfo({})
      await setReceiveList([{id:0,receiver:'同客戶資料'},{id:1,receiver:'同公司資料'}])
      setExpandedId('2')
      service.Customer.getClientList(id)
        .then(res=>{
          setCustomerList(res.data)
          setOriginalData(res.data)
        })
        .catch(err=>{
          console.log(err);
        })
    }else if(type === "customer"){
      await setReceiveList([{id:0,receiver:'同客戶資料'},{id:1,receiver:'同公司資料'}])
      await setCheckedCustomer(id)
      //被選中的人
      let customerInfo = await customerList.find(item=>item.id === id)
      await setReceiveInfo(customerInfo)
      //預設收件ID
      await setCheckedReceiver(customerInfo.defaultReceiveInfo)
      await setReceiveList(prev=>[...prev,...customerInfo.recipientList])
      setExpandedId(0)
    }else if(type === "receiver"){
      await setCheckedReceiver(id)
      setExpandedId(0)
    }
  }

  const searchHandler =()=>{
    if(!searchName){
      setCustomerList(originalData)
    }else {
      let newData = customerList.filter(item=>item.name.includes(searchName))
      setCustomerList(newData)
    }
  }

  const onChangeList=(e)=>{
    setExpandedId(e)
  }

  const scanBarcode = debounce((text) =>{
    service.Commodity.getProductSalesByCode({barcodes: [text],clientId:checkedCustomer})
      .then(res=>{
        if(res.status !== 200 || res.data.length === 0) return
        setProductSales(res.data)
        addProductSales('sales',res.data)
        inputRef.current.clear()
      })
      .catch(err=>{
        console.log(err);
      })
  },500);

  const openEditRemark =(type,item,index)=>{
    showModal({type,onOk:()=>editRemark(),content: () => <View><EditRemark item={item} setRemark={onChangeModalValue(index,'remark')} /></View>})
  }
  const editRemark=()=>{
    swipeRef.current.combinedOnPress()
  }

  const deleteProduct = (index) =>{
    let newOrderList = [...orderItemResponseList]
    newOrderList.splice(index, 1)
    setOrderItem(newOrderList)
  }

  const nextStep = () => {
    let newData = []
    orderItemResponseList.forEach(item=>{
      newData.push({
        amount: item.quantity,
        barcode: item.barcode,
        clientPrice: item.clientPrice ? item.clientPrice.toFixed(2) : item.dealPrice.toFixed(2),
        depotId: item.depotId,
        discount: parseInt(discountVal),
        price: item.price.toFixed(2),
        weight: item.weight,
        unit: item.unit,
        remark: item.remark ? item.remark:'',
      })
    })

    setOrderList(e=>({...e,clientId:checkedCustomer,
      recipientId:checkedReceiver===0?"0":checkedReceiver===1?"1":getReceiver.id,
      allowance:parseInt(discountVal),
      totalPrice:(total- Number(discountVal)).toFixed(2),
      defaultReceiveInfo:checkedReceiver,
      orderItemRequestList:newData}))
    navigation.navigate('SalesShipment');
  }

  useEffect(()=>{
    service.Customer.getClass()
      .then(res=>{
        setClassList(res.data)
      })
      .catch(err=>{
        console.log(err);
      })
  },[])
  let deviceWidth = Dimensions.get('window').width

  return <ScrollView style={{backgroundColor: '#FFF0E9', width:deviceWidth}}>
    <List.AccordionGroup expandedId={expandedId} onAccordionPress={(e)=>onChangeList(e)} >
      <Text style={styles.productTitle}>客戶資訊</Text>
      <List.Accordion style={styles.firstPart} title="客戶類別:" id="1"
                      titleStyle={styles.accordion}
                      descriptionStyle={{color:'red',position:'relative', left:'30%',top:-21}}
                      description={<SelectedVal classList={classList} checkedClassId={checkedClassId} />}
      >
        {
          classList && classList.map(item=>{
            return(
                <View style={styles.radioWrapper}  key={item.id}>
                  <RadioButton value={item.id}
                               color={'#1976D2'}
                               status={ checkedClassId === item.id ? 'checked' : 'unchecked' }
                               onPress={() => handleChange(item.id,"class")}
                  />
                  <Text style={styles.textStyle}>{item.className}</Text>
                </View>
            )
          })
        }
      </List.Accordion>
      <List.Accordion style={styles.secondPart} title="客戶資料" id="2"
                      titleStyle={styles.accordion}
                      descriptionStyle={{color:'red',position:'relative', left:'30%',top:-21}}
                      description={<SelectedCustomer customerList={customerList} checkedCustomer={checkedCustomer} />}
      >
        <View style={{backgroundColor:'white'}}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(e)=>setSearchName(e)}
            />
            <Button style={styles.searchBtn}  mode="contained" onPress={searchHandler}>
              <Icon name={'search'} />
            </Button>
          </View>
          {
            customerList && customerList.map(item=>{
              return(
                <View style={styles.radioWrapper}  key={item.id}>
                  <RadioButton value={item.id}
                               color={'#1976D2'}
                               status={ checkedCustomer === item.id ? 'checked' : 'unchecked' }
                               onPress={() => handleChange(item.id,"customer")}
                  />
                  <Text style={styles.textStyle}>{item.name}</Text>
                </View>
              )
            })
          }
          <View style={styles.newCustomerOrReceiver}>
            {
              checkedClassId ? (<Button onPress={()=>newCustomerOrReceiver('customer')}><Text style={styles.textStyle4}>+新增客戶資料</Text></Button>):
                (<Button><Text style={styles.textStyle2}>+新增客戶資料</Text></Button>)
            }

          </View>
        </View>
      </List.Accordion>
      <View style={{backgroundColor:'white'}}>
        <List.Accordion style={styles.thirdPart} title="收件資料" id="3"
                        titleStyle={styles.accordion2}
                        descriptionStyle={{position:'relative', left:'30%',top:-21}}
                        description={<ReceiverInfo receiveInfo={receiveInfo} checkedReceiver={checkedReceiver} />}
        >
          {
            receiveList.map((item,idx)=>{
              return(
                <View style={styles.radioWrapper}  key={item.id}>
                  <RadioButton value={item.id}
                               color={'#1976D2'}
                               status={ checkedReceiver === idx? 'checked' : 'unchecked' }
                               onPress={() => handleChange(idx,"receiver")}
                  />
                  <Text style={styles.textStyle}>{item.receiver}</Text>
                </View>
              )
            })
          }
          <View style={styles.newCustomerOrReceiver}>
              {
                checkedCustomer ? (<Button onPress={()=>newCustomerOrReceiver('receiver')}><Text style={styles.textStyle4}>+新增收件資料</Text></Button>):
                  (<Button><Text style={styles.textStyle2}>+新增收件資料</Text></Button>)
              }
          </View>
        </List.Accordion>
      </View>
    </List.AccordionGroup>
    <View>
      <Text style={styles.productTitle}>輸入商品</Text>
      <View style={styles.productInput}>
        <Text style={{fontSize:18, lineHeight: 40}}>商品條碼</Text>
        <TextInput ref={inputRef} onChangeText={scanBarcode} style={styles.inputStyle2}  placeholder={'可掃條碼 或 手動輸入'} />
      </View>
    </View>
    <View>
      <Text style={styles.productTitle}>商品資料</Text>
      {
        orderItemResponseList.length > 0 && orderItemResponseList.map((item,index)=>{
          return(
              <SwipeRow ref={swipeRef} style={{marginTop:-10}} leftOpenValue={150} rightOpenValue={-130} key={item?.depotId} >
                <View style={styles.standaloneRowBack}>
                  <View style={styles.leftDelete}>
                    <Button onPress={()=>openEditRemark('remark',item,index)}><Text style={styles.backTextWhite}>編輯備註</Text></Button>
                  </View>
                  <View style={styles.rightDelete}>
                    <Button onPress={()=>deleteProduct(index)}><Text style={styles.backTextWhite}>刪除</Text></Button>
                  </View>
                </View>
                <View style={styles.productContent}>
                <View style={styles.contentLeft}>
                  <Text style={styles.textStyle6}>{item?.barcode}</Text>
                  <Text style={styles.textStyle6}>{item?.alias}</Text>
                  <Text style={styles.textStyle6}>{item?.unit}</Text>
                  <Text style={styles.textStyle6}>建議售價:{item?.price}</Text>
                  <Text style={styles.textStyle6}>備註{item?.remark}</Text>
                </View>
                <View style={styles.contentRight}>
                  <Text style={styles.textStyle6}>數量</Text>
                  {
                    ['公斤','公克','台斤'].includes(item?.unit) ? (
                      <Text style={styles.textStyle6}>{item?.weight}</Text>
                    ):(
                      <Counter quantity={item.quantity} setQuantity={onChangeModalValue(index,'quantity')} />
                      // <Text style={styles.textStyle6}>{item?.quantity}</Text>
                    )
                  }
                  <Text style={styles.textStyle6}>單價${formatPrice(item.dealPrice)}</Text>
                  <Text style={styles.textStyle6}>小計
                    {
                      ['公斤','公克','台斤'].includes(item?.unit) ? (
                        <Text>
                          ${formatPrice((item.dealPrice*item.weight).toFixed(2))}
                        </Text>
                      ):(
                        <Text>
                          ${formatPrice((item.dealPrice*item.quantity).toFixed(2))}
                        </Text>
                      )
                    }
                  </Text>
                </View>
            </View>
              </SwipeRow>
          )
        })
      }
      {
        orderItemResponseList.length ? (
          <View>
            <View style={styles.checkoutWrapper}>
              <View>
                <Text style={styles.textStyle5}>總包數</Text>
                <Text style={styles.textStyle5}>合計</Text>
                <Text style={styles.textStyle5}>折讓</Text>
                <Text style={styles.textStyle5}>總計</Text>
              </View>
              <View>
                <Text style={styles.textStyle5}>{quantity}</Text>
                <Text style={styles.textStyle5}>${total.toFixed(2)}</Text>
                <View style={styles.discountWrapper}>
                  <TextInput style={styles.makeInput2}
                             value={String(discountVal)}
                             keyboardType='numeric'
                             onChangeText={(e)=>setDiscountVal(e)}
                  />
                </View>

                <Text style={styles.textStyle5}>${(total- Number(discountVal)).toFixed(2)}</Text>
              </View>
            </View>

          </View>
          ): <View style={styles.scanWarning}>
          <Text style={styles.textStyle3}>+請掃條碼添加商品</Text>
        </View>
      }
      <View style={{alignItems:'center',padding:10}}>
        <Button style={readyToGo? styles.confirmBtn:styles.notReadyBtn} disabled={!readyToGo} mode="contained" onPress={nextStep}><Text style={styles.textStyle7}>下一步 > 輸入出貨資料</Text></Button>
      </View>
    </View>
  </ScrollView>
}

const styles=StyleSheet.create({

  firstPart:{height:75,justifyContent:'center',backgroundColor: 'white',paddingTop: 10},
  secondPart:{height:75,justifyContent:'center',backgroundColor: 'white',paddingTop: 10},
  thirdPart:{height:200,justifyContent:'center',backgroundColor: 'white'},

  standaloneRowBack: {
    alignItems: 'center',
    backgroundColor: '#8BC645',
    flex: 0.94,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    width:400,
    marginLeft: 5,
    borderRadius:10,

  },
  leftDelete:{
    height:250,
    width:130,
    textAlign:'center',
    justifyContent:'center',
    alignItems: 'center',
    marginRight:0,
    marginTop:0,
    borderRadius:10
  },
  rightDelete:{
    backgroundColor:'red',
    height:253,
    width:140,
    textAlign:'center',
    justifyContent:'center',
    alignItems: 'center',
    marginRight:-15,
    marginTop:0,
    borderRadius:10
  },
  backTextWhite: {
    fontSize:19,
    color: '#FFF',
  },
  accordion:{fontSize:18,marginTop:20,color:'black'},
  accordion2:{fontSize:18,marginTop:-50,color:'black'},

  radioWrapper:{flexDirection:'row',padding:10,backgroundColor: 'white'},
  textStyle:{fontSize:18, lineHeight:33,marginLeft:30},
  textStyle2:{fontSize:26,color:'#BDBDBD'},
  textStyle3:{fontSize:40,color:'#aea9a9'},
  textStyle4:{fontSize:26,color:'black'},
  textStyle5:{fontSize:28,marginBottom:20},
  textStyle6:{fontSize:18,marginBottom:20},
  textStyle7:{fontSize:18,lineHeight:25},
  productTitle:{backgroundColor:'#BBBBBB',height:30, marginBottom:10, borderRadius: 5,fontSize:19},
  productInput:{flexDirection:'row',justifyContent:'space-around',marginTop:15,marginBottom:25},
  productContent:{flex:1, flexDirection:'row', justifyContent:'space-between', padding:15, backgroundColor:'white',height:255,width:400,marginLeft: 5,
    marginTop:0,marginBottom:13,borderRadius:10,shadowColor: "#000",shadowOffset: { width: 0, height: 5,}, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 10,
  },
  checkoutWrapper:{flex:1, flexDirection:'row', justifyContent:'space-between', padding:10},

  inputWrapper:{marginTop:10, marginLeft: 19,backgroundColor: 'white',width: '90%',height:65,
    borderColor: 'white',
    borderRadius:5,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row'
  },
  inputStyle:{
    marginTop:12,
    marginLeft:15,
    marginRight:15,
    height: 40,
    width:'70%',
    borderColor: 'purple',
    borderRadius:5,
    borderWidth: 3,
  },
  inputStyle2:{backgroundColor: 'white',height: 40,
    width:230,marginRight: 20},
  searchBtn:{height:40,marginTop: 12,backgroundColor:'white'},
  newCustomerOrReceiver:{marginTop:30,marginBottom:30},
  input:{
    height: 50,
    width:250,
    borderColor: 'white',
    borderWidth: 1,
    backgroundColor:'white',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scanWarning:{alignItems:'center',marginBottom:15},
  confirmBtn:{backgroundColor: '#0e77c1',width:"95%",height:45,elevation: 0,borderWidth:1,borderColor:'#e1d7cb'},
  notReadyBtn:{width:"95%",height:45,elevation: 0,borderWidth:1,borderColor:'#e1d7cb'},
  makeInput2: {
    height: 45,
    width: 100,
    borderColor: 'black',
    borderWidth: 1,
    backgroundColor: 'transparent',
    borderRadius: 5,
    fontSize:20,
    textAlign:'center',
    alignItems:'center',
  },
  discountWrapper:{marginBottom:15}
})

export default Sales
