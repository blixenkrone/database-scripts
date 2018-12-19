import express from 'express';
import path from 'path';
// import config from 'config';
import * as userDataController from './controllers/userDataController';
import * as pros from './controllers/isProfessionalController';
import * as cleanup from './controllers/userCleanupController';

cleanup.initiateDelete();

// pros.getDataFromFb();
// const app = express();
// const port = process.env.PORT || 1337;

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, '/dist')))

// const server = app.listen(port, () => {
//     console.log(`Listening on the port ${port}`);
//     // console.log(process.env.NODE_ENV)
// });

// app.get('/', (req, res, next) => {
//     res.send('Lololol')
// })

// // Controllers (route handlers)
// app.get('/:type/:uid', userDataController.get)

// app.get('/api/data', (req, res, next) => {
//     const val = stringGen(20);
//     res.write(val);
//     res.end();
// })

// export = app;
