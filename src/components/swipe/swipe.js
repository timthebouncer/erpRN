import React, {useContext, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View,
  RefreshControl
} from 'react-native';
import {DataTable} from 'react-native-paper';
import { SwipeListView } from 'react-native-swipe-list-view';
import service from '../../apis/check';
import {dialogContext} from '../Dialog/Dialog';


const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

export default function Basic({data,setSalesLogData,navigation}) {
  const {show} = useContext(dialogContext)
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const printTag=(rowMap,rowKey)=>{
    console.log(rowKey);
    service.Distribute.tagPrint({deliveryOrderId:rowKey})
      .then(res=>{
        console.log(res);
      })
  }

  const deleteRow = (rowMap, rowKey) => {
    let dialogData = {title:'delete',id:rowKey}
    show(
      () => <View><Text style={styles.textStyle}>取消訂單將無法復原</Text></View>,
      () => dialogData,
      () => {}
    )
    //   closeRow(rowMap, rowKey);
    //
    // const newData = [...data];
    // const prevIndex = data.findIndex(item => item.orderId === rowKey);
    // newData.splice(prevIndex, 1);
    // setSalesLogData(newData);
  };


  const fetchMore=()=>{
    console.log(1);
  }

  const br=(target)=>{
    let [b, a]= target.split("A")
    return <View>
      <Text>{b}</Text>
      <Text>{'A'+a}</Text>
    </View>
  }

  const enterDetail=(item)=>{
    navigation.navigate('SalesDetail', {
      orderId: item.orderId,
    })
  }

  const renderItem = ({item}) => (
    <TouchableHighlight
      onPress={()=>enterDetail(item)}
    >
      <DataTable.Row style={styles.itemTitle}>
        <View style={styles.itemWrapper}>
          <DataTable.Cell style={styles.dateContent}>{br(item.orderNo)}</DataTable.Cell>
          <DataTable.Cell style={styles.nameContent}>{item.clientName}</DataTable.Cell>
          <DataTable.Cell style={styles.recipientName}>{item.recipientName}</DataTable.Cell>
          <DataTable.Cell numeric style={{margin:7}}>${item.totalPrice}</DataTable.Cell>
        </View>
      </DataTable.Row>
    </TouchableHighlight>
  );

  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={styles.leftBtn}
        onPress={() => printTag(rowMap, data.item.orderId)}
      >
        <Text style={styles.leftText}>列印貼箱標籤</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => deleteRow(rowMap, data.item.orderId)}
      >
        <Text style={styles.backTextWhite}>取消訂單</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>

      <SwipeListView
        useFlatList={true}
        onEndReached={fetchMore}
        data={data}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        leftOpenValue={130}
        rightOpenValue={-100}
        previewRowKey={'0'}
        previewOpenValue={-40}
        previewOpenDelay={3000}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  leftText:{
    color: '#FFF',
    fontSize:18
  },
  backTextWhite: {
    color: '#FFF',
    fontSize:18
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 0,
  },
  leftBtn:{
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
    width: 130,
    height: 50
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
    width: 100
  },
  itemTitle:{backgroundColor:'white'},
  itemWrapper:{flex:1, flexDirection:'row'},
  dateContent:{justifyContent:'center',margin:7},
  nameContent:{justifyContent:'center',margin:7,marginRight:0},
  recipientName:{justifyContent:'center',margin:7,marginRight:-20},
  textStyle:{fontSize:20},
});
