import React, { useEffect, useRef } from 'react';
import {
    StyleSheet, TextInputProps, TouchableOpacityProps, View, Animated
} from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../styles/colors';


export function SearchBar({...rest }: TextInputProps){

    return(
        <View style={styles.container}>
            <MaterialIcons
                name='search'
                size={18}
                color={colors.white}
                style={styles.searchIcon}
            />
            <TextInput
                style={styles.textInputStyle}
                placeholder="Digite um anime..."
                clearButtonMode="always"
                placeholderTextColor={colors.white}
                {... rest}
            />
            {/* <TouchableOpacity {... rest2}>
                <MaterialIcons
                    name='cancel'
                    size={18}
                    
                />
            </TouchableOpacity> */}
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '90%',
        borderRadius: 24,
        elevation: 2,
    },

    textInputStyle: {   
        paddingHorizontal: 20,
        width: '85%',
        color: colors.white
    },

    cancelIcon: {
        justifyContent: 'flex-end',
        color: colors.white
    },

    searchIcon: {
        marginLeft: 10,
        color: colors.white
    }
});