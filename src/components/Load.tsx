import React from 'react';
import { StyleSheet,Text,View } from 'react-native';

import LottieView from 'lottie-react-native';

import animeLoading from '../assets/animeLoading.json';
import fonts from '../styles/fonts';
import colors from '../styles/colors';

export function Load(){

    return(
        <View style={styles.container}>
            <LottieView
                source={animeLoading}
                autoPlay
                loop
                style={styles.animation}
                speed={1.5}
            />
            <Text style={styles.title}> Carregando... </Text>
        </View>
    )

}

const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },

    animation: {
        width: 250,
        height: 250
    },

    title: {
        fontFamily: fonts.semiBold,
        fontSize: 16,
        color: colors.white
    }

})