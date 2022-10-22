
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAnime, getEpisodesPerCategory, getLastAnimes, getPopularAnimes, handleNextEpisode, handlePreviousEpisode, searchEpisodes } from '../services/api';
import { getEpisode, getAllEpisodes } from './../services/api';

export interface Episode {
  title?: string,
  video_id: string,
  category_id: string,
  category_name: string,
  category_image: string,

}[]

export interface PopularAnime {

  id: string,
  category_name: string,
  category_image: string,

}[]

export interface Anime {

  id: string,
  category_name: string,
  category_image: string,

}[]

export interface Stream {
  video_id: string,
  category_id: string,
  location: string,
  locationsd: string,
  locationhd: string,
  title: string
}[]

export interface StreamSave {
  video_id: string,
  category_id: string,
  location: string,
  locationsd: string,
  locationhd: string,
  title: string,
  duration: number,
  maxDuration: number,
  watched: boolean
}

export interface AnimeDetails {
  id: string,
  category_name: string,
  category_image: string,
  category_description: string,
  category_genres: string,
  ano: string,
  count: string,
  off: string,
}[]

export interface AnimeDetailsStorage {
  [index: number]: {
    id: string,
    category_name: string,
    category_image: string,
    category_description: string,
    category_genres: string,
    ano: string,
    count: string,
    off: string,
  }
}[]

export interface AllEpisodes {
  video_id: string,
  category_id: string,
  title: string,
  total: number
}[]

export async function loadRecentAnimes(): Promise<Episode[] | undefined> {
  try {

    const { data } = await getLastAnimes;
    return data;


  } catch (Error) {
    console.log(Error)
  }

}

export async function loadPopularAnimes(): Promise<PopularAnime[] | undefined> {
  try {

    const popularAnimes = await getPopularAnimes;
    const recentPopular: PopularAnime[] = popularAnimes.data as PopularAnime[];

    return recentPopular;


  } catch (Error) {
    console.log(Error)
  }

}

export async function loadEpisode(id: string): Promise<Stream | undefined> {
  try {

    const episode = await getEpisode(id);
    const epidosdeDetails: Stream = episode.data[0] as Stream;
    console.log(epidosdeDetails)
    return epidosdeDetails;


  } catch (Error) {
    console.log(Error)
  }

}

export async function loadAnime(id: string): Promise<AnimeDetails | undefined> {
  try {

    const getAnimeDetails = await getAnime(id);
    const animeDetails: AnimeDetails = getAnimeDetails.data[0] as AnimeDetails;

    return animeDetails;


  } catch (Error) {
    console.log(Error)
  }

}

export async function loadAllEpisodes(id: string): Promise<AllEpisodes[] | undefined> {
  try {

    const getEpisodes = await getAllEpisodes(id);
    const episodes: AllEpisodes[] = getEpisodes.data as AllEpisodes[];

    return episodes;


  } catch (Error) {
    console.log(Error)
  }

}

export async function getNextEpisode(id: string, animeId: string): Promise<Stream | undefined> {
  try {

    const getEpisode1 = await handleNextEpisode(id, animeId);
    const episode: Stream = getEpisode1.data[0] as Stream;

    return episode;


  } catch (Error) {
    console.log(Error)
  }

}

export async function getPrevEpisode(id: string, animeId: string): Promise<Stream | undefined> {
  try {

    const getEpisode2 = await handlePreviousEpisode(id, animeId);
    const episode: Stream = getEpisode2.data[0] as Stream;

    return episode;


  } catch (Error) {
    console.log(Error)
  }

}

export async function loadEpisodesPerCategory(category: string): Promise<Anime[] | undefined> {
  try {

    const getEpisodes = await getEpisodesPerCategory(category);
    const episodes: Anime[] = getEpisodes.data as Anime[];

    return episodes;


  } catch (Error) {
    console.log(Error)
  }

}

export async function loadResultsOfSearch(name: string): Promise<Anime[] | undefined> {
  try {

    const getEpisodes = await searchEpisodes(name);
    const episodes: Anime[] = getEpisodes.data as Anime[];

    return episodes;


  } catch (Error) {
    console.log(Error)
  }

}

export async function saveEpisodeState(duration: number, maxDuration: number, episode: StreamSave) {
  console.log('Salvando...')
  const durationEpisodeWatched = Math.round(duration / maxDuration * 100);
  const saveEpisode = {
    video_id: episode?.video_id,
    category_id: episode?.category_id,
    location: episode?.location,
    locationsd: episode?.locationsd,
    locationhd: episode?.locationhd,
    title: episode?.title,
    duration: duration,
    maxDuration: maxDuration,
    watched: durationEpisodeWatched >= 80 ? true : false,
  } as StreamSave;

  try {
    const data = await AsyncStorage.getItem('@animex:' + episode?.category_id);
    const oldFavorites: any = data ? (JSON.parse(data) as StreamSave) : {};

    if (oldFavorites && saveEpisode != null) {
      //console.log("Antigos salvamentos: ", oldFavorites)
      var newFavorite = [];

      if (oldFavorites[0]) {
        //console.log('é uma lista', oldFavorites[0])
        oldFavorites.map((item: StreamSave, index: number) => {
          if (item.video_id == saveEpisode.video_id) {
            oldFavorites.slice(2, index)
          } else {
            newFavorite.push(item)
          }

          //console.log("Itens do array: ", item)
        })

        newFavorite.push(saveEpisode)
      } else {
        if (oldFavorites.video_id == saveEpisode.video_id) {
          newFavorite.push(saveEpisode)
        } else {
          if (oldFavorites.video_id) {
            newFavorite.push(oldFavorites)
          }
          newFavorite.push(saveEpisode)
        }
      }



      //console.log(' existia', oldFavorites)
      await AsyncStorage.setItem('@animex:' + episode?.category_id, JSON.stringify(newFavorite));

    } else {
      await AsyncStorage.setItem('@animex:' + episode?.category_id, JSON.stringify(saveEpisode))
    }

  } catch (Error) {
    console.log(Error)
  }
}

export async function loadEpisodeWatched(episode: string) {

  try {
    const data = await AsyncStorage.getItem('@animex:' + episode);
    const episodesState: any = data ? (JSON.parse(data) as StreamSave) : {};
    // var watched = undefined;
    // if (episodesState[0]) {

    //     episodesState.map((item: StreamSave) => {
    //         if (item.video_id == episode?.video_id) {
    //             watched = item.watched
    //         }
    //         console.log(item, episode)
    //     })

    // }

    return episodesState
  } catch (Error) {
    console.log(Error)
  }
}