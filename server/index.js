import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv' 
import multer from 'multer'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/authRoute.js'
import userRoutes from './routes/userRoutes.js'
import postRoutes from './routes/postRoute.js'
import { register } from './controllers/authController.js'
import {createPost} from './controllers/postsController.js'
import { verifyToken } from './middlewares/authMiddlewares.js'
import  User  from './models/UserModel.js'
import Post  from './models/PostModel.js' 
import {users,posts} from './data/index.js'
// middleware smth that runs in between the request and the response
// just a fancy term

/*  Configurations*/

// this is to grab the file url / and specifically when using type module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* 
his line invokes the config() method from the dotenv package, which loads variables from a .env file into the environment. It allows you to store configuration settings in a separate file and access them using process.env.
*/
dotenv.config()

const app = express();

app.use(express.json());
/* 
app.use(helmet()): This line adds the helmet middleware, which sets various HTTP headers to enhance security and protect against common web vulnerabilities.
*/
app.use(helmet());
/* 
This line sets the Cross-Origin Resource Policy (CORP) header using the helmet.crossOriginResourcePolicy() middleware. It allows cross-origin access to resources from any origin.
*/
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
/* 
This line adds the morgan middleware, which logs HTTP requests to the console. The 'common' parameter specifies the log format.
*/
app.use(morgan('common'));
/* 
It parses incoming request bodies in JSON format with a maximum size of 30 megabytes (limit: '30mb') and allows complex JSON payloads (extended: true).
*/
app.use(bodyParser.json({ limit: '30mb', extended: true }));
// same but for  request bodies in URL-encoded format
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
// enables Cross-Origin Resource Sharing (CORS) and allows requests from different origins to access your server's resources.
app.use(cors());
// to se the directory where we keep our assets 
// in a real live production , we would use a  storage / cloud one 
// but this to make it simple
app.use("/assets", express.static(path.join(__dirname, "public/assets")))


/* FILE STORAGE */

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/assets');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const upload = multer({ storage });


/*  ROUTES WITH FILES */
app.post("/auth/register",upload.single("picture"),register); 

app.post('/posts',verifyToken,upload.single("picture"),createPost);

/* ROUTES */

app.use('/auth', authRoutes);

app.use('/users', userRoutes)

app.use('/posts', postRoutes)

/* MONGOOSE SETUP */

const PORT = process.env.PORT || 6001;

mongoose.connect(process.env.MONGO_URL,
    {
        // They ensure that the connection string is parsed correctly and that the new connection management engine, the Unified Topology, is used.
        useNewUrlParser: true, 
        useUnifiedTopology: true
    }).then(() => {
        app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
        /* ADD DATA ONCE HERE */
        // User.insertMany(users);
        // Post.insertMany(posts);
    }).catch(err => console.error(err.message))
    