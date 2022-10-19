import React, { useEffect, useState } from 'react';

import {
    Image,
    StyleSheet, Text, View
} from 'react-native';
import { RectButton, RectButtonProps, TouchableOpacity } from 'react-native-gesture-handler';

import colors from '../styles/colors';
import fonts from '../styles/fonts';
import { MaterialIcons } from '@expo/vector-icons';

interface Params extends RectButtonProps {
    title: string,
    icon: any,
}

export function Button({ title, icon, ...rest }: Params) {

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button}>
                <RectButton
                    {...rest}
                >
                    <MaterialIcons
                        name={icon}
                        size={25}
                        color={colors.blue}
                    />
                </RectButton>

            </TouchableOpacity>
            <Text style={styles.title}>{title}</Text>
        </View>

    )

}

const styles = StyleSheet.create({

    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    button: {
        width: 50,
        height: 50,
        borderColor: colors.blue,
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8
    },

    title: {
        fontFamily: fonts.heading,
        flexWrap: 'wrap',
        textAlign: 'center',
        fontSize: 16,
        color: colors.blue,
        width: 90,
        lineHeight: 20
    }

})