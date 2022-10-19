import React, { useEffect, useState } from 'react';
import {
    Modal,
    Pressable,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { FlatList, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import colors from '../styles/colors';
import fonts from '../styles/fonts';
import { CardAnimePrimary } from './../components/CardAnimePrimary';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnimeDetails } from '../libs/storage';
import { Load } from '../components/Load';
import { useNavigation } from '@react-navigation/core';
import { MaterialIcons } from '@expo/vector-icons';

export function Favorites() {

    const [favorites, setFavorites] = useState<AnimeDetails[]>();
    const [loading, setLoading] = useState(true);

    const [modalVisible, setModalVisible] = useState(false);

    const navigation = useNavigation();

    function handleAnimeView(animeId: string){
        console.log(animeId)
        navigation.navigate('AnimeDetailsView', { animeId })
    }

    async function loadFavorites(){
        try {
            const getFavorites: any = await AsyncStorage.getItem('@animex:favorites');
            const favorites: AnimeDetails[] = JSON.parse(getFavorites) as AnimeDetails[]; 
            

            
            if(getFavorites != null){
                setFavorites(favorites);
                console.log(favorites)
            } 
        } catch (Error) {
            console.log(Error)
        }

        setLoading(false);
    }

    useEffect(() => {
        navigation.addListener('focus', () => {
            loadFavorites();
        })
    }, [])

    if (loading) {
        return <Load/>
    }
    return (
        <View style={styles.container} >

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Pronto!</Text>
                        <Text style={styles.modalTextSubtitle}>
                            Seus favoritos foram recarregados.
                        </Text>
                        <Pressable
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <TouchableOpacity style={styles.modalButton}>
                                <Text style={styles.modalButtonText}>Ok</Text>
                            </TouchableOpacity>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Seus</Text>
                    <Text style={styles.headerSubtitle}>Favoritos</Text>
                </View>

                <TouchableOpacity onPress={() => {
                    loadFavorites();
                    setModalVisible(!modalVisible);
                }}>
                    <MaterialIcons
                        name='refresh'
                        size={24}
                        color={colors.white}
                    />
                </TouchableOpacity>
            </View>
            
            

                <FlatList
                    contentContainerStyle={styles.favoritesContainer}
                    horizontal={false}
                    data={favorites}
                    numColumns={3}
                    columnWrapperStyle={{margin: 8}}
                    renderItem={({item}) => (
                        <View>
                            <TouchableOpacity 
                                onPress={() => {
                                    handleAnimeView(item.id)
                                }}
                            >
                                <CardAnimePrimary 
                                    title={item.category_name} 
                                    cape={item.category_image}
                                    capeHeight={160}
                                    capeWidth={110}
                                />
                            </TouchableOpacity>
                        </View> 
                    )}
                />
                
            
        </View>

    )

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'black',
        paddingTop: 10
    },

    header: {
        fontFamily: fonts.heading,
        fontSize: 20,
        padding: 20,
        color: colors.blue,
        paddingVertical: 12,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center'
    },

    headerTitle: {
        fontFamily: fonts.heading,
        color: colors.white,
        fontSize: 24,
        alignItems: 'center'
    },

    headerSubtitle: {
        fontFamily: fonts.heading,
        color: colors.blue,
        fontSize: 24,
        alignItems: 'center',
        lineHeight: 26
    },

    favoritesContainer: {
        width: '100%',
        padding: 0,
        marginHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 80,
    },

    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(255,255,255,0.7)',
        
    },

    modalView: {
        margin: 20,
        backgroundColor: 'black',
        borderRadius: 20,
        paddingTop: 30,
        paddingBottom: 16,
        paddingHorizontal: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },

    modalText: {
        marginBottom: 12,
        textAlign: "center",
        fontSize: 20,
        fontFamily: fonts.heading,
        color: colors.blue
    },

    modalTextSubtitle: {
        marginBottom: 12,
        textAlign: "center",
        fontSize: 18,
        fontFamily: fonts.text,
        color: colors.white
    },

    modalButton: {
        backgroundColor: colors.blue,
        alignItems: 'center',
        justifyContent: 'center',
        width: 100,
        padding: 10,
        borderRadius: 16
    },

    modalButtonText: {
        color: colors.white,
        fontFamily: fonts.heading,
        fontSize: 16
    }


})