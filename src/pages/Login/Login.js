import React, {useEffect, useState} from 'react';
import {Icon} from 'react-native-material-ui';
import {Text, View, StyleSheet} from 'react-native';
import { Button,TextInput } from 'react-native-paper';
import service from '../../apis/check'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {useContextSelector} from 'use-context-selector';
import {snackBarContext} from '../../components/SnackBar/SnackBar';


const Login = ({ navigation }) => {

  const {show} = useContextSelector(snackBarContext,e=>e)

  const[userLogin, setUserLogin] = useState({username:'',password:''})


    const handleChange = (key, e) => {
      setUserLogin({ ...userLogin, [key]: e});
    };

  const onsubmit =async ()=>{
    let formData = new FormData()
    formData.append('username',userLogin.username)
    formData.append('password',userLogin.password)
   await service.Login.userLogin(formData)
      .then(res=>{
        if (res.status === 200) {
          navigation.navigate('Sales')
          AsyncStorage.setItem("token", JSON.stringify(res.data.code));
          AsyncStorage.setItem("checkUser", JSON.stringify(res.data.user));
          // this.loading = false;
          show(res.data.msg,'success')
        }
      })
     .catch(err => {
       if (err.response.data.msg) {
         show(err.response.data.msg,'error')
         // this.loading = false;
       }
     });
  }

  return (
    <View style={styles.container}>
      <View style={styles.makeTitle}><Text style={styles.makeTextStyle2}>盤點機登入</Text></View>
      <View style={styles.makeRow}>
        <Icon name="person" style={styles.makeIcon} />
        <TextInput
          label="帳號"
          name='username'
          mode={'outlined'}
          onChangeText={(e)=>handleChange('username',e)}
          style={styles.inputWidth}
        />
      </View>
      <View style={styles.makeRow}>
        <Icon name="lock" style={styles.makeIcon}/>
        <TextInput
          label="密碼"
          name='password'
          mode={'outlined'}
          onChangeText={(e)=>handleChange('password',e)}
          style={styles.inputWidth}
          secureTextEntry
        />
      </View>
      <Button
        onPress={onsubmit}
        mode="contained"
        style={styles.confirmBtn}
      >
        <Text style={styles.makeTextStyle}>登入</Text>
      </Button>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent:'space-evenly',
    alignItems:'center',
    marginTop:0,
    padding:10,
    borderColor:'black',
    backgroundColor:'white'
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 3,
    // },
    // shadowOpacity: 0.27,
    // shadowRadius: 4.65,
  },
  makeRow:{flexDirection:'row'},
  inputWidth:{
    width: 280
  },
  makeTitle:{width:400,height:70,backgroundColor: 'black',justifyContent: 'center',alignItems: 'center',marginTop: -100},
  makeIcon:{lineHeight: 70},
  confirmBtn: {
    backgroundColor: '#E8E8E8',
    height: 50,
    width:250,
    borderWidth: 1,
    // borderColor: 'white',
    shadowColor: "#0c0c0c",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 2.22,
    elevation: 5,
  },
  makeTextStyle:{lineHeight:30,fontSize:15,color:'black'},
  makeTextStyle2:{fontSize:20,color:'white'},
});

export default Login;
