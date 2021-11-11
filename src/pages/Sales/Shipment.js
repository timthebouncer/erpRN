import React, {useEffect, useState} from 'react';
import {ScrollView, View, Text, StyleSheet, TextInput} from 'react-native';
import {Button, RadioButton} from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import CheckBox from '@react-native-community/checkbox';
import service from '../../apis/check';
import {shippingRule} from '../../components/shippingFee';
import {Icon} from 'react-native-material-ui';
import {useContextSelector} from 'use-context-selector';
import {orderListContext} from '../../store/orderListProvider';


const SalesShipment = ({navigation}) => {
  const [orderListDetail, setOrderListDetail] = useState({});
  const [shippingFee, setShippingFee] = useState(0);
  const [paymentValue, setPaymentValue] = React.useState(1);
  const [shipmentValue, setShipmentValue] = React.useState(1);
  const [temperature, setTemperature] = React.useState(1);
  const [volume, setVolume] = React.useState(1);
  const [show, setShow] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [orderList, setOrderList]  = useContextSelector(orderListContext,e=>[e.orderList, e.setOrderList])
  const [checkboxes, setCheckboxes] = useState([{
    id: 1,
    title: '雞肉',
    checked: true,
  }, {
    id: 2,
    title: '雞蛋',
    checked: false,
  }, {
    id: 3,
    title: '蔬菜',
    checked: false,
  },
  ]);

  const calculateShipment=()=>{

  }

  const showCalendar = () => {
    console.log(1);
    setShow(true);
  };

  const hideDatePicker = () => {
    setShow(false);
  };

  const handleConfirm = (date) => {
    setSelectedDay(moment(date).format('YYYY-MM-DD'));
    setShow(false);
    service.Distribute.getOrderNo({date: moment(date).format('YYYY-MM-DD')})
      .then(res => {
        setOrderListDetail(e => ({...e, orderNo: res.data, stockOutDate: selectedDay}));
      });
  };

  const setSelection = () => {
  };

  const lastStep = () => navigation.goBack();

  const showDetail = async () => {
   await setOrderList(e=>({...e, shipment:shipmentValue,temperatureCategory:temperature,volume:volume}))
    navigation.navigate('SalesDetail');
  }

  // shipment: shipmentValue,temperatureCategory:temperature,volume:volume

  useEffect(() => {
    let value = shippingRule['' + shipmentValue + temperature + volume];
    setShippingFee(value);
  }, [shipmentValue,temperature,volume]);


  return (
    <ScrollView style={{backgroundColor: '#FFF0E9'}}>
      <View><Text style={styles.productTitle}>出貨資料</Text></View>
      <View style={[styles.makeRow, styles.makePadding]}>
        <Text style={styles.makeFontSize}>出貨日期:</Text>
        <Button style={styles.makeCalendar} labelStyle={{fontSize: 25,color:'black'}} onPress={showCalendar} icon={'calendar'}>
          <View  style={{ width: 40, height: 10 }} />
          <Text style={{marginLeft: 100}}>{selectedDay}</Text>
        </Button>
        {/*  <Button style={styles.makeCalendar} onPress={showCalendar}>*/}
        {/*    <Text style={{fontSize:22}}>2021-11-09</Text>*/}
        {/*    <View style={{ width: 40, height: 30 }} />*/}
        {/*    <Icon name="event" size={27} style={{lineHeight:30}} color="black" />*/}
        {/*    <View style={{ width: 10, height: 10 }} />*/}
        {/*  </Button>*/}
          <DateTimePickerModal
            style={styles.makeDatePicker}
            testID="dateTimePicker"
            value={new Date()}
            mode={'date'}
            isVisible={show}
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
      </View>
      <View style={[styles.makeRow, styles.makePadding]}><Text style={styles.makeFontSize}>出貨單號:</Text>
        <Text style={styles.makeFontSize}>{orderListDetail.orderNo}</Text>
      </View>
      <View style={styles.makeRow}><Text style={styles.productTitle}>付款方式:</Text></View>
      <RadioButton.Group onValueChange={newValue => setPaymentValue(newValue)}
                         value={paymentValue}>
        <View style={[styles.makeRow, styles.makeSpace, styles.makePadding]}>
          <View style={styles.makeRow}>
            <RadioButton color={'#1976D2'} value={1}/>
            <Text style={styles.makeFontSize}>貨到付款</Text>
          </View>
          <View style={styles.makeRow}>
            <RadioButton color={'#1976D2'} value={2}/>
            <Text style={styles.makeFontSize}>匯款</Text>
          </View>
          <View style={styles.makeRow}>
            <RadioButton color={'#1976D2'} value={3}/>
            <Text style={styles.makeFontSize}>現金</Text>
          </View>
        </View>
      </RadioButton.Group>
      <View><Text style={styles.productTitle}>運費資料</Text></View>
      <View style={[styles.makeRow, styles.makeSpace, styles.makePadding, styles.makeWidth2]}>
        <Text style={styles.makeFontSize}>出貨方式:</Text>
        <RadioButton.Group onValueChange={newValue => setShipmentValue(newValue)}
                           value={shipmentValue}>
          <View style={[styles.makeRow]}>
            <View style={styles.makeRow}>
              <RadioButton color={'#1976D2'} value={1}/>
              <Text style={styles.makeFontSize}>親送</Text>
            </View>
            <View style={styles.makeRow}>
              <RadioButton color={'#1976D2'} value={2}/>
              <Text style={styles.makeFontSize}>黑貓宅配</Text>
            </View>
            <View style={styles.makeRow}>
              <RadioButton color={'#1976D2'} value={3}/>
              <Text style={styles.makeFontSize}>自取</Text>
            </View>
          </View>
        </RadioButton.Group>
      </View>
      {
        orderListDetail.shipment === 2 ? (
          <View style={[styles.makeRow, styles.makeSpace, styles.makePadding]}>
            <Text style={styles.makeFontSize}>物流編號:</Text>
            <TextInput style={styles.makeInput}
                       onChangeText={text => setOrderListDetail(e => ({...e, trackingNo: text}))}/>
          </View>
        ) : <></>
      }
      <View style={[styles.makeRow, styles.makeSpace, styles.makePadding, styles.makeWidth2]}><Text
        style={styles.makeFontSize}>溫層類別:</Text>
        <RadioButton.Group onValueChange={newValue => setTemperature(newValue)}
                           value={temperature}>
          <View style={[styles.makeRow]}>
            <View style={[styles.makeRow, styles.makeMRight]}>
              <RadioButton color={'#1976D2'} value={1}/>
              <Text style={styles.makeFontSize}>常溫</Text>
            </View>
            <View style={[styles.makeRow, styles.makeMRight]}>
              <RadioButton color={'#1976D2'} value={2}/>
              <Text style={styles.makeFontSize}>冷藏</Text>
            </View>
            <View style={[styles.makeRow, styles.makeMRight]}>
              <RadioButton color={'#1976D2'} value={3}/>
              <Text style={styles.makeFontSize}>冷凍</Text>
            </View>
          </View>
        </RadioButton.Group>
      </View>
      <View style={[styles.makeRow, styles.makeSpace, styles.makePadding, styles.makeWidth2]}><Text
        style={styles.makeFontSize}>材積單位:</Text>
        <RadioButton.Group onValueChange={newValue => setVolume(newValue)}
                           value={volume}>
          <View style={[styles.makeSpace]}>
            <View style={styles.makeRow}>
              <View style={[styles.makeRow, styles.makeMRight3]}>
                <RadioButton color={'#1976D2'} value={1}/>
                <Text style={styles.makeFontSize}>60公分</Text>
              </View>
              <View style={styles.makeRow}>
                <RadioButton color={'#1976D2'} value={2}/>
                <Text style={styles.makeFontSize}>90公分</Text>
              </View>
            </View>
            <View style={styles.makeRow}>
              <View style={[styles.makeRow, styles.makeMRight2]}>
                <RadioButton color={'#1976D2'} value={3}/>
                <Text style={styles.makeFontSize}>120公分</Text>
              </View>
              {
                orderListDetail.temperatureCategory === 1 ? (
                  <View style={styles.makeRow}>
                    <RadioButton color={'#1976D2'} value={4}/>
                    <Text style={styles.makeFontSize}>150公分</Text>
                  </View>
                ) : <></>
              }
            </View>
          </View>
        </RadioButton.Group>
      </View>
      <View style={[styles.makeRow, styles.makePadding, styles.makeSpace, styles.makeWidth4]}><Text
        style={[styles.makeFontSize2]}>運費金額:</Text>
        <TextInput
          style={styles.makeInput2}
          value={String(shippingFee)}
          keyboardType='numeric'
          onChangeText={text => setShippingFee(text)}
        />
      </View>
      <View style={[styles.makeRow, styles.makeSpace, styles.makePadding]}><Text
        style={styles.makeFontSize}>商品內容:</Text>
        {
          checkboxes.map(item => {
            return (
              <View key={item.id} style={[styles.makeRow, styles.makeSpace]}>
                <CheckBox
                  value={item.checked}
                  onValueChange={setSelection}
                  style={styles.checkbox}
                />
                <Text style={styles.makeFontSize}>{item.title}</Text>
              </View>
            );
          })
        }
      </View>
      <View style={[styles.makeRow, styles.makePadding, styles.makeSpace, styles.makeWidth4]}><Text
        style={styles.makeFontSize2}>件數:</Text>
        <TextInput style={styles.makeInput2}
                   value={String(orderListDetail.piecesAmount)}
                   keyboardType='numeric'
                   onChangeText={text => setOrderListDetail(e => ({...e, piecesAmount: text}))}/>
      </View>
      <View><Text style={styles.productTitle}>備註</Text></View>
      <View style={{alignItems: 'center', marginTop: 10, marginBottom: 10}}><TextInput
        onChangeText={(text) => setOrderListDetail(e => ({...e, remark: text}))} style={styles.makeInput3}/></View>
      <View style={[styles.makeRow, styles.makePadding]}>
        <Button style={styles.confirmBtn} mode={'contained'} onPress={lastStep}><Text>客戶/商品資料 上一步</Text></Button>
        <Button onPress={showDetail}><Text>下一步 > 出貨單</Text></Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  makeRow: {flexDirection: 'row'},
  makePadding: {paddingTop: 20, paddingLeft: 10, paddingRight: 10, paddingBottom: 20},
  productTitle: {
    backgroundColor: '#BBBBBB',
    marginLeft: 5,
    height: 30,
    width: 400,
    marginBottom: 10,
    borderRadius: 5,
    fontSize: 19,
  },
  makeFontSize: {fontSize: 18, lineHeight: 30},
  makeFontSize2: {fontSize: 18, lineHeight: 50, marginRight: 20},
  makeSpace: {justifyContent: 'space-around'},
  makeWidth: {width: 350},
  makeWidth2: {width: 380},
  makeWidth3: {width: 250},
  makeWidth4: {width: 290},
  makeWidth5: {width: 500},
  makeMRight: {marginRight: 10},
  makeMRight2: {marginRight: 40},
  makeMRight3: {marginRight: 50, marginBottom: 15},
  confirmBtn: {
    backgroundColor: '#0e77c1',
    width: 200,
    height: 40,
    elevation: 0,
    borderWidth: 1,
    borderColor: '#e1d7cb',
  },
  makeInput: {
    height: 60,
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
  makeInput2: {
    height: 60,
    width: 150,
    borderColor: 'black',
    borderWidth: 1,
    backgroundColor: 'transparent',
    borderRadius: 5,
  },
  makeInput3: {
    height: 150,
    width: 300,
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
  makeCalendar:{
    height: 60,
    width: 240,
    borderColor: 'black',
    borderWidth: 1,
    backgroundColor: 'transparent',
    borderRadius: 5,marginLeft:50,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  makeDatePicker:{}
});

export default SalesShipment;

// <RadioButton value={1}
// color={'#1976D2'}
// status={ 1Checked === 2 ? 'checked' : 'unchecked' }
// onPress={() => setFirstChecked(2)}
// />
// <RadioButton value={2}
//              color={'#1976D2'}
// status={ firstChecked === 2 ? 'checked' : 'unchecked' }
// onPress={() => setFirstChecked(2)}
// />
// <RadioButton value={3}
//              color={'#1976D2'}
// status={ firstChecked === 2 ? 'checked' : 'unchecked' }
// onPress={() => setFirstChecked(2)}
// />
