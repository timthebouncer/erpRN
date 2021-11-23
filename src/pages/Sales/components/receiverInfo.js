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
          <Text style={[styles.textStyle,styles.marginLeftNg80,styles.marginRight100,styles.width200]}>{receiveInfo?.name}</Text>
          <Text style={[styles.textStyle,styles.marginBottom25,styles.marginLeftNg50,styles.width100]}>{receiveInfo?.tel}</Text>
        </View>
        <View style={[styles.makeRow]}>
          <Text style={[styles.textStyle,styles.marginLeftNg80,styles.marginRight20]}>{receiveInfo?.postCode}</Text>
          <Text style={[styles.textStyle,styles.width300]}>{receiveInfo?.address}</Text>
        </View>
      </View>
    )
  }else if(checkedReceiver === 1){
    return(
      <View>
        {
          (receiveInfo.defaultReceiveInfo === 1) ?<Text style={[styles.textStyle,styles.marginBottom25,styles.marginLeft60]}>同公司資料(預設地址)</Text>:<Text style={[styles.textStyle,styles.marginBottom25]}>同公司資料</Text>
        }
        <View style={[styles.makeRow]}>
          <Text style={[styles.textStyle,styles.marginLeftNg80,styles.marginRight100,styles.width200]}>{receiveInfo?.companyName}</Text>
          <Text style={[styles.textStyle,styles.marginBottom25,styles.marginLeftNg50,styles.width100]}>{receiveInfo?.companyTel}</Text>
        </View>
        <View style={[styles.makeRow]}>
          <Text style={[styles.textStyle,styles.marginLeftNg80,styles.marginRight20]}>{receiveInfo?.companyPostCode}</Text>
          <Text style={[styles.textStyle,styles.width300]}>{receiveInfo?.companyAddress}</Text>
        </View>
      </View>
    )
  }else if(checkedReceiver > 1){
    return(
      <View>
        {
          (receiveInfo.defaultReceiveInfo === checkedReceiver) ?<Text style={[styles.textStyle,styles.marginBottom25,styles.marginLeft60]}>(預設地址)</Text>:<Text style={styles.marginBottom25} />
        }
        <View style={[styles.makeRow]}>
          <Text style={[styles.textStyle,styles.marginLeftNg80,styles.marginRight100]}>{selectedReceiveInfo?.receiver}</Text>
          <Text style={[styles.textStyle,styles.marginBottom25,styles.marginLeftNg50]}>{selectedReceiveInfo?.tel}</Text>
        </View>
        <View style={[styles.makeRow]}>
          <Text style={[styles.textStyle,styles.marginLeftNg80,styles.marginRight20]}>{selectedReceiveInfo?.postCode}</Text>
          <Text style={[styles.textStyle,styles.width300]}>{selectedReceiveInfo?.address}</Text>
        </View>
      </View>
    )
  }else return <></>

}

const styles=StyleSheet.create({
  textStyle:{color:'black',fontSize:17},
  marginRight100:{marginRight:100},
  marginRight20:{marginRight:20},
  marginBottom25:{marginBottom:25},
  marginLeftNg80:{marginLeft:-80},
  marginLeftNg50:{marginLeft:-30},
  marginLeft60:{marginLeft:60},
  width300:{width:300},
  width200:{width:150},
  width100:{width:100},
  makeRow:{flexDirection:'row'},
  spaceAround:{justifyContent:'space-around'}
})


export default ReceiverInfo
