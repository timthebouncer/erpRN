import React, {useEffect, useMemo, useRef, useState} from 'react';
import {View, ScrollView, Text, StyleSheet, TextInput} from 'react-native';
import {List, RadioButton, Button} from 'react-native-paper';
import service from '../../apis/check';
import SelectedVal from './components/SelectClassValue';
import SelectedCustomer from './components/SelectCustomerValue';
import ReceiverInfo from './components/receiverInfo';
import NewCustomer from './NewCustomer/NewCustomer';
import {debounce} from 'lodash';
import {useContextSelector} from 'use-context-selector';
import {dialogContext} from '../../components/Dialog/Dialog';
import ProductSalesModal from '../../components/Modal/ProductSalesModal';
import {formatPrice} from '../../util/formatPrice';
import {SwipeListView, SwipeRow} from 'react-native-swipe-list-view';
import Counter from '../../components/Counter/Counter';
import {orderListContext} from '../../store/orderListProvider';
import {Icon} from 'react-native-material-ui';
import {Dimensions} from 'react-native';
import {snackBarContext} from '../../components/SnackBar/SnackBar';
import EditRemark from './components/editRemark';
import {formatData} from './components/formatData';
import {spinContext} from '../../components/spinner/spin';
import {toTopContext} from '../../components/scrollTopBtn/toTop';

