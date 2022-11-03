
import { StatusBar } from 'expo-status-bar';
import React from 'react';

import Routes from './src/routes/';

import { useFonts, Jost_400Regular, Jost_600SemiBold, Jost_700Bold } from '@expo-google-fonts/jost';
import colors from './src/styles/colors';
import { Load } from './src/components/Load';

export default function App() {

	let [fontsLoaded] = useFonts({
		Jost_400Regular,
		Jost_600SemiBold,
		Jost_700Bold
	});

	if (!fontsLoaded) {
		return <Load />
	}
	return (

		<Routes />


	);
}