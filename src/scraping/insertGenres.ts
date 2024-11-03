import { DB } from "../db/connection";
import type { anime_documents } from "./types";

export async function insertGenres(id: string, genre: string){
    const anime_collections = DB.collection("anime_collections")
    const find: anime_documents = (await anime_collections.findOne({_id: id as any})) as unknown as anime_documents
    
    const isExist = find.genres.some((v) => v == genre)

    if(!isExist){
        find.genres.push(genre)
        await anime_collections.updateOne({_id: id as any}, {$set: {genres: find.genres}})
    }
}