import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';



const ReceiverInfo=({receiveInfo,checkedReceiver})=>{
  if(!receiveInfo || checkedReceiver==null) return<></>

    let selectedReceiveInfo = {}
    if(checkedReceiver !== 0 && checkedReceiver !== 1){
      selectedReceiveInfo = receiveInfo?.recipientList[checkedReceiver-2]
    }


  if(checkedReceiver === 0){
    return(
      <View>
        {
          (receiveInfo.defaultReceiveInfo === 0) ?<Text style={{color:'black',fontSize:17,marginBottom:25}}>同客戶資料(預設地址)</Text>:<Text style={{color:'black',fontSize:17,marginBottom:25}}>同客戶資料</Text>
        }
        <View style={{flexDirection:'row'}}>
          <Text style={{color:'black',fontSize:17, marginLeft:-90,marginRight:80}}>{receiveInfo?.name}</Text>
          <Text style={{color:'black',fontSize:17,marginBottom:25}}>{receiveInfo?.tel}</Text>
        </View>
        <Text style={{color:'black',fontSize:17, width:300}}>{receiveInfo?.address}</Text>
      </View>
    )
  }else if(checkedReceiver === 1){
    return(
      <View>
        {
          (receiveInfo.defaultReceiveInfo === 1) ?<Text style={{color:'black',fontSize:17,marginBottom:25}}>同公司資料(預設地址)</Text>:<Text style={{color:'black',fontSize:17,marginBottom:25}}>同公司資料</Text>
        }
        <Text style={{color:'black',fontSize:17}}>{receiveInfo?.companyAddress}</Text>
        <Text style={{color:'black',fontSize:17}}>{receiveInfo?.companyTel}</Text>
        <Text style={{color:'black',fontSize:17}}>{receiveInfo?.companyName}</Text>
      </View>
    )
  }else if(checkedReceiver > 1){
    return(
      <View>
        {
          (receiveInfo.defaultReceiveInfo === checkedReceiver) ?<Text style={{color:'black',fontSize:17,marginBottom:25}}>(預設地址)</Text>:<Text style={{marginBottom:25}} />
        }
        <View style={{flexDirection:'row'}}>
          <Text style={{color:'black',fontSize:17, marginLeft:-110,marginRight:80}}>{selectedReceiveInfo?.receiver}</Text>
          <Text style={{color:'black',fontSize:17,marginBottom:25}}>{selectedReceiveInfo?.tel}</Text>
        </View>
        <View style={{flexDirection:'row'}}>
          <Text style={{color:'black',fontSize:17}}>{selectedReceiveInfo?.postCode}</Text>
          <Text style={{color:'black',fontSize:17}}>{selectedReceiveInfo?.address}</Text>
        </View>
      </View>
    )
  }else return <></>

  // const RenderCustomer=()=>{
  //   return(
  //     <View>
  //       {
  //         (receiveInfo.defaultReceiveInfo === 0) || (checkedReceiver === 0) ?<Text style={{color:'black',fontSize:17,marginBottom:25}}>同客戶資料</Text>:<></>
  //       }
  //       <View style={{flexDirection:'row'}}>
  //         <Text style={{color:'black',fontSize:17, marginLeft:-90,marginRight:80}}>{receiveInfo.name}</Text>
  //         <Text style={{color:'black',fontSize:17,marginBottom:25}}>{receiveInfo.tel}</Text>
  //       </View>
  //       <Text style={{color:'black',fontSize:17, width:300}}>{receiveInfo.address}</Text>
  //     </View>
  //   )
  // }

  // const RenderCompany=()=>{
  //   return(
  //     <View>
  //       <Text style={{color:'black',fontSize:17}}>同公司資料</Text>
  //       <Text style={{color:'black',fontSize:17}}>{receiveInfo.companyAddress}</Text>
  //       <Text style={{color:'black',fontSize:17}}>{receiveInfo.companyTel}</Text>
  //       <Text style={{color:'black',fontSize:17}}>{receiveInfo.companyName}</Text>
  //     </View>
  //   )
  // }

  // const RenderCustom=()=>{
  //   return(
  //     <View>
  //       <Text style={{color:'black',fontSize:17}}>11111</Text>
  //       <Text style={{color:'black',fontSize:17}}>22222</Text>
  //       <Text style={{color:'black',fontSize:17}}>33333</Text>
  //     </View>
  //   )
  // }





}

export default ReceiverInfo
