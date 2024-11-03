import { MongoClient, Db } from "mongodb"
import dotenv from "dotenv-extended"

dotenv.load()

if(!process.env.DATABASE){
    console.log("DATABASE CONFIG NOT FOUND AT .env")
    process.exit()
}

export const Client: MongoClient = new MongoClient(process.env.DATABASE)

export const DB: Db = Client.db("Gogoanime")