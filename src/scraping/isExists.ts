import { DB } from "../db/connection";

export async function isExists(id: string){
    const anime_collections = DB.collection("anime_collections")
    const count = await anime_collections.countDocuments({_id: id as any})

    if(count != 0){
        return true
    }
    return false
}