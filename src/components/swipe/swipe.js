import React, {useState} from 'react';
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
import {useContextSelector} from 'use-context-selector';
import {snackBarContext} from '../SnackBar/SnackBar';


const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

export default function Basic({data,setSalesLogData,navigation}) {
  const {showModal} = useContextSelector(dialogContext,e=>e)
  const {show} = useContextSelector(snackBarContext,e=>e)
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const closeRow = (rowMap,rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const printTag=(rowMap,rowKey,orderId)=>{
    service.Distribute.tagPrint({deliveryOrderId:orderId})
      .then(()=>{
        show('列印貼箱標籤成功','success')
        closeRow(rowMap,rowKey)
      })
  }

  const deleteInfo = (rowMap, rowKey,orderId) => {
    let dialogParams={title:'deleteRow',id:orderId}
    showModal({onOk:()=>dialogParams,content: () => <View><Text style={styles.textStyle}>取消訂單將無法復原</Text></View>})
    const newData = [...data];
    newData.filter(item=>item.remark === '註銷')
    // const prevIndex = data.findIndex(item => item.orderId === rowKey);
    // newData.splice(prevIndex, 1);
    setSalesLogData(newData);
    closeRow(rowMap, rowKey);
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

  const renderItem = ({item},rowMap) => (
    <TouchableHighlight
      onPress={()=>enterDetail(item,rowMap)}
    >
      <DataTable.Row style={styles.itemTitle}>
        <View style={styles.itemWrapper}>
          <DataTable.Cell style={styles.dateContent}>{br(item.orderNo)}</DataTable.Cell>
          <DataTable.Cell style={styles.nameContent}>{item.clientName}</DataTable.Cell>
          <DataTable.Cell style={styles.recipientName}>{item.recipientName}</DataTable.Cell>
          <DataTable.Cell numeric style={styles.m7}>${item.totalPrice.toFixed(2)}</DataTable.Cell>
        </View>
      </DataTable.Row>
    </TouchableHighlight>
  );

  const renderHiddenItem = (rowData, rowMap) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={styles.leftBtn}
        onPress={() => printTag(rowMap, rowData.item.key,rowData.item.orderId)}
      >
        <Text style={styles.leftText}>列印貼箱標籤</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => deleteInfo(rowMap, rowData.item.key,rowData.item.orderId)}
      >
        <Text style={styles.backTextWhite}>取消訂單</Text>
      </TouchableOpacity>
    </View>
  );



  return (
    <View style={styles.container}>

      <SwipeListView
        closeOnScroll={true}
        useFlatList={true}
        onEndReached={fetchMore}
        data={data}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        leftOpenValue={130}
        stopLeftSwipe={130}
        rightOpenValue={-100}
        stopRightSwipe={-100}
        previewRowKey={'0'}
        previewOpenDelay={2000}
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
    height: 70
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 70,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
    width: 100
  },
  itemTitle:{backgroundColor:'white',height: 70},
  itemWrapper:{flex:1, flexDirection:'row'},
  dateContent:{justifyContent:'center',margin:7},
  nameContent:{justifyContent:'center',margin:7,marginRight:0},
  recipientName:{justifyContent:'center',margin:7,marginRight:-20},
  textStyle:{fontSize:20},
  m7:{margin:7}
});
