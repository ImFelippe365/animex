import axios from 'axios';

const baseUrl = 'https://appanimeplus.tk/play-api.php?'

export const api = axios.create({
    baseURL: baseUrl,
    headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Linux; Android 5.1.1; SM-G928X Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.83 Mobile Safari/537.36"
    }
})

export const getLastAnimes = axios({
    url: 'https://appanimeplus.tk/play-api.php?latest',
    method: 'GET',
    headers: {
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (Linux; Android 5.1.1; SM-G928X Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.83 Mobile Safari/537.36"
    }
})

export const getPopularAnimes = axios({
    url: 'https://appanimeplus.tk/play-api.php?populares',
    method: 'GET',
    headers: {
        "User-Agent": "Mozilla/5.0 (Linux; Android 5.1.1; SM-G928X Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.83 Mobile Safari/537.36"
    }
})

export function getEpisode(id: string) {

    const getEpisodeDetails = axios({
        url: `https://appanimeplus.tk/play-api.php?episodios=${id}`,
        // url: 'https://appanimeplus.tk/play-api.php?episodios=' + id + `?episodios=433311&token=${token}=&r=${r}`,
        method: 'GET',
        headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 5.1.1; SM-G928X Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.83 Mobile Safari/537.36",
            "Content-Type": "application/octet-stream",

        }
    })

    return getEpisodeDetails;
}

export function getAnime(id: string) {

    const getAnimeDetails = axios({
        url: 'https://appanimeplus.tk/play-api.php?info=' + id,
        method: 'GET',
        headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 5.1.1; SM-G928X Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.83 Mobile Safari/537.36"
        }
    })

    return getAnimeDetails;
}
export function getAllEpisodes(id: string) {

    const getAnimeDetails = axios({
        url: 'https://appanimeplus.tk/play-api.php?cat_id=' + id,
        method: 'GET',
        headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 5.1.1; SM-G928X Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.83 Mobile Safari/537.36"
        }
    })

    return getAnimeDetails;
}

export function handleNextEpisode(id: string, animeId: string) {

    const getEpisode = axios({
        url: `https://appanimeplus.tk/play-api.php?episodios=${id}&catid=${animeId}&next`,
        method: 'GET',
        headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 5.1.1; SM-G928X Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.83 Mobile Safari/537.36"
        }
    })

    return getEpisode;
}

export function handlePreviousEpisode(id: string, animeId: string) {

    const getEpisode = axios({
        url: `https://appanimeplus.tk/play-api.php?episodios=${id}&catid=${animeId}&previous`,
        method: 'GET',
        headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 5.1.1; SM-G928X Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.83 Mobile Safari/537.36"
        }
    })

    return getEpisode;
}

export function getEpisodesPerCategory(category: string) {

    const getEpisodes = axios({
        url: `https://appanimeplus.tk/play-api.php?categoria=${category}`,
        method: 'GET',
        headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 5.1.1; SM-G928X Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.83 Mobile Safari/537.36"
        }
    })

    return getEpisodes;
}

export function searchEpisodes(name: string) {

    const getEpisodes = axios({
        url: `https://appanimeplus.tk/play-api.php?search=${name}`,
        method: 'GET',
        headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 5.1.1; SM-G928X Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.83 Mobile Safari/537.36"
        }
    })

    return getEpisodes;
}