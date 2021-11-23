import React, {useEffect, useState} from 'react';
import {ScrollView, View, Text, StyleSheet, TextInput, Dimensions} from 'react-native';
import {Button, RadioButton} from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import CheckBox from '@react-native-community/checkbox';
import service from '../../apis/check';
import {shippingRule} from '../../components/shippingFee';
import {useContextSelector} from 'use-context-selector';
import {orderListContext} from '../../store/orderListProvider';
import MaskInput from 'react-native-mask-input';


const SalesShipment = ({navigation}) => {
  const [orderNo, setOrderNo] = useState('');
  const [readyToGo, setReadyToGo] = useState(false);
  const [shippingFee, setShippingFee] = useState(0);
  const [paymentValue, setPaymentValue] = useState(1);
  const [shipmentValue, setShipmentValue] = useState(1);
  const [temperature, setTemperature] = useState(2);
  const [trackingNo, setTrackingNo] = useState('');
  const [volume, setVolume] = useState(1);
  const [piecesAmount, setPiecesAmount] = useState(0);
  const [remark, setRemark] = useState('');
  const [show, setShow] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [setOrderList]  = useContextSelector(orderListContext,e=>[e.setOrderList])
  const [checkboxes, setCheckboxes] = useState([{
    id: 1,
    title: '雞肉',
    checked: false,
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


  const showCalendar = () => {
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
        setOrderNo(res.data);
        setReadyToGo(true)
      });
  };


  const setSelection = (id, index) => {
    const checkboxData = [...checkboxes];
    checkboxData[index].checked = !checkboxData[index].checked;
    setCheckboxes(checkboxData);

  };

  const lastStep = () => navigation.goBack();

  const showDetail = async () => {
   await setOrderList(e=>({...e, payment:paymentValue, shipment:shipmentValue,temperatureCategory:shipmentValue===3?null:temperature,volume:shipmentValue===3?null:volume,
     piecesAmount:piecesAmount,trackingNo:trackingNo,orderNo:orderNo, remark:remark,shippingFee:shippingFee,stockOutDate:selectedDay,
     chicken:checkboxes[0].checked, egg:checkboxes[1].checked,vegetable:checkboxes[2].checked}))
    navigation.navigate('SalesDetail', {params:checkboxes});
  }


  useEffect(() => {
    if(shipmentValue === 3){
      setShippingFee(0);
    }else {
      let value = shippingRule['' + shipmentValue + temperature + volume];
      setShippingFee(value);
    }
  }, [shipmentValue,shipmentValue,temperature,volume]);

  let deviceWidth = Dimensions.get('window').width

  return (
    <ScrollView style={{backgroundColor: '#FFF0E9',width:deviceWidth}}>
      <View><Text style={styles.productTitle}>出貨資料</Text></View>
      <View style={[styles.makeRow, styles.makePadding]}>
        <Text style={styles.makeFontSize}>出貨日期:</Text>
        <Button style={styles.makeCalendar} labelStyle={styles.labelStyle} onPress={showCalendar} icon={'calendar'}>
            <Text style={{lineHeight:30}}>{selectedDay}</Text>
        </Button>
          <DateTimePickerModal
            testID="dateTimePicker"
            value={new Date()}
            mode={'date'}
            isVisible={show}
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
      </View>
      <View style={[styles.makeRow, styles.makePadding]}><Text style={styles.makeFontSize}>出貨單號:</Text>
        <Text style={styles.makeFontSize}>{orderNo}</Text>
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
      <View style={[styles.makeRow, styles.makeSpace, styles.makePadding]}>
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
        shipmentValue === 2 ? (
          <View style={[styles.makeRow, styles.makeSpace, styles.makePadding]}>
            <Text style={styles.makeFontSize}>物流編號:</Text>
            <MaskInput
              style={styles.makeInput}
              value={trackingNo}
              onChangeText={text => setTrackingNo(text)}
              mask={[/\d/,/\d/,/\d/,/\d/,'-',/\d/,/\d/,/\d/,/\d/,'-',/\d/, /\d/,/\d/,/\d/,]}
            />
          </View>
        ) : <></>
      }
      {
        shipmentValue === 3 ? <></>:(
          <View>
            <View style={[styles.makeRow, styles.makeSpace, styles.makePadding]}><Text
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
          <View style={[styles.makeRow, styles.makeSpace, styles.makePadding]}><Text
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
                    temperature === 1 ? (
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
            <View style={[styles.makeRow, styles.makePadding, styles.makeSpace,styles.makeWidth]}><Text
              style={[styles.makeFontSize2]}>運費金額:</Text>
              <TextInput
                style={styles.makeInput2}
                value={String(shippingFee)}
                keyboardType='numeric'
                onChangeText={text => setShippingFee(text)}
              />
            </View>
          </View>
        )
      }
      <View style={[styles.makeRow, styles.makeSpace, styles.makePadding]}><Text
        style={styles.makeFontSize}>商品內容:</Text>
        {
          checkboxes.map((item,index) => {
            return (
              <View key={item.id} style={[styles.makeRow, styles.makeSpace]}>
                <CheckBox
                  value={item.checked}
                  onValueChange={() => setSelection(item.id, index)}
                  style={styles.checkbox}
                />
                <Text style={styles.makeFontSize}>{item.title}</Text>
              </View>
            );
          })
        }
      </View>
      <View style={[styles.makeRow, styles.makePadding, styles.makeSpace, styles.makeWidth]}><Text
        style={styles.makeFontSize2}>件數:</Text>
        <TextInput style={styles.makeInput2}
                   value={String(piecesAmount)}
                   keyboardType='numeric'
                   onChangeText={text => setPiecesAmount(text)}/>
      </View>
      <View><Text style={styles.productTitle}>備註</Text></View>
      <View style={{alignItems: 'center', marginTop: 10, marginBottom: 10}}>
        <TextInput
          multiline
        onChangeText={(text) => setRemark(text)} style={styles.makeInput3}
        />
      </View>
      <View style={[styles.makeRow, styles.makePadding]}>
        <Button style={[styles.confirmBtn,styles.makeMRight10]} mode={'contained'} onPress={lastStep}><Text>客戶/商品資料 上一步</Text></Button>
        <Button style={readyToGo?[styles.confirmBtn]:[styles.makeWidth180]} disabled={!readyToGo} mode={'contained'} onPress={showDetail}><Text>下一步 > 出貨單</Text></Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  makeRow: {flexDirection: 'row'},
  makePadding: {paddingTop: 20, paddingLeft: 10, paddingRight: 10, paddingBottom: 20},
  productTitle: {
    backgroundColor: '#BBBBBB',
    height: 30,
    width: '100%',
    marginBottom: 10,
    borderRadius: 5,
    fontSize: 19,
  },
  makeWidth180:{width:180},
  makeFontSize: {fontSize: 18, lineHeight: 30},
  makeFontSize2: {fontSize: 18, lineHeight: 50, marginRight: 20},
  makeSpace: {justifyContent: 'space-around'},
  makeWidth: {width: 290},
  makeMRight: {marginRight: 10},
  makeMRight2: {marginRight: 40},
  makeMRight3: {marginRight: 50, marginBottom: 15},
  makeMRight10: {marginRight: 10},
  confirmBtn: {
    backgroundColor: '#0e77c1',
    width: 190,
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
    textAlignVertical: 'top',
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
    width:'70%',
    borderColor: 'black',
    borderWidth: 1,
    backgroundColor: 'transparent',
    borderRadius: 5,marginLeft:20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  labelStyle:{fontSize: 25,color:'black',alignItems: "baseline",paddingHorizontal: 30,paddingVertical:5},
  makeInline:{
    paddingHorizontal: 0,
    // flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "baseline"
  },
});

export default SalesShipment;

