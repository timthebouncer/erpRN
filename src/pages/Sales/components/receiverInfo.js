import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useContextSelector} from 'use-context-selector';
import {orderListContext} from '../../../store/orderListProvider';



const ReceiverInfo=({receiveInfo,checkedReceiver})=>{
  const {setGetReceiver}  = useContextSelector(orderListContext,e=>e)
  const [selectedReceiveInfo, setSelectedReceiveInfo] = useState({})

  useEffect(()=>{
    if(checkedReceiver !== 0 && checkedReceiver !== 1 && receiveInfo?.recipientList != null){
      setSelectedReceiveInfo(receiveInfo.recipientList[checkedReceiver-2])
    }else {
      setGetReceiver({})
    }
  }, [receiveInfo, checkedReceiver])

  useEffect(()=>{
    setGetReceiver(selectedReceiveInfo)
  },[selectedReceiveInfo])


  if(!receiveInfo || checkedReceiver==null) return<></>

  if(checkedReceiver === 0){
    return(
      <View>
        {
          (receiveInfo.defaultReceiveInfo === 0) ?<Text style={[styles.textStyle,styles.marginBottom25]}>同客戶資料(預設地址)</Text>:<Text style={[styles.textStyle,styles.marginBottom25]}>同客戶資料</Text>
        }
        <View style={styles.makeRow}>
          <Text style={[styles.textStyle,styles.marginLeftNg100,styles.marginRight80]}>{receiveInfo?.name}</Text>
          <Text style={[styles.textStyle,styles.marginBottom25,styles.marginLeftNg50]}>{receiveInfo?.tel}</Text>
        </View>
        <Text style={[styles.textStyle,styles.width300]}>{receiveInfo?.address}</Text>
      </View>
    )
  }else if(checkedReceiver === 1){
    return(
      <View>
        {
          (receiveInfo.defaultReceiveInfo === 1) ?<Text style={[styles.textStyle,styles.marginBottom25]}>同公司資料(預設地址)</Text>:<Text style={[styles.textStyle,styles.marginBottom25]}>同公司資料</Text>
        }
        <Text style={styles.textStyle}>{receiveInfo?.companyAddress}</Text>
        <Text style={styles.textStyle}>{receiveInfo?.companyTel}</Text>
        <Text style={styles.textStyle}>{receiveInfo?.companyName}</Text>
      </View>
    )
  }else if(checkedReceiver > 1){
    return(
      <View>
        {
          (receiveInfo.defaultReceiveInfo === checkedReceiver) ?<Text style={[styles.textStyle,styles.marginBottom25]}>(預設地址)</Text>:<Text style={styles.marginBottom25} />
        }
        <View style={styles.makeRow}>
          <Text style={[styles.textStyle,styles.marginLeftNg100,styles.marginRight80]}>{selectedReceiveInfo?.receiver}</Text>
          <Text style={[styles.textStyle,styles.marginBottom25,styles.marginLeftNg50]}>{selectedReceiveInfo?.tel}</Text>
        </View>
        <View style={styles.makeRow}>
          <Text style={styles.textStyle}>{selectedReceiveInfo?.postCode}</Text>
          <Text style={styles.textStyle}>{selectedReceiveInfo?.address}</Text>
        </View>
      </View>
    )
  }else return <></>

}

const styles=StyleSheet.create({
  textStyle:{color:'black',fontSize:17},
  marginRight80:{marginRight:80},
  marginBottom25:{marginBottom:25},
  marginLeftNg100:{marginLeft:-100},
  marginLeftNg50:{marginLeft:-30},
  width300:{width:300},
  makeRow:{flexDirection:'row'}
})


export default ReceiverInfo
