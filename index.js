const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');
const environment = require('./helpers/environment');
const data = require('./lib/data');

// app object - module scaffolding
const app = {};

data.create('test', 'myFile', { name: 'Bangladesh', language: 'Bangla' }, (err) => {
    console.log('error', err);
});
 
//   data.read('test', 'newFile', (err, result) => {
//     console.log(err, result);
//   });

//   data.update('test', 'newFile', { name: 'England', language: 'english' }, (err) => {
//     console.log(err);
//   });
  
// data.delete('test', 'newFile', (err) => {
//     console.log(err);
//   });
  
  
 
// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environment.port, () => {
        // console.log(`environment variable is ${process.env.NODE_ENV}`);
        console.log(`listening to port ${environment.port}`);
    });
};

// handle Request Response
app.handleReqRes = handleReqRes;

// start the server
app.createServer();
