import 'dotenv/config'

// 環境変数
export const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:3000'
export const FILE_SERVER_URL = process.env.FILE_SERVER_URL || 'http://localhost:8080'
export const PORT = parseInt(process.env.PORT || '8000', 10)
