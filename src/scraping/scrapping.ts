import axios from "axios";
import { genres } from "./genres";
import { isExists } from "./isExists";
import { insertGenres } from "./insertGenres";
import type { anime_documents, episode_documents, sources_documents, tracks_documents } from "./types";
import { insertAnime } from "./insertAnime";

export async function scrapping() {
    for (let i = 0; i < genres.length; i++) {
        let iteration = 1;
        let loop = true;
        
        while (loop) {
            console.log(`================================`)
            console.log(`Genre : ${genres[i]}`)
            console.log(`Pages : ${iteration}`)
            const { data } = await axios.get(`https://anime-api.skuy.co.id/api/v2/hianime/genre/${genres[i]}?page=${iteration}`);

            for(let j = 0; j < data.data.animes.length; j++){
                console.log(`================================`)
                console.log(`Processing`)
                console.log(`${data.data.animes[j].name}`)
                if((await isExists(data.data.animes[j].id))){
                    await insertGenres(data.data.animes[j].id, genres[i])
                }
                else{
                    const payload: anime_documents = {
                        _id: data.data.animes[j].id,
                        name: data.data.animes[j].name,
                        jname: data.data.animes[j].jname,
                        poster: data.data.animes[j].poster,
                        duration: data.data.animes[j].duration ? data.data.animes[j].duration : null,
                        type: data.data.animes[j].type ? data.data.animes[j].type : null,
                        rating: data.data.animes[j].rating ? data.data.animes[j].rating : null,
                        genres: [genres[i]],
                        episodes_detail: {
                            sub: data.data.animes[j].episodes.sub ? data.data.animes[j].episodes.sub : null,
                            dub: data.data.animes[j].episodes.dub ? data.data.animes[j].episodes.dub : null
                        },
                        episodes: [],
                    }

                    const getEpisodes = await axios.get(`https://anime-api.skuy.co.id/api/v2/hianime/anime/${data.data.animes[j].id}/episodes`)

                    for(let k = 0; k < getEpisodes.data.data.episodes.length; k++){
                        let getEpisodeSource
                        try{
                            getEpisodeSource = await axios.get(`https://anime-api.skuy.co.id/api/v2/hianime/episode/sources?animeEpisodeId=${getEpisodes.data.data.episodes[k].episodeId}?server=hd-1&category=sub`)
                        }
                        catch{
                            try{
                                getEpisodeSource = await axios.get(`https://anime-api.skuy.co.id/api/v2/hianime/episode/sources?animeEpisodeId=${getEpisodes.data.data.episodes[k].episodeId}?server=hd-1&category=raw`)
                            }
                            catch{
                                try{
                                    getEpisodeSource = await axios.get(`https://anime-api.skuy.co.id/api/v2/hianime/episode/sources?animeEpisodeId=${getEpisodes.data.data.episodes[k].episodeId}?server=hd-1&category=dub`)
                                }
                                catch{
                                    console.log(`https://anime-api.skuy.co.id/api/v2/hianime/episode/sources?animeEpisodeId=${getEpisodes.data.data.episodes[k].episodeId}?server=hd-1&category=dub`)
                                    continue
                                }
                            }
                        }

                        const tracks: tracks_documents[] = []
                        const sources: sources_documents[] = []

                        for(let l = 0; l < getEpisodeSource.data.data.tracks.length; l++){
                            const tracks_payload = {
                                file: getEpisodeSource.data.data.tracks[l].file,
                                kind: getEpisodeSource.data.data.tracks[l].kind,
                                label: getEpisodeSource.data.data.tracks[l].label ? getEpisodeSource.data.data.tracks[l].label : null,
                                default: getEpisodeSource.data.data.tracks[l].default ? getEpisodeSource.data.data.tracks[l].default : null
                            }
                            tracks.push(tracks_payload)
                        }

                        for(let l = 0; l < getEpisodeSource.data.data.sources.length; l++){
                            const sources_payload = {
                                url: getEpisodeSource.data.data.sources[l].url,
                                type: getEpisodeSource.data.data.sources[l].type
                            }

                            sources.push(sources_payload)
                        }

                        const episodes_payloads: episode_documents = {
                            title: getEpisodes.data.data.episodes[k].title,
                            episodeId: getEpisodes.data.data.episodes[k].episodeId,
                            number: getEpisodes.data.data.episodes[k].number,
                            isFiller: getEpisodes.data.data.episodes[k].isFiller,
                            tracks,
                            intro: {
                                start: getEpisodeSource.data.data.intro.start,
                                end: getEpisodeSource.data.data.intro.end
                            },
                            outro: {
                                start: getEpisodeSource.data.data.outro.start,
                                end: getEpisodeSource.data.data.outro.end
                            },
                            malID: getEpisodeSource.data.data.malID,
                            anilistID: getEpisodeSource.data.data.anilistID,
                            sources
                        }

                        payload.episodes.push(episodes_payloads)
                    }
                    
                    try{
                        await insertAnime(payload)
                    }
                    catch(e){
                        console.log((e as Error).message)
                    }
                }
            }

            iteration++
            if(!data.data.hasNextPage){
                loop = false
            }
        }
    }
}
