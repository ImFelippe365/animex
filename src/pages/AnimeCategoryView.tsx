import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import fonts from '../styles/fonts';
import colors from '../styles/colors';
import { Anime, loadEpisodesPerCategory } from '../libs/storage';

import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/core';
import { Load } from '../components/Load';

interface Params {
    index: number,
    animeCategory: string
}

export function AnimeCategoryView() {

    const route = useRoute();
    const { index, animeCategory } = route.params as Params;
    const navigator = useNavigation();

    const [episodes, setEpisodes] = useState<Anime[]>();
    const [loading, setLoading] = useState(true);

    const categories: string[] = [
        'aventura',
        'acao',
        'comedia',
        'drama',
        'dublado',
        'ecchi',
        'escolar',
        'esporte',
        'fantasia',
        'filme',
        'harem',
        'historico',
        'jogo',
        'josei',
        'magia',
        'mecha',
        'militar',
        'misterio',
        'ova',
        'poderes',
        'psicologico',
        'romance',
        'samurai',
        'sci-fi',
        'seinen',
        'shoujo',
        'shounen',
        'slice_of_life',
        'sobrenatural',
        'suspense',
        'terror',
        'yaoi',
        'yuri',
    ];

    function handleAnimeView(animeId: string) {
        navigator.navigate('AnimeDetailsView', { animeId })
    }

    useEffect(() => {
        async function getCategoryAnimes() {
            const episodes = await loadEpisodesPerCategory(categories[index]);
            const recentEpisodes: Anime[] = episodes as Anime[];

            setEpisodes(recentEpisodes);
            setLoading(false);
        }

        getCategoryAnimes();
    }, [])
    if (loading)
        return <Load />
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
                <Text style={styles.recentAnimesTitle}>Categoria: </Text>
                <Text style={styles.recentAnimesSubtitle}>{animeCategory}</Text>
            </View>

            <FlatList
                data={episodes}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => (handleAnimeView(item.id))} style={styles.episodeListContainer}>
                        <Image
                            source={{
                                uri: "https://cdn.appanimeplus.tk/img/" + item.category_image, headers: {
                                    "User-Agent": "Mozilla/5.0 (Linux; Android 5.1.1; SM-G928X Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.83 Mobile Safari/537.36"
                                }
                            }}
                            style={styles.animeImage}
                        />
                        <Text style={styles.episodeList}>{item.category_name}</Text>
                        <Text style={styles.trace}></Text>

                    </TouchableOpacity>
                )}

            />

        </View>

    )

}

const styles = StyleSheet.create({

    container: {
        padding: 20,
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
        fontSize: 18,
        color: colors.white,
        paddingHorizontal: 24,
        flexWrap: 'wrap',
        width: 250,
        lineHeight: 22
    },

    recentAnimesContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
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
    }

})