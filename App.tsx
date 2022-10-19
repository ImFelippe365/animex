
import { StatusBar } from 'expo-status-bar';
import React from 'react';

import Routes from './src/routes/';
import AppLoading from 'expo-app-loading';

import { Appearance, AppearanceProvider, useColorScheme } from 'react-native-appearance';

import { useFonts, Jost_400Regular, Jost_600SemiBold, Jost_700Bold } from '@expo-google-fonts/jost';
import colors from './src/styles/colors';

export default function App() {

  let [fontsLoaded] = useFonts({
    Jost_400Regular,
    Jost_600SemiBold,
    Jost_700Bold
  });

  if(!fontsLoaded){
    return <AppLoading/>
  }
  
  return (
      
        <Routes/>
    
    
  );

}