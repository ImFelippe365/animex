import React, { useContext, useEffect, useRef, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    FlatList,
    ScrollView,
    ActivityIndicator,
    Modal,
    Pressable,
    Dimensions,
    Linking,
    AppState,
} from 'react-native';

import { ProgressBar } from 'react-native-paper';

import fonts from '../styles/fonts';
import colors from '../styles/colors';

import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/core';

import { loadAnime, AnimeDetails, loadAllEpisodes, AllEpisodes, AnimeDetailsStorage, Stream, loadEpisode, StreamSave, saveEpisodeState, loadEpisodeWatched } from '../libs/storage';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { Load } from '../components/Load';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '../components/Button';

import { VideoPlayer } from '../components/VideoPlayer';
import * as ScreenOrientation from 'expo-screen-orientation';

interface Params {
    id: string,
    animeId: string
}

export function AnimeDetailsView() {

    const route = useRoute();
    const { id, animeId } = route.params as Params;
    const navigator = useNavigation();

    const [episodes, setEpisodes] = useState<AllEpisodes[]>([]);
    const [animeDetails, setAnimeDetails] = useState<AnimeDetails>();
    const [episodeDetails, setEpisodeDetails] = useState<Stream>();
    const videoUri = episodeDetails?.locationhd || episodeDetails?.locationsd || episodeDetails?.location;

    const [loading, setLoading] = useState(true);
    const [listOrder, setListOrder] = useState(false);

    const [modalAddVisible, setModalAddVisible] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);

    const [iconActive, setIconActive] = useState(false);
    const [videoFullScreen, setVideoFullScreen] = useState(false);

    const [play, setPlay] = useState(false);
    const [position, setPosition] = useState(0);
    const [maxDuration, setMaxDuration] = useState(0);
    const [savedEpisodes, setSavedEpisods] = useState<StreamSave[]>([]);

    const mountedRef = useRef(true)

    async function getSavedEpisodes() {
        console.log('entrou')
        try {
            const data = await loadEpisodeWatched(animeId);
            setSavedEpisods(data)

        } catch (Error) {
            console.log(Error)
        }


    }

    async function showFirstEpisode(firstEpisode: any) {
        const video_id = id ? id : firstEpisode.video_id;
        id && setPlay(true);

        const episode = await loadEpisode(video_id);
        const details: Stream = episode as Stream;

        setEpisodeDetails(details);
    }

    async function handleEpisodeView(video_id: string) {
        const episode = await loadEpisode(video_id);
        const details: Stream = episode as Stream;

        setEpisodeDetails(details);
    }

    function handleChangeOrder() {
        setListOrder(!listOrder)
        episodes?.reverse()
    }

    async function getEpisodes() {

        const data = await loadAllEpisodes(animeId);
        const episodes: AllEpisodes[] = data as AllEpisodes[];

        setEpisodes(episodes);
        //showFirstEpisode(episodes.reverse()[0]);
        setLoading(false);
        handleEpisodesWatched(episodes[0])
    }

    async function getAnime() {

        const anime = await loadAnime(animeId);
        const details: AnimeDetails = anime as AnimeDetails;

        setAnimeDetails(details);
        loadFavorites(details.id);
    }

    async function removeFavorite() {
        try {
            const data = await AsyncStorage.getItem('@animex:favorites');
            const oldFavorites: any = data ? (JSON.parse(data) as AnimeDetailsStorage) : {};

            Object.keys(oldFavorites).map((index) => {
                if (animeDetails?.id == oldFavorites[Number(index)].id && oldFavorites[Number(index)].id != undefined) {
                    oldFavorites.splice(Number(index), 1)
                    AsyncStorage.setItem('@animex:favorites', JSON.stringify(oldFavorites))
                    setIconActive(false);
                    setModalAddVisible(!modalAddVisible)
                }

            });

        } catch (Error) {
            console.log(Error)
        }
    }

    async function loadFavorites(id: string) {
        try {
            const data = await AsyncStorage.getItem('@animex:favorites');
            const oldFavorites: AnimeDetailsStorage = data ? (JSON.parse(data) as AnimeDetailsStorage) : {};

            Object.keys(oldFavorites).map((index) => {
                if (Number(id) == Number(oldFavorites[Number(index)].id)) {
                    setIconActive(true);
                    return true;
                }

            })

        } catch (Error) {
            console.log(Error)
        }
    }

    async function animeFavorite() {

        try {
            const data = await AsyncStorage.getItem('@animex:favorites');
            const oldFavorites: AnimeDetailsStorage = data ? (JSON.parse(data) as AnimeDetailsStorage) : {};

            // Object.keys(oldFavorites).map((index) => {
            //     if(animeDetails?.id == oldFavorites[Number(index)].id){
            //         delete oldFavorites[Number(index)]
            //         return;
            //     }

            // });

            if (oldFavorites) {
                var newFavorite = []
                Object.keys(oldFavorites).map((item) => {
                    newFavorite.push(oldFavorites[Number(item)])
                })
                newFavorite.push(animeDetails)
                //console.log(' existia', oldFavorites)
                await AsyncStorage.setItem('@animex:favorites', JSON.stringify(newFavorite));
                setIconActive(true);
                setModalAddVisible(!modalAddVisible)
            } else {
                //console.log('nao existia', oldFavorites[0])
                await AsyncStorage.setItem('@animex:favorites', JSON.stringify({ animeDetails }))
                setIconActive(true);
                setModalAddVisible(!modalAddVisible)
            }


            //await AsyncStorage.removeItem('@animex:favorites')
            // console.log('Anime armazenado!', favorites)
        } catch (Error) {
            console.log(Error)
        }

    }

    function handleFullScreen() {
        setVideoFullScreen(!videoFullScreen);

        if (!videoFullScreen) {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT)
        } else {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)
        }


    }

    function handleEpisodesWatched(episode: AllEpisodes) {
        console.log(episode)
        var watched;
        savedEpisodes.map((element, index) => {
            if (episode.video_id == element.video_id) {
                watched = element.watched;
                console.log(watched)
            }
        });

        return watched;
    }

    useEffect(() => {
        // AppState.addEventListener("change", () => {
            
        //         saveEpisodeState(position, maxDuration, episodeDetails as StreamSave);
            
        //     console.log('tava aki')
        // });
        // navigator.addListener('blur', () => {
        //     if (!videoFullScreen) {
        //         ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)

        //     }
            
        //         saveEpisodeState(position, maxDuration, episodeDetails as StreamSave);
            
        // })

        getSavedEpisodes();
        getEpisodes();
        getAnime();
        
        
        return () => {
            mountedRef.current = false
        }

    }, [])

    if (loading) {
        return <Load />
    }

    return (

        <ScrollView scrollEnabled={!videoFullScreen}>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalAddVisible}
                onRequestClose={() => {
                    setModalAddVisible(!modalAddVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Pronto! 😄</Text>
                        <Text style={styles.modalTextSubtitle}>
                            {iconActive ? 'Este anime foi adicionado a sua lista de favoritos!' : 'Este anime foi removido da sua lista de favoritos!'}
                        </Text>
                        <Pressable
                            onPress={() => setModalAddVisible(!modalAddVisible)}
                        >
                            <TouchableOpacity style={styles.modalButton}>
                                <Text style={styles.modalButtonText}>Ok</Text>
                            </TouchableOpacity>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            <View style={styles.container}>
                {
                    !videoFullScreen &&
                    <View style={styles.header}>
                        <TouchableOpacity
                            onPress={() => {
                                navigator.goBack();
                            }}
                        >
                            <MaterialIcons
                                name="arrow-back"
                                size={24}
                                color={colors.white}
                            />
                        </TouchableOpacity>

                    </View>
                }

                <View >

                    {
                        play ?
                            <VideoPlayer
                                name={episodeDetails?.title}
                                uri={videoUri || ''}
                                episode={episodeDetails}
                                style={videoFullScreen && { height: 400, width: '100%' }}
                                click={() => handleFullScreen()}
                                getPosition={setPosition}
                                getMaxDuration={setMaxDuration}
                            /> :
                            <Image
                                source={{ uri: 'https://cdn.appanimeplus.tk/img/' + animeDetails?.category_image }}
                                style={styles.animeImage}
                            />
                    }


                    <Text style={{ color: 'white' }}>{(position / 1000) * 80 / 100}</Text>


                </View>

                {
                    !videoFullScreen &&
                    <View style={styles.animeContent}>

                        <View style={styles.animeDetailsSize}>

                            <Text style={styles.animeTitle}>
                                {animeDetails?.category_name}
                            </Text>

                            <Text style={styles.animeYear}>
                                {animeDetails?.ano}
                            </Text>

                            <View style={styles.animeGenres}>

                                <Text style={styles.animeGenresValue}>
                                    <Text style={styles.animeGenresTitle}>Gêneros: </Text>
                                    {animeDetails?.category_genres}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.animeActions}>
                            <Button
                                title='Assistir'
                                icon='play-arrow'
                                onPress={() => setPlay(true)}
                            />
                            <Button
                                onPress={iconActive ? removeFavorite : animeFavorite}
                                title={iconActive ? 'Favorito' : 'Favoritar'}
                                icon={iconActive ? 'favorite' : 'favorite-outline'}
                            />
                            <Button
                                onPress={() => Linking.openURL(videoUri || '')}
                                title='Baixar'
                                icon='file-download'
                            />
                        </View>

                        <Text
                            numberOfLines={showFullDescription ? undefined : 5}
                            style={styles.animeDescription}
                        >
                            {animeDetails?.category_description}
                        </Text>
                        <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
                            <Text style={{ color: colors.blue_light, fontFamily: fonts.heading }}>
                                {showFullDescription ? 'Ler menos...' : 'Ler mais...'}
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.episodesHeader}>
                            <View>
                                <Text style={styles.animeListTitle}>Lista de</Text>
                                <Text style={styles.animeListSubtitle}>Episódios</Text>
                            </View>

                            {
                                listOrder ?
                                    <TouchableOpacity style={styles.episodesOrder} onPress={handleChangeOrder}>
                                        <MaterialIcons
                                            name='expand-less'
                                            size={18}
                                            color={colors.blue}
                                        />
                                        <Text style={styles.episodesText}>Crescente</Text>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity style={styles.episodesOrder} onPress={handleChangeOrder}>
                                        <MaterialIcons
                                            name='expand-more'
                                            size={18}
                                            color={colors.blue}
                                        />
                                        <Text style={styles.episodesText}>Decrescente</Text>
                                    </TouchableOpacity>
                            }

                        </View>

                        {/* {
                            episodes?.map<any>((item, index) =>

                                <View key={index} style={handleEpisodesWatched(item) && styles.disableEpisode}>
                                    <TouchableOpacity
                                        style={styles.episodeListContainer}
                                        onPress={() => {
                                            if (position) {
                                                saveEpisodeState(position, maxDuration, episodeDetails as StreamSave);
                                            }
                                            handleEpisodeView(item.video_id);
                                            setPlay(true);
                                        }}
                                    >
                                        <Text
                                            style={[styles.episodeList,  item.title == episodeDetails?.title && styles.activeEpisode]}
                                        >
                                            {item.title}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )



                        } */}

                        <FlatList
                            keyExtractor={(item, index) => index.toString()}
                            data={episodes}
                            renderItem={({item, index}) => (
                                <View key={index}>
                                    <TouchableOpacity
                                        style={styles.episodeListContainer}
                                        onPress={() => {
                                            if (position) {
                                                saveEpisodeState(position, maxDuration, episodeDetails as StreamSave);
                                            }
                                            handleEpisodeView(item.video_id);
                                            setPlay(true);
                                        }}
                                    >
                                        <Text
                                            style={[styles.episodeList,  item.title == episodeDetails?.title && styles.activeEpisode]}
                                        >
                                            {item.title}
                                        </Text>
                                        
                                    </TouchableOpacity>
                                    
                                </View>
                            )}

                        />

                    </View>
                }


            </View>
        </ScrollView>

    )

}

