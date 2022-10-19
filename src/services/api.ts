import axios from 'axios';

export const getLastAnimes = axios({
    url: 'https://appanimeplus.tk/api-animesbr-10.php?latest',
    method: 'GET',
    headers: {
        "User-Agent": "Mozilla/5.0 (Linux; Android 5.1.1; SM-G928X Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.83 Mobile Safari/537.36"
    }
})

export const getPopularAnimes = axios({
    url: 'https://appanimeplus.tk/api-animesbr-10.php?populares',
    method: 'GET',
    headers: {
        "User-Agent": "Mozilla/5.0 (Linux; Android 5.1.1; SM-G928X Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.83 Mobile Safari/537.36"
    }
})

export function getEpisode(id: string) {

    

    

    const r = Math.floor(Math.random() * 90000) + 10000; // numero de 5 digitos aleatório
    const time = ((Date.now() / 1000) * 2) // é basicamente o valor quando vc dividir o token pelo r
    const token = (time * r).toFixed() // token ( token / r = time => token  = time * r )

    console.log(time, r, token)
    console.log(`?episodios=433311&token=${token}=&r=${r}`)


    const auth = axios({
        url: `https://auth.appanimeplus.tk/v7.php`,
        method: 'POST',
        data: '../assets/data/file.dat',
        headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 5.1.1; SM-G928X Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.83 Mobile Safari/537.36",
            "Content-Type": "application/octet-stream",
            
        }
    })
    console.log("AUTH: ", auth)
    const getEpisodeDetails = axios({
        url: `https://appanimeplus.tk/meuanimetv-40.php?episodios=${id}&token=${token}=&r=${r}`,
        // url: 'https://appanimeplus.tk/api-animesbr-10.php?episodios=' + id + `?episodios=433311&token=${token}=&r=${r}`,
        method: 'GET',
        headers: {
            'X-Auth': "Z@W@HM@CMDUSTDQM@UGNSL`OESNHEWDSRHNOTTHEBEDDBGG@ECBNSENW@LNEDM`OESNHErejCTHMUGNSYL@OTG@BUTSDSfNNFMDHRwHSUT@MUSTDRDSH@MTOJONVOTRDSHEOTMM",
            "User-Agent": "Mozilla/5.0 (Linux; Android 5.1.1; SM-G928X Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.83 Mobile Safari/537.36",
            "Content-Type": "application/octet-stream",
            
        }
    })

    return getEpisodeDetails;
}

export function getAnime(id: string) {

    const getAnimeDetails = axios({
        url: 'https://appanimeplus.tk/api-animesbr-10.php?info=' + id,
        method: 'GET',
        headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 5.1.1; SM-G928X Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.83 Mobile Safari/537.36"
        }
    })

    return getAnimeDetails;
}
export function getAllEpisodes(id: string) {

    const getAnimeDetails = axios({
        url: 'https://appanimeplus.tk/api-animesbr-10.php?cat_id=' + id,
        method: 'GET',
        headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 5.1.1; SM-G928X Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.83 Mobile Safari/537.36"
        }
    })

    return getAnimeDetails;
}

export function handleNextEpisode(id: string, animeId: string) {

    const getEpisode = axios({
        url: `https://appanimeplus.tk/api-animesbr-10.php?episodios=${id}&catid=${animeId}&next`,
        method: 'GET',
        headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 5.1.1; SM-G928X Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.83 Mobile Safari/537.36"
        }
    })

    return getEpisode;
}

export function handlePreviousEpisode(id: string, animeId: string) {

    const getEpisode = axios({
        url: `https://appanimeplus.tk/api-animesbr-10.php?episodios=${id}&catid=${animeId}&previous`,
        method: 'GET',
        headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 5.1.1; SM-G928X Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.83 Mobile Safari/537.36"
        }
    })

    return getEpisode;
}

export function getEpisodesPerCategory(category: string) {

    const getEpisodes = axios({
        url: `https://appanimeplus.tk/api-animesbr-10.php?categoria=${category}`,
        method: 'GET',
        headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 5.1.1; SM-G928X Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.83 Mobile Safari/537.36"
        }
    })

    return getEpisodes;
}

export function searchEpisodes(name: string) {

    const getEpisodes = axios({
        url: `https://appanimeplus.tk/api-animesbr-10.php?search=${name}`,
        method: 'GET',
        headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 5.1.1; SM-G928X Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.83 Mobile Safari/537.36"
        }
    })

    return getEpisodes;
}