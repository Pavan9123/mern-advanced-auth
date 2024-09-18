import express from 'express'
import { connectDB } from './db/connectDB.js'
import authRoutes from './routes/auth.route.js'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from 'path'



const app = express()
const PORT = process.env.PORT || 3000
const __dirname = path.resolve()
// Middle Ware
app.use(express.json());
app.use(cookieParser())


app.use(cors({origin: "http://localhost:5173", credentials: true}))
app.use('/api/auth', authRoutes)

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, '/frontend/dist')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
    })
}

app.listen(PORT, () => {
    connectDB()
    console.log(`server is running in port ${PORT}`)
})
