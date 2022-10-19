import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import fonts from '../styles/fonts';
import colors from '../styles/colors';
import { loadRecentAnimes } from '../libs/storage';
import { Episode } from './../libs/storage';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';

export function AnimeListView() {

    const [episodes, setEpisodes] = useState<Episode[]>();
    const navigator = useNavigation();

    function handleEpisodeView(id: string, animeId: string) {
        navigator.navigate('AnimeDetailsView', { id, animeId })
    }

    useEffect(() => {
        async function getRecentAnimes() {
            const episodes = await loadRecentAnimes();
            const recentEpisodes: Episode[] = episodes as Episode[];

            if (recentEpisodes[0].title == 'Aviso Importante AnimeTV!!')
                recentEpisodes.shift();

            setEpisodes(recentEpisodes);
        }

        getRecentAnimes();
    }, [])

    return (

        <View style={styles.container}>

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

            <View style={styles.recentAnimesContainer}>
                <Text style={styles.recentAnimesTitle}>Postados</Text>
                <Text style={styles.recentAnimesSubtitle}>recentemente</Text>
            </View>


            <FlatList
                data={episodes}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.episodesListView}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => (handleEpisodeView(item.video_id, item.category_id))} style={styles.episodeListContainer}>
                        <Image
                            source={{
                                uri: "https://cdn.appanimeplus.tk/img/" + item.category_image, headers: {
                                    "User-Agent": "Mozilla/5.0 (Linux; Android 5.1.1; SM-G928X Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.83 Mobile Safari/537.36"
                                }
                            }}
                            style={styles.animeImage}
                        />
                        <Text style={styles.episodeList}>{item.title}</Text>
                        <Text style={styles.trace}></Text>

                    </TouchableOpacity>
                )}

            />

        </View>

    )

}

const styles = StyleSheet.create({

    container: {
        paddingHorizontal: 20,
        paddingTop: 20,
        backgroundColor: 'black'
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    episodeListContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        padding: 12,
        borderRadius: 12,
        marginBottom: 12
    },

    episodeList: {
        fontFamily: fonts.heading,
        fontSize: 16,
        color: colors.white,
        paddingHorizontal: 24,
        flexWrap: 'wrap',
        width: 250,
        lineHeight: 20
    },

    recentAnimesContainer: {
        alignItems: 'flex-start',
        paddingVertical: 16,
    },

    recentAnimesTitle: {
        fontFamily: fonts.heading,
        color: colors.blue,
        fontSize: 22,
    },

    recentAnimesSubtitle: {
        fontFamily: fonts.heading,
        color: colors.white,
        fontSize: 22,
        lineHeight: 24
    },

    animeImage: {
        width: 75,
        height: 105,

    },

    trace: {
        borderRadius: 12,
        borderRightColor: colors.blue,
        borderRightWidth: 4,
        height: 100
    },

    episodesListView: {
        paddingBottom: 100
    }

})