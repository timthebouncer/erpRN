import React,{useState,useEffect} from 'react';
import Restore from '../../pages/Restore/RestoreLog';
import service from '../../apis/check';
import {View, Text,TextInput, StyleSheet} from 'react-native';
import { Icon,Button } from 'react-native-material-ui';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import moment from 'moment'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {dialogContext} from '../Dialog/Dialog';
import {useContextSelector} from 'use-context-selector';


const Header = ({ navigation, options }) => {

  const show  = useContextSelector(dialogContext,e=>e.show)

  const [visible, setVisible] = useState(false);
  const [user, setUser] = useState('')
  const [ip, setIp] = useState('')
  const [printName, setPrintName] = useState('')
  const hideMenu = () => setVisible(false);

  const showMenu = () => setVisible(true);

  const showSetting=(type)=>{
    AsyncStorage.getItem('printName').then((value) => {
      setPrintName(JSON.parse(value))
      return JSON.parse(value);
    });

    let dialogData = {title:'header',id:123,ip:ip,printName:printName}
    show({ type, onOk:()=>dialogData, content: () => null })
  }

  const _logout = async () => {
  await service.Logout.logout()
      .then(res=>{
        console.log(res);
        AsyncStorage.removeItem('token')
      })
    navigation.navigate('Login');
  }

  const changeRouter=(e)=>{
    switch (e) {
      case '出貨':
        navigation.navigate('Sales');
        hideMenu()
      break;
      case '取消入庫':
        navigation.navigate('CancelRestore');
        hideMenu()
      break;
      case '重新入庫':
        navigation.navigate('Restore');
        hideMenu()
      break;
      case '出貨清單':
        navigation.navigate('SalesLog');
        hideMenu()
      break;
      case '取消入庫清單':
        navigation.navigate('CancelRestoreLog');
        hideMenu()
      break;
      case '重新入庫清單':
        navigation.navigate('RestoreLog');
        hideMenu()
      break;
    }
  }
  let today = moment(new Date()).format("YYYY-MM-DD");

  useEffect(()=>{
   // AsyncStorage.getItem('token').then((value) => {
   //   console.log(value,'val');
   //    return JSON.parse(value);
   //  });
   AsyncStorage.getItem('checkUser').then((value) => {
     setUser(JSON.parse(value))
      return JSON.parse(value);
    });
   AsyncStorage.getItem('ip').then((value) => {
     setIp(JSON.parse(value))
      return JSON.parse(value);
    });
  },[])

  return (
    <View style={{flex:0.2}}>
      <View style={styles.container}>
        <View>
          <Text onPress={()=>showSetting('setting')}>
            <Icon name="settings" />
          </Text>
        </View>
        <View style={styles.headerWrapper}>
          <Text style={styles.fontStyle}>
            {options?.headerTitle || '一般標題'}
          </Text>
          <Menu
            visible={visible}
            anchor={<Text onPress={showMenu}>{visible?<Icon size={40} name="arrow-drop-up" />:<Icon size={40} name="arrow-drop-down" />} </Text>}
            onRequestClose={hideMenu}
            style={styles.menuWrapper}
          >
            <View style={styles.btnWrapper}>
              <View style={styles.btnGroupRight} >
                <View style={styles.btnMarginBottom}>
                  <Button style={styles.btnFlex} raised primary text={'出貨'} name="Sales" onPress={(e)=>changeRouter(e)} />
                </View>
                <View style={styles.btnMarginBottom}>
                  <Button style={styles.btnFlex} raised primary text={'取消入庫'} name="CancelRestore" onPress={(e)=>changeRouter(e)} />
                </View>
                <Button style={styles.btnFlex} raised primary text={'重新入庫'} name="Restore" onPress={(e)=>changeRouter(e)} />
              </View>
              <View style={styles.btnGroupLeft} >
                <View style={styles.btnMarginBottom}>
                  <Button style={styles.btnFlex} raised primary text={'出貨清單'} name="SalesLog" onPress={(e)=>changeRouter(e)} />
                </View>
                <View style={styles.btnMarginBottom}>
                  <Button style={styles.btnFlex} raised primary text={'取消入庫清單'} name="CancelRestoreLog" onPress={(e)=>changeRouter(e)} />
                </View>
                <Button style={styles.btnFlex} raised primary text={'重新入庫清單'} name="RestoreLog" onPress={(e)=>changeRouter(e)} />
              </View>
            </View>
          </Menu>
        </View>
        <View>
          <View style={styles.logoutWrapper}>
            <Text>{user}</Text>
            <Text onClick={_logout}>
              <Icon name="logout" />
            </Text>
          </View>
        </View>
      </View>
        <View style={styles.workDay}>
          <Text style={styles.workDayText}>工作日期:{today}</Text>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:0.7,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems: 'center',
    backgroundColor: 'rgb(12, 81, 156)',
    paddingLeft:20,
    paddingRight:20
  },
  headerWrapper:{
    flex: 1, flexDirection: 'row',justifyContent: 'center',marginLeft:40,alignItems: 'center'
  },
  fontStyle: {
    fontSize:20,
    color:'white'
  },
  menuWrapper:{
    position:'absolute',
    top:45,
    left:370,
    width:330
  },
  btnWrapper:{
    flexDirection: 'row', padding: 16
  },
  btnGroupRight:{
    flex: 1, marginRight: 8
  },
  btnGroupLeft:{
    flex: 1, marginRight: 8
  },
  btnMarginBottom:{
    marginBottom: 16
  },
  btnFlex:{
    flex:1
  },
  workDay:{
    backgroundColor:'#FFF0E9',
    flex:0.4,
  },
  workDayText:{
    fontSize:17,
  },
  input:{
    height: 50,
    width:170,
    borderColor: 'white',
    borderWidth: 1,
    backgroundColor:'white',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutWrapper:{flex:1,flexDirection:'row', alignItems: 'center', justifyContent: 'center'}
});


export default Header;
