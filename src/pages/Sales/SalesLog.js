import React,{useState,useEffect} from 'react'
import {StyleSheet, View, SafeAreaView, FlatList, TouchableOpacity} from 'react-native';
import {Text, DataTable} from 'react-native-paper';
import DateButton from '../../components/DateButton/DateButton';
import service from '../../apis/check';
import moment from 'moment';
import { SwipeListView } from 'react-native-swipe-list-view';
import Basic from '../../components/swipe/swipe';
import Test from '../../components/test';


let differentDate = [
  moment()
    .startOf("day"),
  moment().endOf("day")
];
let formatStart = "YYYY-MM-DD 00:00:00";
let formatEnd = "YYYY-MM-DD 23:59:59";



const SalesLog=({navigation})=>{
  const[salesLogData, setSalesLogData]=useState([])
  const [postData,setPostData]=useState(()=>{return {
    orderNo:'',
    startDate:'',
    endDate:'',
    pageNumber: 1,
    pageSize: 15
  }})


  // const fetchMore=async ()=>{
  //   const newPostData = {...postData,pageNumber:postData.pageNumber+1}
  //   setPostData(newPostData)
  //   setTimeout(()=>{
  //     // if(!nodata){
  //     service.Distribute.getDistributeList(newPostData)
  //       .then(res=>{
  //         const {content} = res.data
  //         if(content.length>0){
  //           setSalesLogData(salesLogData=>[...salesLogData,...content])
  //           setNodata(false)
  //         }else {
  //           console.log('nodata');
  //           setNodata(true)
  //         }
  //       })
  //     // }
  //   },500)
  // }

  useEffect(()=>{
    console.log('進畫面');

    service.Distribute.getDistributeList(postData)
      .then(res=>{
        console.log(res);
        const {content} = res.data
        setSalesLogData(content)
      })
      .catch(err=>{
        console.log(err.response);
      })
  },[])


  return (
    <View style={styles.container}>
      <DateButton data={{setSalesLogData,postData,setPostData}} />
      <View style={styles.titleText}><Text style={{fontSize:18}}>出貨資料</Text></View>
      <DataTable style={styles.contentWrapper}>
        <DataTable.Header style={styles.itemTitle}>
          <View style={styles.itemWrapper}>
            <DataTable.Title style={styles.dateHeader}><Text style={styles.itemText}>單號</Text></DataTable.Title>
            <DataTable.Title style={styles.nameHeader}><Text style={styles.itemText}>客戶名稱</Text></DataTable.Title>
            <DataTable.Title numeric><Text style={styles.itemText}>收件人</Text></DataTable.Title>
            <DataTable.Title numeric><Text style={styles.itemText}>總金額</Text></DataTable.Title>
          </View>
        </DataTable.Header>
        {
          salesLogData.length ? (
            <Basic data={salesLogData} setSalesLogData={setSalesLogData} navigation={navigation} />
            // <Test />
          ):(
            <View style={{position:'absolute',marginTop:'30%',marginLeft:'30%'}}>
              <Text style={{fontSize:40}}>尚無資料</Text>
            </View>
          )
        }
      </DataTable>
    </View>
  )
}



const styles = StyleSheet.create({
  container: {
    backgroundColor:'#FFF0E9',flex:1
  },
  dateBtn:{
    flex:0.1, flexDirection:'row', justifyContent:'space-between'
  },
  titleText:{flex:0.1,marginBottom:-30},
  contentWrapper:{flex:0.8},
  itemTitle:{backgroundColor:'white'},
  itemText:{fontSize:15},
  itemWrapper:{flex:1, flexDirection:'row'},
  dateHeader:{justifyContent:'center'},
  dateContent:{justifyContent:'center',margin:7},
  nameHeader:{width:100,justifyContent:'center',marginRight:-30},
  nameContent:{justifyContent:'center',margin:7,marginRight:0},
  recipientName:{justifyContent:'center',margin:7,marginRight:-20},
});



export default SalesLog
// <SafeAreaView>
// <FlatList
// data={salesLogData}
// onEndReached={fetchMore}
// keyExtractor={item=>item.orderId}
// renderItem={({item})=>(
//   <DataTable.Row style={styles.itemTitle}>
//     <View style={styles.itemWrapper}>
//       <DataTable.Cell style={styles.dateContent}>{br(item.orderNo)}</DataTable.Cell>
//       <DataTable.Cell style={styles.nameContent}>{item.clientName}</DataTable.Cell>
//       <DataTable.Cell style={styles.recipientName}>{item.recipientName}</DataTable.Cell>
//       <DataTable.Cell numeric style={{margin:7}}>{item.totalPrice}</DataTable.Cell>
//     </View>
//   </DataTable.Row>
// )}
// >
// </FlatList>
// </SafeAreaView>
