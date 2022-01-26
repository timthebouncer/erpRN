import { createContext, useContextSelector } from 'use-context-selector';
import React, {useState} from 'react';
import {FAB} from 'react-native-paper';
import {View, StyleSheet} from 'react-native';

export const toTopContext = createContext()


export const ToTopProvider = ({children}) =>{
  const [scrollParam, setScrollParam] = useState(null)
  const [offsetParam, setOffsetParam] = useState(null)

  return (
    <toTopContext.Provider value={{scrollParam, setScrollParam,offsetParam, setOffsetParam}}>
      {
        offsetParam < 1000 ? <ShowFab/>:<View></View>
      }
      {children}
    </toTopContext.Provider>
  )
}


function ShowFab(){

  const scrollParam = useContextSelector(toTopContext,e=>e.scrollParam)

  const goTop=()=>{
    scrollParam?.scrollTo({
      y: 0,
      animated: true,
    });
  }

  return(
    <FAB
      animated
      style={[styles.scrollTopButton, {bottom: 20}]}
      small
      icon="chevron-up"
      onPress={goTop}
    />
  )
}


const styles = StyleSheet.create({
  scrollTopButton: {
    backgroundColor: '#1976d2',
    justifyContent: 'center',
    alignItems:'center',
    position: 'absolute',
    right: 10,
    zIndex:9999
  },
})
