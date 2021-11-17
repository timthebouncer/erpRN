import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View,Text} from 'react-native';
// import {Button} from 'react-native-material-ui';
import service from '../../apis/check';
import moment from 'moment';
import { Button } from 'react-native-paper';


let differentDate = [
  moment()
    .startOf("day"),
  moment().endOf("day")
];



const DateButton=({data})=>{
  const{setRestoreLogData,postData,setPostData}=data
  const[isActive,setActive] = useState('')

  useEffect(()=>{
    setActive('今天')
  },[])

  const changDate=(e)=>{
    let startDate, endDate
    let formatStart = "YYYY-MM-DD 00:00:00";
    let formatEnd = "YYYY-MM-DD 23:59:59";
    setActive(e)
    switch (e) {
      case '今天':
        differentDate = [moment().startOf("day"), moment().endOf("day")]
        startDate = (differentDate[0].format(formatStart))
        endDate = (differentDate[1].format(formatEnd))
        break;
      case '本周':
        differentDate = [moment().isoWeekday(1).startOf("day"),moment().isoWeekday(7).startOf("day")];
        startDate = (differentDate[0].format(formatStart))
        endDate = (differentDate[1].format(formatEnd))
        break;
      case '本月':
        differentDate = [
          moment()
            .date(1)
            .startOf("day"),
          moment().endOf("month")
        ];
        startDate = (differentDate[0].format(formatStart))
        endDate = (differentDate[1].format(formatEnd))
        break;
      case '上個月':
        differentDate = [
          moment()
            .month(moment().month() - 1)
            .date(1)
            .startOf("day"),
          moment()
            .month(moment().month() - 1)
            .endOf("month")
        ];
        startDate = (differentDate[0].format(formatStart))
        endDate = (differentDate[1].format(formatEnd))
        break;
      case '全部':
        startDate = ("")
        endDate = ("")
        break;
    }
    const request = {...postData, startDate, endDate, pageNumber: 1}
    setPostData(request)
    getRestoreLog(request)
  }

  const getRestoreLog=(request)=>{
    service.Inventory.getInventoryLogList(request)
      .then(res=>{
        setRestoreLogData(res.data.content)
      })
  }


  return(
    <View style={styles.dateBtn} >
      <Button style={isActive === '今天' ? styles.btnStyle2:styles.btnStyle} mode="contained" onPress={()=>changDate('今天')}>
        <Text style={[styles.makeLineHeight]}>今天</Text>
      </Button>
      <Button style={isActive === '本周' ? styles.btnStyle2:styles.btnStyle} mode="contained" onPress={()=>changDate('本周')}>
        <Text style={[styles.makeLineHeight]}>本周</Text>
      </Button>
      <Button style={isActive === '本月' ? styles.btnStyle2:styles.btnStyle} mode="contained" onPress={()=>changDate('本月')}>
        <Text style={[styles.makeLineHeight]}>本月</Text>
      </Button>
      <Button style={isActive === '上個月' ? styles.btnStyle4:styles.btnStyle3} mode="contained" onPress={()=>changDate('上個月')}>
        <Text style={[styles.makeLineHeight]}>上個月</Text>
      </Button>
      <Button style={isActive === '全部' ? styles.btnStyle2:styles.btnStyle} mode="contained" onPress={()=>changDate('全部')}>
        <Text style={[styles.makeLineHeight]}>全部</Text>
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  dateBtn:{
    flex:0.1, flexDirection:'row', justifyContent:'space-between',paddingLeft:5,paddingRight:5
  },
  btnStyle:{
    height:45,
    backgroundColor:'white',
    width:60
  },
  btnStyle2:{
    height:45,
    backgroundColor:'burlywood',
    width:60
  },
  btnStyle3:{
    height:45,
    backgroundColor:'white',
    width:80
  },
  btnStyle4:{
    height:45,
    backgroundColor:'burlywood',
    width:80
  },
  makeLineHeight:{lineHeight:25,fontSize:14,color:'black'}
});

export default DateButton
// burlywood
