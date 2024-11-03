import { DB } from "../db/connection";
import type { anime_documents } from "./types";

export async function insertAnime(data: anime_documents){
    const anime_collections = DB.collection("anime_collections")
    await anime_collections.insertOne(data)
}