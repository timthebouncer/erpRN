import React,{useState,useEffect} from 'react'
import {StyleSheet, View, SafeAreaView, FlatList, Dimensions,ScrollView} from 'react-native';
import {Text, DataTable} from 'react-native-paper';
import { Icon,Button } from 'react-native-material-ui';
import DateButton from '../../components/DateButton/DateButton';
import service from '../../apis/check';
import moment from 'moment';


let differentDate = [
  moment()
    .startOf("day"),
  moment().endOf("day")
];
let formatStart = "YYYY-MM-DD 00:00:00";
let formatEnd = "YYYY-MM-DD 23:59:59";



const RestoreLog=({navigation})=>{
  const[restoreLogData, setRestoreLogData]=useState([])
  const[nodata, setNodata]=useState(false)
  const [postData,setPostData]=useState(()=>{return {
    searchKey: "",
    action: "STOCK_EDIT",
    startDate:(differentDate[0].format(formatStart)),
    endDate:(differentDate[1].format(formatEnd)),
    pageNumber: 1,
    pageSize: 15,
    mark: '+'
  }})


  const br=(target)=>{
    let [b, a]= target.split("T")
    return <View>
      <Text>{b}</Text>
      <Text>{a}</Text>
    </View>
  }

  const fetchMore=async ()=>{
    const newPostData = {...postData,pageNumber:postData.pageNumber+1}
    setPostData(newPostData)
    setTimeout(()=>{
      // if(!nodata){
        service.Inventory.getInventoryLogList(newPostData)
          .then(res=>{
            const {content} = res.data
            if(content.length>0){
              setRestoreLogData(restoreLogData=>[...restoreLogData,...content])
              setNodata(false)
            }else {
              console.log('nodata');
              setNodata(true)
            }
          })
      // }
    },500)
  }


  useEffect(()=>{
    console.log('進畫面');
    service.Inventory.getInventoryLogList(postData)
      .then(res=>{
        const {content} = res.data
        setRestoreLogData(content)
      })
      .catch(err=>{
        console.log(err.response);
      })
  },[navigation])

  let deviceWidth = Dimensions.get('window').width
  return (
    <View style={{backgroundColor:'#FFF0E9',width:deviceWidth}}>
      <View style={{marginBottom: 50}}>
        <DateButton data={{setRestoreLogData,postData,setPostData}} />
      </View>
      <View style={styles.titleText}><Text style={{fontSize:18}}>入庫商品資料</Text></View>
        <DataTable style={styles.tableWrapper}>
          <DataTable.Header>
            <View style={styles.itemTitle}>
              <DataTable.Title style={styles.dateHeader}><Text style={styles.itemText}>日期</Text></DataTable.Title>
              <DataTable.Title style={styles.nameHeader}><Text style={styles.itemText}>商品名稱</Text></DataTable.Title>
              <DataTable.Title numeric><Text style={styles.itemText}>數量</Text></DataTable.Title>
            </View>
          </DataTable.Header>
          {
            restoreLogData.length ? (
              <SafeAreaView>
                <FlatList
                  data={restoreLogData}
                  onEndReached={fetchMore}
                  keyExtractor={item=>item.id}
                  renderItem={({item})=>(
                    <DataTable.Row>
                      <View style={styles.contentWrapper}>
                        <DataTable.Cell style={styles.dateContent}>{br(item.updateDate)}</DataTable.Cell>
                        <DataTable.Cell style={styles.nameContent}>{item.productName}</DataTable.Cell>
                        <DataTable.Cell numeric>{item.amount}</DataTable.Cell>
                      </View>
                    </DataTable.Row>
                  )}
                >
                </FlatList>
            </SafeAreaView>
            ):(
              <View style={styles.noData}>
                <Text style={{fontSize:40}}>尚無資料</Text>
              </View>
            )
          }
        </DataTable>
    </View>
  )
}



const styles = StyleSheet.create({
  titleText:{marginTop:20, marginBottom:5},
  tableWrapper:{width: '100%',backgroundColor:'white'},
  contentWrapper:{flexDirection:'row', width:'100%'},
  itemTitle:{flexDirection:'row',width:'100%',backgroundColor:'white'},
  itemText:{fontSize:15},
  dateHeader:{justifyContent:'center'},
  dateContent:{justifyContent:'center',marginLeft:-35,marginRight:-25},
  nameHeader:{justifyContent:'center'},
  nameContent:{marginRight:-140},
  noData:{position:'absolute',marginTop:'30%',marginLeft:'30%'}
});



export default RestoreLog
