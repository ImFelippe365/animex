import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    Linking,
    Alert,
    Modal,
    Pressable,
} from 'react-native';

import fonts from '../styles/fonts';
import colors from '../styles/colors';

import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { Button } from '../components/Button';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/core';

import { loadAnime, loadEpisode, Stream, AnimeDetails, getNextEpisode, getPrevEpisode, loadAllEpisodes } from '../libs/storage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Load } from '../components/Load';
import { AllEpisodes } from './../libs/storage';
import { Video } from 'expo-av';

interface Params{
    id: string,
    animeId: string
}

export function EpisodeView(){

    const route = useRoute();
    const { id, animeId } = route.params as Params;
    const navigator = useNavigation();

    const [episodeDetails, setEpisodeDetails] = useState<Stream>();
    const [animeDetails, setAnimeDetails] = useState<AnimeDetails>();

    const [showNextButton, setShowNextButton] = useState(true);
    const [showPrevButton, setShowPrevButton] = useState(true);

    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    function handlePlayEpisode(){
        navigator.navigate('VideoPlayer', { episodeDetails })
    }

    function handleAnime(){
        navigator.navigate('AnimeDetailsView', { animeId })
    }

    async function nextEpisode(){
        const episode = await getNextEpisode(String(episodeDetails?.video_id), String(animeDetails?.id));
        const details : Stream = episode as Stream;
        
        if(details != null){
            setEpisodeDetails(details)
        } else{
            setModalVisible(true)
        }
        
    }

    async function prevEpisode(){
        const episode = await getPrevEpisode(String(episodeDetails?.video_id), String(animeDetails?.id));
        const details : Stream = episode as Stream;

        if(details != null){
            setEpisodeDetails(details)
        } else{
            setModalVisible(true)
        }
    }
    
    useEffect(() =>{

        async function getEpisode(){
            
            const episode = await loadEpisode(id);
            const details : Stream = episode as Stream;
            
            setEpisodeDetails(details);
        }

        async function getAnime(){
            
            const anime = await loadAnime(animeId);
            const details : AnimeDetails = anime as AnimeDetails;
            
            setAnimeDetails(details);
        }
        
        getEpisode();
        getAnime();
        setLoading(false);
    }, [])

    if(loading)
        return <Load/>

    return (
        
            <View style={styles.container}>

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
                            <Text style={styles.modalText}>Desculpe!</Text>
                            <Text style={styles.modalTextSubtitle}>
                                Não há mais episódios para a direção que você selecionou
                            </Text>
                            <Pressable
                                
                                onPress={() => setModalVisible(!modalVisible)}
                            >
                                <Button title='Ok' />
                            </Pressable>
                        </View>
                    </View>
                </Modal>
                
                <View style={styles.header}>
                    <MaterialIcons
                        name="arrow-back"
                        size={24}
                        color={colors.white}
                    />
                    <TouchableOpacity onPress={handleAnime}>
                        <MaterialIcons
                            name="format-list-bulleted"
                            size={24}
                            color={colors.white}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>

                    {
                        showPrevButton ?
                        <TouchableOpacity onPress={prevEpisode}>
                            <MaterialIcons
                                name="chevron-left"
                                size={32}
                                color={colors.white}
                            />
                        </TouchableOpacity> : <></>
                    }
                
                    <Image 
                        source={{uri: 'https://cdn.appanimeplus.tk/img/'+animeDetails?.category_image }}
                        style={styles.episodeImage}
                    />
                        
                    <Text style={styles.episodeTitle}>
                        { episodeDetails?.title }
                    </Text>

                    {
                        showNextButton ?
                        <TouchableOpacity onPress={nextEpisode}>
                            <MaterialIcons
                                name="chevron-right"
                                size={32}
                                color={colors.white}
                            />
                        </TouchableOpacity> : <></>
                    }
                    

                </View>

                <View style={styles.viewOptionsContainer}>
                    <View>
                        <Text style={styles.viewOptionsTitle}>Opções para </Text>
                        <Text style={styles.viewOptionsSubtitle}>assistir: </Text>
                    </View>

                        {
                            episodeDetails?.locationhd ?
                            <Button 
                                title="Assistir FULL HD"
                                onPress={handlePlayEpisode}
                            />
                        : <View></View>
                        }

                        {
                            episodeDetails?.locationsd ?
                            <Button 
                                title="Assistir HD"
                                onPress={handlePlayEpisode}
                            />
                        : <View></View>
                        }

                        {
                            episodeDetails?.location ?
                            <Button 
                                title="Assistir SD"
                                onPress={handlePlayEpisode}
                            />
                        : <View></View>
                        }

                    <View>
                        <Text style={styles.viewOptionsTitle}>Opções para </Text>
                        <Text style={styles.viewOptionsSubtitle}>download: </Text>
                    </View>

                    {
                            episodeDetails?.locationhd ?
                            <Button 
                                title="Baixar em FULL HD"
                                onPress={() =>{
                                    Linking.openURL(episodeDetails.locationhd)
                                }}
                            />
                        : <View></View>
                        }

                        {
                            episodeDetails?.locationsd ?
                            <Button 
                                title="Baixar em HD"
                                onPress={() =>{
                                    Linking.openURL(episodeDetails.locationsd)
                                }}
                            />
                        : <View></View>
                        }

                        {
                            episodeDetails?.location ?
                            <Button 
                                title="Baixar em SD"
                                onPress={() =>{
                                    Linking.openURL(episodeDetails.location)
                                }}
                            />
                        : <View></View>
                        }
                    
                        
                </View>
                
            </View>
        
    )

}

const styles = StyleSheet.create({

    container: {
        marginTop: getStatusBarHeight(),
        backgroundColor: colors.background
    },
    
    header: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginHorizontal: 'auto',
        alignItems: 'center',
        paddingBottom: 20
    },

    episodeTitle: {
        textAlign: 'left',
        fontFamily: fonts.heading,
        fontSize: 20,
        lineHeight: 23,
        flexWrap: 'wrap',
        width: '30%',
        color: colors.white
    },

    episodeImage: {
        width: 160,
        height: 230,
        marginRight: 10
    },

    viewOptionsContainer: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: 'black',
        marginTop: 5,
        height: '100%',
        flexGrow: 0
    },

    viewOptionsTitle: {
        fontFamily: fonts.heading,
        fontSize: 18,
        color: colors.white,
        textAlign: 'center',
    },

    viewOptionsSubtitle: {
        fontFamily: fonts.heading,
        fontSize: 18,
        color: colors.blue,
        lineHeight: 20,
        textAlign: 'center',
        marginBottom: 10
    },

    backgroundGradient: {
        height: '100%', 
        width: '100%', 
    },

    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(255,255,255,0.7)',
        
    },

    modalView: {
        margin: 20,
        backgroundColor: colors.white,
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
    }

})