const styles = StyleSheet.create({

    container: {
        backgroundColor: 'black'
    },

    header: {
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    content: {
        //top: 100,
        width: '100%',
        height: '100%',

    },

    animeDetailsSize: {

    },

    animeInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 'auto',
        marginHorizontal: 'auto',
    },

    animeHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },

    animeTitle: {
        textAlign: 'left',
        fontFamily: fonts.heading,
        fontSize: 24,
        flexWrap: 'wrap',
        width: '70%',
        color: colors.white,
        lineHeight: 27
    },

    animeEpisodes: {
        fontFamily: fonts.heading,
        fontSize: 16,
        color: colors.white,
        right: 0
    },

    animeYear: {
        fontFamily: fonts.text,
        textAlign: 'left',
        fontSize: 16,
        lineHeight: 18,
        paddingBottom: 8,
        color: colors.white
    },

    animeActions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 8
    },

    animeImage: {
        width: 160,
        height: 230,
        alignSelf: 'center'
    },

    animeContent: {
        backgroundColor: 'black',
        justifyContent: 'space-between',
        width: '100%',
        padding: 20,
    },

    backgroundGradient: {
        height: '100%',
        width: '100%',
    },

    animeGenres: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        marginBottom: 4
    },

    animeGenresTitle: {
        fontFamily: fonts.heading,
        fontSize: 15,
        color: colors.blue,
    },

    animeGenresValue: {
        fontFamily: fonts.text,
        fontSize: 14,
        flexWrap: 'wrap',
        color: colors.white
    },

    animeDescription: {
        fontFamily: fonts.text,
        fontSize: 16,
        lineHeight: 18,
        height: 'auto',
        flexWrap: 'wrap',
        marginTop: 10,
        color: colors.white
    },

    animeDescriptionTitle: {
        fontFamily: fonts.heading,
        color: colors.blue,
        fontSize: 18
    },

    animeListTitle: {
        fontSize: 18,
        fontFamily: fonts.heading,
        marginTop: 18,
        color: colors.white
    },

    animeListSubtitle: {
        fontSize: 18,
        fontFamily: fonts.heading,
        color: colors.blue,
        lineHeight: 22,
        marginBottom: 10
    },

    episodeListContainer: {
        padding: 12,
        borderTopColor: colors.shape,
        borderBottomColor: colors.shape,
        borderBottomWidth: 1,
    },

    episodeList: {
        fontFamily: fonts.text,
        fontSize: 16,
        color: colors.white
    },

    allEpisodesList: {
        flexDirection: 'column'
    },

    episodesHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    episodesOrder: {
        flexDirection: 'row',

    },

    episodesText: {
        fontFamily: fonts.heading,
        color: colors.blue,
        fontSize: 16,
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
    },

    activeEpisode: {
        color: colors.blue,
        fontFamily: fonts.heading
    },

    disableEpisode: {
        color: colors.red,
        fontFamily: fonts.heading,
        backgroundColor: colors.red
    }
})