import { DB } from "../db/connection";
import type { episode_documents } from "./types";

export async function insertAnime(data: episode_documents){
    const episode_collections = DB.collection("episode_collections")
    await episode_collections.insertOne(data)
}