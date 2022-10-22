import React, { useEffect, useState } from 'react';
import {
    FlatList,
    NativeEventEmitter,
    NativeSyntheticEvent,
    ScrollView,
    StyleSheet,
    Text,
    TextInputKeyPressEventData,
    TextInputSubmitEditingEventData,
    View,

} from 'react-native';


import colors from '../styles/colors';
import fonts from '../styles/fonts';

import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { MaterialIcons } from '@expo/vector-icons';
import { CardAnimePrimary } from '../components/CardAnimePrimary';
import { Anime, loadPopularAnimes, loadRecentAnimes, loadResultsOfSearch, PopularAnime } from '../libs/storage';
import { Episode } from './../libs/storage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/core';
import { SearchBar } from '../components/SearchBar';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../services/api';

export function Home() {

    const [recentAnimes, setRecentAnimes] = useState<Episode[]>();
    const [popularAnimes, setPopularAnimes] = useState<PopularAnime[]>();

    const [isSearching, setIsSearching] = useState(false);

    const navigator = useNavigation();

    const [searchResults, setSearchResults] = useState<Anime[]>();
    //const [disableBackgroundButtons, setDisableBackgroundButtons] = useState(false);

    useEffect(() => {


        async function getRecentAnimes() {
            try {
                const { data } = await api.get(`?latest`);
                console.log(data)

                setRecentAnimes(data);

            } catch (Error) {
                console.log(Error)
            }
        }



        async function getPopularAnimes() {
            try {
                const animes = await loadPopularAnimes();
                setPopularAnimes(animes);
            } catch (Error) {
                console.log(Error)
            }
        }

        getRecentAnimes();
        getPopularAnimes();

    }, [])

    async function findSearchResults(searchText: string) {
        const search = searchText.normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, '_').toLowerCase();
        try {
            const animes = await loadResultsOfSearch(search);
            const animeResult: Anime[] = animes as Anime[];
            setSearchResults(animeResult);
        } catch (Error) {
            console.log(Error)
        }
    };

    function handleSearch(search: NativeSyntheticEvent<TextInputSubmitEditingEventData>) {
        const searchText: string = search.nativeEvent.text as string;
        navigator.navigate('SearchResultsView', { searchText })
    }

    function handleChangeSearch() {
        setSearchResults(undefined)
        setIsSearching(!isSearching)
    }

    function handleListView() {
        navigator.navigate('AnimeListView');
    }

    function handleAnimeView(id: string, animeId: string) {
        navigator.navigate('AnimeDetailsView', { id, animeId })
    }

    return (
        <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={false} style={{ backgroundColor: 'black' }}>
            <StatusBar backgroundColor={colors.red} translucent />
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    {
                        isSearching ?
                            <>
                                <View style={styles.headerSearchbar}>
                                    <SearchBar
                                        returnKeyType="search"
                                        onSubmitEditing={handleSearch}
                                        onChangeText={findSearchResults}
                                    />
                                    <TouchableOpacity onPress={handleChangeSearch}>
                                        <MaterialIcons
                                            name='close'
                                            size={24}
                                            style={styles.closeIcon}
                                        />
                                    </TouchableOpacity>
                                </View>
                                {
                                    searchResults ?
                                        <View style={styles.headerResults}>
                                            <FlatList
                                                data={searchResults}
                                                showsVerticalScrollIndicator={false}
                                                renderItem={(item) => (
                                                    <TouchableOpacity onPress={() => { handleAnimeView('', item.item.id) }}>
                                                        <Text style={styles.headerResultsText}>{item.item.category_name}</Text>
                                                    </TouchableOpacity>
                                                )}
                                            />
                                        </View> : <View></View>
                                }

                            </>

                            :
                            <>
                                <Text style={styles.headerTitle}>AnimeX</Text>

                                <MaterialIcons
                                    style={styles.headerSearch}
                                    name="search"
                                    size={24}
                                    color={colors.white}
                                    onPress={handleChangeSearch}
                                />

                            </>
                    }
                </View>

                <View style={styles.recentAnimes}>
                    <View>
                        <Text style={styles.recentAnimesTitle}>Postados</Text>
                        <Text style={styles.recentAnimesSubtitle}>recentemente</Text>
                    </View>


                    <TouchableOpacity onPress={handleListView}>
                        <Text style={styles.recentAnimesMore}>Ver em lista</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.recentAnimesView}>
                    <FlatList
                        data={recentAnimes}
                        keyExtractor={(item, index) => item.video_id}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => {
                            return (
                                <TouchableOpacity
                                    //disabled={disableBackgroundButtons} 
                                    onPress={() => handleAnimeView(item.video_id, item.category_id)}
                                >
                                    <CardAnimePrimary
                                        title={String(item?.category_name)}
                                        cape={String(item?.category_image)}
                                        style={styles.animeMargin}
                                    />
                                </TouchableOpacity>
                            )
                        }}
                        //keyExtractor={item => String(item?.category_id)}
                        horizontal

                    />
                </View>


                <View style={styles.popularAnimes}>
                    <View>
                        <Text style={styles.popularAnimesTitle}>Mais</Text>
                        <Text style={styles.popularAnimesSubtitle}>Populares</Text>
                    </View>
                </View>

                <View style={styles.recentAnimesView}>
                    <FlatList
                        data={popularAnimes}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                //disabled={disableBackgroundButtons} 
                                onPress={() => handleAnimeView('', item.id)}
                            >
                                <CardAnimePrimary
                                    title={String(item?.category_name)}
                                    cape={String(item?.category_image)}
                                    style={styles.animeMargin}
                                />
                            </TouchableOpacity>

                        )}
                    />

                </View>


            </SafeAreaView>
        </ScrollView>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },

    header: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'center',
    },

    headerTitle: {
        fontFamily: fonts.heading,
        color: colors.white,
        fontSize: 24,
        textAlign: 'center',
        alignItems: 'center'
    },

    headerSearch: {
        left: 125
    },

    recentAnimes: {
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 5
    },

    recentAnimesTitle: {
        fontFamily: fonts.heading,
        color: colors.blue,
        fontSize: 28,
    },

    recentAnimesSubtitle: {
        fontFamily: fonts.heading,
        color: colors.white,
        fontSize: 28,
        lineHeight: 30
    },

    recentAnimesMore: {
        color: colors.blue,
        fontFamily: fonts.heading

    },

    recentAnimesView: {
        paddingVertical: 5,
        paddingHorizontal: 20,
        flexDirection: 'row'
    },

    popularAnimes: {
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 5
    },

    popularAnimesTitle: {
        fontFamily: fonts.heading,
        color: colors.white,
        fontSize: 28
    },

    popularAnimesSubtitle: {
        fontFamily: fonts.heading,
        color: colors.blue,
        fontSize: 28,
        lineHeight: 30
    },

    popularAnimesMore: {
        color: colors.blue,
        fontFamily: fonts.heading

    },

    searchBarContainer: {
        backgroundColor: 'black',
        width: '100%',
        borderRadius: 32,
        paddingHorizontal: 16,

    },

    searchBarContainerText: {

    },

    searchBarText: {
        color: colors.white
    },

    headerSearchbar: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    closeIcon: {
        marginLeft: 12,
        elevation: 1,
        color: colors.white
    },

    headerResults: {
        position: 'absolute',
        width: '90%',
        paddingTop: 30,
        paddingBottom: 10,
        paddingHorizontal: 20,
        backgroundColor: '#1b1b1b',
        marginTop: 50,
        left: 20,
        elevation: 1,
        borderBottomStartRadius: 16,
        borderBottomEndRadius: 16,
        height: 'auto',
        maxHeight: 600

    },

    headerResultsText: {
        fontFamily: fonts.text,
        color: colors.white,
        borderBottomColor: colors.shape,
        borderBottomWidth: 1,
        paddingVertical: 10,
        flexWrap: 'wrap',
        width: '100%'
    },

    animeMargin: {
        marginRight: 12
    }


})