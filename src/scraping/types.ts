import type { ObjectId } from "mongodb"

export type tracks_documents = {
    file: string,
    kind: string,
    label?: string,
    default?: boolean
}

export type sources_documents = {
    url: string,
    type: string
}

export type episode_documents = {
    title: string,
    episodeId: string,
    number: number,
    isFiller: boolean,
    tracks: tracks_documents[],
    intro: {
        start: number,
        end: number
    },
    outro: {
        start: number,
        end: number
    },
    sources: sources_documents[],
    malID: number,
    anilistID: number
}

export type anime_documents = {
    _id: ObjectId,
    name: string,
    jname: string,
    poster: string,
    duration?: string,
    type?: string,
    rating?: string,
    genres: string[],
    episodes_detail?: {
        dub?: number,
        sub?: number
    },
    episodes: episode_documents[]
}