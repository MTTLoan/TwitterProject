import { MongoClient, Db, Collection } from 'mongodb'
//liên kết đến file .env
import { config } from 'dotenv'
config()
import User from '~/models/schemas/User.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schema'

const uri = `mongodb+srv://${process.env.DB_USENAME}:${process.env.DB_PASSWORD}@tweetprj.5o14tur.mongodb.net/?retryWrites=true&w=majority`

class DatabaseService {
  private client: MongoClient
  private db: Db

  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME) //để ko phải gõ db(process.env.DB_NAME) nhiều lần
  }

  async connect() {
    try {
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log('lỗi trong qt kết nối đến mongodb', error)
      throw error
    }
  }
  //accessor property
  //định nghĩa Collection<User> để khi dùng tự gender ra thuộc tính users
  get users(): Collection<User> {
    return this.db.collection(process.env.DB_USERS_COLLECTION as string) //chắc chắn là string
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_REFRESH_TOKENS_COLLECTION as string) //chắc chắn là string
  }
}

//tạo object và export object này ra ngoài để trong quá trính sử dụng
//thì chỉ cần gọi đến object này mà không cần phải tạo object mới
const databaseService = new DatabaseService()
export default databaseService