const Sales = ({navigation, route}) => {
  const [searchName, setSearchName] = useState('');
  const [classList, setClassList] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [checkedClassId, setCheckedClassId] = useState('');
  const [checkedCustomer, setCheckedCustomer] = useState('');
  const [receiveInfo, setReceiveInfo] = useState({});
  const [checkedReceiver, setCheckedReceiver] = useState(null);
  const [originalData, setOriginalData] = useState([]);
  const [expanded, setExpanded] = useState(true);
  const [expanded2, setExpanded2] = useState(false);
  const [expanded3, setExpanded3] = useState(false);
  const newCustomerData = useRef(null);
  const newReceiverData = useRef(null);
  const [newCustomer, setNewCustomer] = useState(() => {
    return {name: '', tel: '', postCode: '', address: '', classesId: '', defaultReceiveInfo: 0};
  });
  const [newReceiver, setNewReceiver] = useState(() => {
    return {
      classesId: '',
      clientId: '',
      defaultReceiveInfo: 0,
      recipientList: [{id: '', receiver: '', tel: '', postCode: '', address: ''}],
    };
  });
  const [orderItemResponseList, setOrderItem] = useState([]);
  const currentOrderItemRef = useRef(null);
  const [discountVal, setDiscountVal] = useState(0);
  const [receiveList, setReceiveList] = useState(() => {
    return [{id: 1, receiver: '同客戶資料'}, {id: 2, receiver: '同公司資料'}];
  });
  const [readyToGo, setReadyToGo] = useState(false);
  const [Offset, setOffset] = useState(0);
  const inputRef = useRef(null);
  const swipeRef = useRef(null);
  const scrollRef = useRef(null);
  const showModal = useContextSelector(dialogContext, e => e.showModal);
  const show = useContextSelector(snackBarContext, e => e.show);
  const showLoading = useContextSelector(spinContext, e => e.showLoading);

  const setScrollParam = useContextSelector(toTopContext, e => e.setScrollParam);
  const setOffsetParam = useContextSelector(toTopContext, e => e.setOffsetParam);

  const [setOrderList, getReceiver, editOrderDetail] = useContextSelector(orderListContext, e => [e.setOrderList, e.getReceiver, e.editOrderDetail, e.orderList]);

  const onSave = async () => {
    if (currentOrderItemRef.current === null) {
      return;
    }

    let arrLength = orderItemResponseList.length;


    if (arrLength) {
      let arr = [...orderItemResponseList];
      for (let i = 0; i < arrLength; i++) {
        if (arr[i].barcode === currentOrderItemRef.current.barcode) {
          arr[i].quantity += currentOrderItemRef.current.quantity;
          arr[i].weight += currentOrderItemRef.current.weight;
        } else {
          arr.push(currentOrderItemRef.current);
        }
      }
      setOrderItem(arr);
    } else {
      setOrderItem([currentOrderItemRef.current]);
    }

    setReadyToGo(true);
    currentOrderItemRef.current = null;
  };
  const canCelHandler = () => {
    currentOrderItemRef.current = null;
  };
  const onChangeModalValue = (i, type) => value => {
    if (type === 'quantity') {
      setOrderItem(e => {
        const e2 = e.slice();
        e2[i].quantity = value;
        return e2;
      });
    } else {
      setOrderItem(e => {
        const e2 = e.slice();
        e2[i].remark = value;
        return e2;
      });
    }
  };
  const onConfirm = (type) => {
    if (newCustomerData.current !== null && type === 'customer') {
      newCustomerData.current.classesId = checkedClassId;

      if (!newCustomerData.current.name) {
        return;
      }
      service.Customer.add(newCustomerData.current)
        .then(() => {
          show('新增客戶成功', 'success');
          service.Customer.getClientList(checkedClassId)
            .then(res => {
              setCustomerList(res.data);
              setOriginalData(res.data);
              newCustomerData.current = null;
            })
            .catch(err => {
              console.log(err);
            });
        });

    } else if (newReceiverData.current !== null && type === 'receiver') {

      if (!newReceiverData.current.recipientList[0].receiver) {
        return;
      }

      let length = newReceiverData.current.recipientList.length;
      newReceiverData.current.classesId = checkedClassId;
      newReceiverData.current.clientId = checkedCustomer;
      newReceiverData.current.defaultReceiveInfo = parseInt(length) + 1;

      service.Customer.update(newReceiverData.current)
        .then(res => {
          console.log(res);
          if (res.status === 200) {
            show(res.data, 'success');
            newReceiverData.current = null;
          }
        });
    }
  };

  useEffect(() => {

    newCustomerData.current = newCustomer;
    newReceiverData.current = newReceiver;
  }, [newCustomer, newReceiver]);


  const {quantity, total} = useMemo(() => {
    const result = {quantity: 0, total: 0, amount: 0};
    if (orderItemResponseList) {
      orderItemResponseList.forEach((e) => {
        result.quantity += e.quantity ? e.quantity : e.amount;
        result.total += ['公斤', '公克', '台斤'].includes(e.unit) ? e.clientPrice ? e.clientPrice * e.weight.toFixed(3) : e.dealPrice * e.weight.toFixed(3) :
          e.clientPrice ? e.clientPrice * (e.quantity ? e.quantity : e.amount) : e.dealPrice * (e.quantity ? e.quantity : e.amount);
      });
      return result;
    }
  }, [orderItemResponseList]);

  const newCustomerOrReceiver = (type) => {
    showModal({
      type, onOk: () => onConfirm(type), content: () => <View>
        {
          <
            NewCustomer setNewCustomer={setNewCustomer} setNewReceiver={setNewReceiver} type={type}
                        receiveInfo={receiveInfo} checkedClassId={checkedClassId}
                        checkedCustomer={checkedCustomer}
          />
        }
      </View>,
    });
  };

  const addProductSales = (type, productSales) => {
    showModal({
      type, onOk: () => onSave(), onCancel: () => canCelHandler(), content: () => <View>
        {
          <
            ProductSalesModal itemRef={currentOrderItemRef} productSales={productSales}
          />
        }
      </View>,
    });
  };

  const handleChange = async (id, type) => {
    if (type === 'class') {
      await setCheckedClassId(id);
      await setCheckedReceiver(null);
      await setCheckedCustomer('');
      await setReceiveInfo({});
      await setReceiveList([{id: 0, receiver: '同客戶資料'}, {id: 1, receiver: '同公司資料'}]);
      await setExpanded(false);
      await setExpanded2(true);
    } else if (type === 'customer') {
      await setReceiveList([{id: 0, receiver: '同客戶資料'}, {id: 1, receiver: '同公司資料'}]);
      await setCheckedCustomer(id);
      //被選中的人
      let customerInfo = await customerList.find(item => item.id === id);
      await setReceiveInfo(customerInfo);
      //預設收件ID
      await setCheckedReceiver(customerInfo.defaultReceiveInfo);
      await setReceiveList(prev => [...prev, ...customerInfo.recipientList]);
      await setExpanded2(false);
    } else if (type === 'receiver') {
      await setCheckedReceiver(id);
      await setExpanded3(false);
    }
  };

  const searchHandler = () => {
    if (!searchName) {
      setCustomerList(originalData);
    } else {
      let newData = customerList.filter(item => {
        if (!item.name) {
          return '';
        } else {
          return item.name.includes(searchName);
        }
      });
      setCustomerList(newData);
    }
  };

  const handleExpanded = (type) => {
    switch (type) {
      case 1:
        setExpanded(!expanded);
        break;
      case 2:
        setExpanded2(!expanded2);
        break;
      case 3:
        setExpanded3(!expanded3);
        break;
    }
  };

  const scanBarcode = debounce((text) => {
    service.Commodity.getProductSalesByCode({barcodes: [text], clientId: checkedCustomer})
      .then(res => {
        if (res.data.length === 0 && res.status === 200) {
          show('已無庫存，請重新選擇', 'error');
        } else if (res.data.length > 0 && res.status === 200) {
          addProductSales('sales', res.data);
          inputRef.current.clear();
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, 500);

  const openEditRemark = (type, item, index) => {
    showModal({
      type,
      onOk: () => editRemark(),
      content: () => <View><EditRemark item={item} setRemark={onChangeModalValue(index, 'remark')}/></View>,
    });
  };
  const editRemark = () => {
    swipeRef.current.combinedOnPress();
  };

  const deleteProduct = (index,id) => {
    let newOrderList = [...orderItemResponseList];
    if(editOrderDetail){
      service.Distribute.deleteCommodityDiscount(id)
        .then(res=>{
          show(res.data,'success')
        })
      newOrderList.splice(index, 1);
      setOrderItem(newOrderList);
    }else {
      newOrderList.splice(index, 1);
      setOrderItem(newOrderList);
    }
  };

  const clientList = (id) => {
    service.Customer.getClientList(id)
      .then(res => {
        setCustomerList(res.data);
        setOriginalData(res.data);
        setCheckedCustomer(editOrderDetail.clientId);
        pushReceiverList(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const pushReceiverList = (customerList) => {
    let customerInfo = customerList.find(item => item.id === editOrderDetail.clientId);
    setReceiveInfo(customerInfo);
    setCheckedReceiver(customerInfo.defaultReceiveInfo);
    setReceiveList(prev => [...prev, ...customerInfo.recipientList]);
    setOrderItem(editOrderDetail.orderDetailItemResponseList);
    setDiscountVal(editOrderDetail.allowance)
  };

  const nextStep = () => {

    let newData = [];
    orderItemResponseList.forEach(item => {
      newData.push({
        id:item.id || '',
        alias: item.alias ? item.alias : item.productName,
        amount: item.quantity ? item.quantity : item.amount,
        barcode: item.barcode,
        clientPrice: item.clientPrice ? Number(item.clientPrice).toFixed(2) : Number(item.dealPrice).toFixed(2),
        depotId: item.depotId,
        discount: Number(discountVal),
        price: item.price.toFixed(2),
        weight: item.weight,
        unit: item.unit,
        remark: item.remark ? item.remark : '',
      });
    });


    setOrderList(e => ({
      ...e, clientId: checkedCustomer,
      recipientId: checkedReceiver === 0 ? '0' : checkedReceiver === 1 ? '1' : getReceiver.id,
      allowance: Number(discountVal),
      totalPrice: total.toFixed(2),
      defaultReceiveInfo: checkedReceiver,
      orderItemRequestList: newData,
    }));
    navigation.navigate('SalesShipment', {orderId: route?.params?.orderId || '', isEdit: route?.params?.orderId || false});
  };


  const fetchClass = () => {
    showLoading(true)
    // setLoading(true);
    service.Customer.getClass()
      .then(res => {
        setClassList(res.data);
        showLoading(false)
        // setLoading(false);
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(fetchClass, []);

  useEffect(() => {
    if (!checkedClassId && !checkedCustomer) {
      return;
    }
    clientList(checkedClassId);
  }, [checkedClassId]);

  useEffect(() => {
    if (!route.params) {
      return;
    }
    setCheckedClassId(editOrderDetail.classId);
    clientList(editOrderDetail.classId);
    setReadyToGo(true);
  }, [route]);

  let deviceWidth = Dimensions.get('window').width;


  const setFloatIcon=(e)=>{
    // setOffset(e.nativeEvent.contentSize.height-530-e.nativeEvent.contentOffset.y)
    setOffsetParam(e.nativeEvent.contentSize.height-530-e.nativeEvent.contentOffset.y)
    setScrollParam(scrollRef.current)
  }

  return <ScrollView style={{backgroundColor: '#FFF0E9', width: deviceWidth}} ref={scrollRef} onScroll={e=>setFloatIcon(e)}>
    <List.Accordion
      onPress={() => handleExpanded(1)}
      expanded={expanded}
      style={styles.firstPart} title="客戶類別:"
      titleStyle={styles.accordion}
      descriptionStyle={styles.desStyle}
      description={<SelectedVal classList={classList} checkedClassId={checkedClassId}/>}
    >
      {
        classList && classList.map(item => {
          return (
            <View style={styles.radioWrapper} key={item.id}>
              <RadioButton.Item label={item.className} status={checkedClassId === item.id ? 'checked' : 'unchecked'}
                                color={'#1976D2'}
                                style={styles.w70}
                                labelStyle={styles.labelStyle}
                                value={item.id} position={'leading'} onPress={() => handleChange(item.id, 'class')}/>
            </View>
          );
        })
      }
    </List.Accordion>
    <List.Accordion style={styles.secondPart} title="客戶資料"
                    onPress={() => handleExpanded(2)}
                    expanded={expanded2}
                    titleStyle={styles.accordion}
                    descriptionStyle={styles.desStyle}
                    description={<SelectedCustomer customerList={customerList} checkedCustomer={checkedCustomer}/>}
    >
      <View style={styles.bgWhite}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.inputStyle}
            onChangeText={(e) => setSearchName(e)}
          />
          <Button style={styles.searchBtn} mode="contained" onPress={searchHandler}>
            <Icon name={'search'}/>
          </Button>
        </View>
        {
          customerList && customerList.map(item => {
            return (
              <View style={styles.radioWrapper} key={item.id}>
                <RadioButton.Item label={formatData('customer', item)}
                                  status={checkedCustomer === item.id ? 'checked' : 'unchecked'} color={'#1976D2'}
                                  style={styles.w70}
                                  labelStyle={styles.labelStyle}
                                  value={item.id} position={'leading'}
                                  onPress={() => handleChange(item.id, 'customer')}/>
              </View>
            );
          })
        }
        <View style={styles.newCustomerOrReceiver}>
          {
            checkedClassId ? (<Button onPress={() => newCustomerOrReceiver('customer')}><Text
                style={styles.textStyle4}>+新增客戶資料</Text></Button>) :
              (<Button><Text style={styles.textStyle2}>+新增客戶資料</Text></Button>)
          }

        </View>
      </View>
    </List.Accordion>
    <View style={styles.bgWhite}>
      <List.Accordion style={styles.thirdPart} title="收件資料"
                      onPress={() => handleExpanded(3)}
                      expanded={expanded3}
                      titleStyle={styles.accordion2}
                      descriptionStyle={styles.desStyle2}
                      description={<ReceiverInfo receiveInfo={receiveInfo} checkedReceiver={checkedReceiver}/>}
      >
        {
          receiveList.map((item, idx) => {
            return (
              <View style={styles.radioWrapper} key={item.id}>
                <RadioButton.Item label={formatData('receiver', item)}
                                  status={checkedReceiver === idx ? 'checked' : 'unchecked'} color={'#1976D2'}
                                  style={{width: '90%'}}
                                  labelStyle={styles.labelStyle2}
                                  value={item.id} position={'leading'} onPress={() => handleChange(idx, 'receiver')}/>
              </View>
            );
          })
        }
        <View style={styles.newCustomerOrReceiver}>
          {
            checkedCustomer ? (<Button onPress={() => newCustomerOrReceiver('receiver')}><Text
                style={styles.textStyle4}>+新增收件資料</Text></Button>) :
              (<Button><Text style={styles.textStyle2}>+新增收件資料</Text></Button>)
          }
        </View>
      </List.Accordion>
    </View>
    <View>
      <Text style={styles.productTitle}>輸入商品</Text>
      <View style={styles.productInput}>
        <Text style={styles.barCode}>商品條碼</Text>
        <TextInput ref={inputRef} onChangeText={scanBarcode} style={styles.inputStyle2} placeholder={'可掃條碼 或 手動輸入'}/>
      </View>
    </View>
    <View>
      <Text style={styles.productTitle}>商品資料</Text>
      {
        orderItemResponseList.length > 0 && orderItemResponseList.map((item, index) => {
          return (
            <SwipeRow ref={swipeRef} style={{marginTop: -10}} leftOpenValue={150} rightOpenValue={-130} key={index}
                      stopLeftSwipe={150} stopRightSwipe={-130}>
              <View style={styles.standaloneRowBack}>
                <View style={styles.leftDelete}>
                  <Button onPress={() => openEditRemark('remark', item, index)}><Text
                    style={styles.backTextWhite}>編輯備註</Text></Button>
                </View>
                <View style={styles.rightDelete}>
                  <Button onPress={() => deleteProduct(index,item.id)}><Text style={styles.backTextWhite}>刪除</Text></Button>
                </View>
              </View>
              <View style={styles.productContent}>
                <View style={styles.contentLeft}>
                  <Text style={styles.textStyle6}>{item?.barcode}</Text>
                  <Text style={styles.textStyle6}>{item.alias ? item.alias : item.productName}</Text>
                  <Text style={styles.textStyle6}>{item?.unit}</Text>
                  <Text style={styles.textStyle6}>建議售價:{item?.price}</Text>
                  <Text style={styles.textStyle6}>備註{item?.remark}</Text>
                </View>
                <View style={styles.contentRight}>
                  <Text style={styles.textStyle6}>數量</Text>
                  {
                    ['公斤', '公克', '台斤'].includes(item?.unit) ? (
                      <Text style={[styles.textStyle6]}>{item?.weight}</Text>
                    ) : (
                      <Counter quantity={item.quantity || item.amount} setQuantity={onChangeModalValue(index, 'quantity')}/>
                    )
                  }
                  <View style={styles.makeRow}>
                    <Text style={[styles.textStyle6, styles.marginRight15, styles.marginTop3]}>單價$</Text>
                    <TextInput style={styles.makeInput3}
                               value={String(item.clientPrice ? item.clientPrice : item.dealPrice)}
                               keyboardType='numeric'
                               onChangeText={(e) => setOrderItem(f => {
                                 const f2 = f.slice();
                                 item.clientPrice ? f2[index].clientPrice = e : f2[index].dealPrice = e;
                                 return f2;
                               })}
                    />
                  </View>
                  <Text style={styles.textStyle6}>小計
                    {
                      ['公斤', '公克', '台斤'].includes(item?.unit) ? (
                        <Text>
                          ${formatPrice((item.clientPrice ? (item.clientPrice * item.weight).toFixed(3) : (item.dealPrice * item.weight).toFixed(3)))}
                        </Text>
                      ) : (
                        item.clientPrice ? (
                          <Text>
                            ${formatPrice((item.clientPrice * (item.quantity ? item.quantity : item.amount)).toFixed(2))}
                          </Text>
                        ) : (
                          <Text>
                            ${formatPrice((item.dealPrice * (item.quantity ? item.quantity : item.amount)).toFixed(2))}
                          </Text>
                        )
                      )
                    }
                  </Text>
                </View>
              </View>
            </SwipeRow>
          );
        })
      }
      {
        orderItemResponseList.length ?
          (
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
                    <Text style={{fontSize: 28}}>$</Text>
                    <TextInput style={styles.makeInput2}
                               value={String(discountVal)}
                               keyboardType='numeric'
                               onChangeText={(e) => setDiscountVal(e)}
                    />
                  </View>

                  <Text style={styles.textStyle5}>${(total - Number(discountVal)).toFixed(2)}</Text>
                </View>
              </View>

            </View>
          ) : <View style={styles.scanWarning}>
            <Text style={styles.textStyle3}>+請掃條碼添加商品</Text>
          </View>
      }
      <View style={{alignItems: 'center', padding: 10}}>
        <Button style={readyToGo ? styles.confirmBtn : styles.notReadyBtn} disabled={!readyToGo} mode="contained"
                onPress={nextStep}><Text style={styles.textStyle7}>下一步 > 輸入出貨資料</Text></Button>
      </View>
    </View>
    {/*<ToTop scrollRef={scrollRef} Offset={Offset} />*/}
  </ScrollView>;
};

const styles = StyleSheet.create({

  firstPart: {height: 75, justifyContent: 'center', backgroundColor: 'white', paddingTop: 10},
  secondPart: {height: 75, justifyContent: 'center', backgroundColor: 'white', paddingTop: 10},
  thirdPart: {height: 200, justifyContent: 'center', backgroundColor: 'white'},
  bgWhite:{backgroundColor: 'white'},
  makeRow: {flexDirection: 'row', marginTop: 15},
  marginRight15: {marginRight: 15},
  marginTop3: {marginTop: 3},
  desStyle:{color: 'red', position: 'relative', left: '30%', top: -21},
  desStyle2:{position: 'relative', left: '30%', top: -21},
  labelStyle:{textAlign: 'left', paddingLeft: 10, fontSize: 20},
  labelStyle2:{textAlign: 'left', paddingLeft: 10, paddingRight: 10, fontSize: 18, width: '100%'},
  standaloneRowBack: {
    alignItems: 'center',
    flex: 0.94,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    width: '97%',
    marginLeft: 0,
    borderRadius: 10,

  },
  leftDelete: {
    backgroundColor: '#8BC645',
    height: 250,
    width: '45%',
    textAlign: 'left',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 0,
    marginTop: 0,
    borderRadius: 10,
  },
  rightDelete: {
    backgroundColor: 'red',
    height: 253,
    width: '40%',
    marginRight: -15,
    justifyContent: 'center',
    marginTop: 0,
    borderRadius: 10,
  },
  backTextWhite: {
    fontSize: 19,
    color: 'white',
  },
  accordion: {fontSize: 18, marginTop: 20, color: 'black'},
  accordion2: {fontSize: 18, marginTop: -50, color: 'black'},

  radioWrapper: {padding: 10, backgroundColor: 'white', width: '100%'},
  textStyle: {fontSize: 18, lineHeight: 33, marginLeft: 30},
  textStyle2: {fontSize: 26, color: '#BDBDBD'},
  textStyle3: {fontSize: 40, color: '#aea9a9'},
  textStyle4: {fontSize: 26, color: 'black'},
  textStyle5: {fontSize: 28, marginBottom: 20},
  textStyle6: {fontSize: 18, marginBottom: 20},
  textStyle7: {fontSize: 18, lineHeight: 25},
  width100: {width: 200},
  width50: {width: 85},
  lineHeight50: {alignItems: 'center'},
  productTitle: {backgroundColor: '#BBBBBB', height: 30, marginBottom: 10, borderRadius: 5, fontSize: 19},
  productInput: {flexDirection: 'row', justifyContent: 'space-around', marginTop: 15, marginBottom: 25},
  barCode:{fontSize: 18, lineHeight: 40},
  productContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: 'white',
    height: 255,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 13,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },
  checkoutWrapper: {flex: 1, flexDirection: 'row', justifyContent: 'space-between', padding: 10},

  inputWrapper: {
    marginTop: 10, marginLeft: 19, backgroundColor: 'white', width: '90%', height: 65,
    borderColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
  },
  inputStyle: {
    marginTop: 12,
    marginLeft: 15,
    marginRight: 15,
    height: 40,
    width: '70%',
    borderColor: 'purple',
    borderRadius: 5,
    borderWidth: 3,
  },
  inputStyle2: {
    backgroundColor: 'white', height: 40,
    width: 230, marginRight: 20,
  },
  searchBtn: {height: 40, marginTop: 12, backgroundColor: 'white'},
  newCustomerOrReceiver: {marginTop: 30, marginBottom: 30},
  input: {
    height: 50,
    width: 250,
    borderColor: 'white',
    borderWidth: 1,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scanWarning: {alignItems: 'center', marginBottom: 15},
  confirmBtn: {
    backgroundColor: '#0e77c1',
    width: '95%',
    height: 45,
    elevation: 0,
    borderWidth: 1,
    borderColor: '#e1d7cb',
  },
  notReadyBtn: {width: '95%', height: 45, elevation: 0, borderWidth: 1, borderColor: '#e1d7cb'},
  makeInput2: {
    height: 45,
    width: 100,
    borderColor: 'black',
    borderWidth: 1,
    backgroundColor: 'transparent',
    borderRadius: 5,
    fontSize: 20,
    textAlign: 'center',
    alignItems: 'center',
    paddingTop: 0,
    paddingBottom: 0,
  },
  makeInput3: {
    height: 33,
    width: '45%',
    borderColor: 'black',
    borderWidth: 1,
    backgroundColor: 'transparent',
    borderRadius: 5,
    fontSize: 20,
    textAlign: 'center',
    alignItems: 'center',
    paddingTop: 0,
    paddingBottom: 0,
  },
  discountWrapper: {marginBottom: 15, flexDirection: 'row'},
  w70:{width: '70%'}
});

export default Sales;
