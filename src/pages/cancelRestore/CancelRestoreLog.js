import React,{useState,useEffect} from 'react'
import {StyleSheet, View, SafeAreaView, FlatList, Dimensions} from 'react-native';
import {Text, DataTable} from 'react-native-paper';
import DateButton from '../../components/DateButton/DateButton';
import service from '../../apis/check';
import moment from 'moment';
import {useContextSelector} from 'use-context-selector';
import {spinContext} from '../../components/spinner/spin';


let differentDate = [
  moment()
    .startOf("day"),
  moment().endOf("day")
];
let formatStart = "YYYY-MM-DD 00:00:00";
let formatEnd = "YYYY-MM-DD 23:59:59";

const CancelRestoreLog=({navigation})=>{
  const showLoading = useContextSelector(spinContext, e => e.showLoading);

  const[restoreLogData, setRestoreLogData]=useState([])
  const[nodata, setNodata]=useState(false)
  const [postData,setPostData]=useState(()=>{return {
    searchKey: "",
    action: "STOCK_EDIT",
    startDate:(differentDate[0].format(formatStart)),
    endDate:(differentDate[1].format(formatEnd)),
    pageNumber: 1,
    pageSize: 15,
    mark: '-'
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
    showLoading(true)
    // setTimeout(()=>{
    //   if(!nodata){
      service.Inventory.getInventoryLogList(newPostData)
        .then(res=>{
          showLoading(false)
          const {content} = res.data
          if(content.length>0){
            setRestoreLogData(restoreLogData=>[...restoreLogData,...content])
            // setNodata(false)
          }else {
            console.log('nodata');
          }
        })
      // }
    // },500)
  }


  useEffect(()=>{
    showLoading(true)
    service.Inventory.getInventoryLogList(postData)
      .then(res=>{
        console.log(res.data);

        const {content} = res.data
        setRestoreLogData(content)
        showLoading(false)
      })
      .catch(err=>{
        console.log(err);
      })
  },[navigation])

  let deviceWidth = Dimensions.get('window').width
  let deviceHeight = Dimensions.get('window').height

  return (
    <View style={{backgroundColor:'#FFF0E9',width:deviceWidth}}>
      <View style={styles.mb50}>
      <DateButton data={{setRestoreLogData,postData,setPostData}} />
      </View>
      <View style={styles.titleText}><Text style={styles.text18}>取消入庫商品資料{restoreLogData.length}</Text></View>
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
              <FlatList
                data={restoreLogData}
                style={{height: deviceHeight - 285}}
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
          ):(
            <View style={styles.noData}>
              <Text style={styles.text40}>尚無資料</Text>
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
  noData:{position:'absolute',marginTop:'30%',marginLeft:'30%'},
  mb50:{marginBottom: 50},
  text18:{fontSize:18},
  text40:{fontSize:40}
});



export default CancelRestoreLog
