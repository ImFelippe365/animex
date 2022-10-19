import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
    Dimensions,
    FlatList,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import fonts from '../styles/fonts';
import colors from '../styles/colors';
import { useNavigation } from '@react-navigation/core';

export function Category() {

    const navigator = useNavigation();

    function handleAnimesCategory(index: number, animeCategory: string){
        navigator.navigate('AnimeCategoryView', { index, animeCategory })
    }

    const categories: string[] = [
        'Aventura',
        'Ação',
        'Comédia',
        'Drama',
        'Dublado',
        'Ecchi',
        'Escolar',
        'Esporte',
        'Fantasia',
        'Filme',
        'Harem',
        'Histórico',
        'Jogo',
        'Josei',
        'Magia',
        'Mecha',
        'Militar',
        'Mistério',
        'OVA',
        'Poderes',
        'Psicológico',
        'Romance',
        'Samurai',
        'Sci-Fi',
        'Seinen',
        'Shoujo',
        'Shounen',
        'Slice of Life',
        'Sobrenatural',
        'Suspense',
        'Terror',
        'Yaoi',
        'Yuri',
    ];

    return (
            <View style={styles.container}>
                
                    <Text style={styles.categoryTitleList}>Categorias</Text>

                    

                    <FlatList
                        data={categories}
                        keyExtractor={(item,index) => index.toString()}
                        renderItem={({item, index}) => (
                            <View>
                                <TouchableOpacity 
                                    style={styles.categoryButton}
                                    onPress={() => handleAnimesCategory(index, item)}
                                >
                                    <Text style={styles.categoryText}>
                                        { item }
                                    </Text>
                                </TouchableOpacity>
                            </View> 
                        )}
                        showsVerticalScrollIndicator={false}
                    />
                
            </View>
    )

}

const styles = StyleSheet.create({

    container: {
        padding: 20,
        marginBottom: 30,
        backgroundColor: 'black',
    },

    categoryTitleList: {
        fontFamily: fonts.heading,
        fontSize: 20,
        color: colors.blue,
        paddingVertical: 12
    },

    categoryButton: {
        padding: 12,
        borderTopColor: colors.shape,
        borderBottomColor: colors.shape,
        borderBottomWidth: 1,
    },

    categoryText: {
        fontFamily: fonts.text,
        fontSize: 16,
        color: colors.white,
    }

})