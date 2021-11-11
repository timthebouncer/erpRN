import React,{useState,useEffect} from 'react'
import {StyleSheet, View,SafeAreaView, FlatList} from 'react-native';
import {Text, DataTable} from 'react-native-paper';
import { Icon,Button } from 'react-native-material-ui';
import DateButton from '../../components/DateButton/DateButton';
import service from '../../apis/check';

const CancelRestoreLog=()=>{
  const[restoreLogData, setRestoreLogData]=useState([])
  const[nodata, setNodata]=useState(false)
  const [postData,setPostData]=useState(()=>{return {
    searchKey: "",
    action: "STOCK_EDIT",
    startDate:"",
    endDate:"",
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
    console.log(newPostData);
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
        console.log(err,9999);
      })
  },[])



  return (
    <View style={styles.container}>
      <DateButton data={{setRestoreLogData,postData,setPostData}} />
      <View style={styles.titleText}><Text style={{fontSize:18}}>取消入庫商品資料</Text></View>
      <DataTable style={styles.contentWrapper}>
        <DataTable.Header style={styles.itemTitle}>
          <View style={styles.itemWrapper}>
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
                  <DataTable.Row style={styles.itemTitle}>
                    <View style={styles.itemWrapper}>
                      <DataTable.Cell style={styles.dateContent}>{br(item.updateDate)}</DataTable.Cell>
                      <DataTable.Cell style={styles.nameContent}>{item.productName}</DataTable.Cell>
                      <DataTable.Cell numeric style={{margin:7}}>{item.amount}</DataTable.Cell>
                    </View>
                  </DataTable.Row>
                )}
              >
              </FlatList>
            </SafeAreaView>
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
  nameContent:{justifyContent:'center',margin:7,marginRight:-30}
});



export default CancelRestoreLog
