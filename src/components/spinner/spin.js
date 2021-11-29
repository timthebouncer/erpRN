import React, {useState} from 'react';
import { createContext, useContextSelector } from 'use-context-selector';
import {
  StyleSheet,
  View,
  Modal,
  ActivityIndicator
} from 'react-native';


export const spinContext = createContext()

export const SpinnerProvider=({children})=>{
  const [visible, setVisible] = useState(false)


  const showLoading=(loading)=>{
    setVisible(loading)
  }


  return(
    <spinContext.Provider value={{showLoading}}>
      <Modal
        transparent={true}
        animationType={'none'}
        visible={visible}
        onRequestClose={() => {console.log('close modal')}}>
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator
              size='large'
              animating={visible} />
          </View>
        </View>
      </Modal>

      {children}
    </spinContext.Provider>
  )
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
  },
  activityIndicatorWrapper: {
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  }
});
