import express from 'express';
import cors from 'cors';
import initRoutes from './src/routes';

require('./connection');

const app = express();
const port = process.env.PORT || 3003;



app.use(cors({
    origin: 'http://localhost:3003',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

initRoutes(app);

// CRUD
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const listener = app.listen(port, () => {
    console.log('Server started at http://localhost:' + listener.address().port);
})

// curl -X POST "http://localhost:3003/hello"