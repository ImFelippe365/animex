import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    useColorScheme,
    View
} from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import fonts from '../styles/fonts';
import colors from '../styles/colors';
import { Anime, loadResultsOfSearch } from '../libs/storage';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/core';

interface Params {
    searchText: string
}

export function SearchResultsView() {

    const route = useRoute();
    const { searchText }  = route.params as Params;
    const navigator = useNavigation();

    const [searchResults, setSearchResults] = useState<Anime[]>();

    function handleEpisodeView(animeId: string){
        navigator.navigate('AnimeDetailsView', { animeId })
    }
    
    useEffect(() => {
        async function findSearchResults (){
            const search = searchText.normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, '_').toLowerCase();
            try {
                const animes = await loadResultsOfSearch(search);
                const animeResult: Anime[] = animes as Anime[];
                setSearchResults(animeResult);
            } catch (Error) {
                console.log(Error)
            }
            console.log(search)
        };

        findSearchResults();
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
                    <Text style={styles.recentAnimesTitle}>Resultados para a busca:</Text>
                    <Text style={styles.recentAnimesSubtitle}>"{ searchText }"</Text>
                </View>

                

                {/* {
                    episodes?.map<any>(item => 
                    <View style={styles.episodeListContainer}>
                        <Image 
                            source={{uri: "https://cdn.appanimeplus.tk/img/"+item.category_image }} 
                            style={styles.animeImage}
                        />
                        <TouchableOpacity 
                            
                            //onPress={() => (handleEpisodeView(item.video_id, item.category_id))}
                        >
                            <Text style={styles.episodeList}>{ item.title }</Text>
                        </TouchableOpacity>
                    </View> 
                    )
                } */}
                
                <FlatList
                    data={searchResults}
                    renderItem={({item}) => (
                        <View style={styles.episodeListContainer}>
                            <Image 
                                source={{uri: "https://cdn.appanimeplus.tk/img/"+item.category_image, headers: {
                                    "User-Agent": "Mozilla/5.0 (Linux; Android 5.1.1; SM-G928X Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.83 Mobile Safari/537.36"
                                } }} 
                                style={styles.animeImage}
                            />
                            <TouchableOpacity 
                                
                                onPress={() => (handleEpisodeView(item.id))}
                            >
                                <Text style={styles.episodeList}>{ item.category_name }</Text>
                            </TouchableOpacity>
                        </View> 
                    )}

                />
            
            </View>
        
    )

}

const styles = StyleSheet.create({

    container: {
        marginTop: getStatusBarHeight(),
        padding: 20,
        paddingBottom: 0,
        marginBottom: 100,
        backgroundColor: colors.background
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    episodeListContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: colors.shape,
        borderBottomWidth: 1,
        marginBottom: 12,
    },

    episodeList: {
        fontFamily: fonts.semiBold,
        fontSize: 18,
        color: colors.white,
        paddingHorizontal: 24,
        flexWrap: 'wrap',
        width: 250,
        lineHeight: 22,
        backgroundColor: colors.background
    },

    recentAnimesContainer: {
        backgroundColor: colors.background,
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
        height: 85,
        
    }

})