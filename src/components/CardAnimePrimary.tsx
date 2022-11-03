import React, { useEffect, useState } from 'react';

import {
    Image,
    StyleSheet, Text, View, ViewProps
} from 'react-native';
import colors from '../styles/colors';

import fonts from '../styles/fonts';
import test from '../assets/boruto.jpg'

interface Anime extends ViewProps {
    title: string,
    cape: string,
    capeWidth?: number,
    capeHeight?: number
}

export function CardAnimePrimary({ title, cape, capeWidth = 120, capeHeight = 200, ...rest }: Anime) {

    const styles = StyleSheet.create({

        container: {
            width: 125,
            height: 'auto',
        },

        Image: {
            width: capeWidth,
            height: capeHeight,
        },

        title: {
            fontFamily: fonts.heading,
            marginTop: 5,
            flexWrap: 'wrap',
            textAlign: 'center',
            lineHeight: 16.9,
            width: capeWidth,
            color: colors.white
        }

    })

    const imageUrl = {
        uri: "https://cdn.appanimeplus.tk/img/" + cape, headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 5.1.1; SM-G928X Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.83 Mobile Safari/537.36"
        }
    }

    return (
        <View style={styles.container} {...rest}>
            <Image
                source={imageUrl}
                style={styles.Image}
            />
            <Text numberOfLines={1} style={styles.title}>{title}</Text>
        </View>

    )

}
