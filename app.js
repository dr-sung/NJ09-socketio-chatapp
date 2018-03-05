const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.set('view engine', 'ejs');
app.set('views', './ejs_views');
app.use(express.urlencoded( {extended: false} ));

const publicPath = __dirname + '/public';

// for references in index.html
app.use('/public', express.static(publicPath));

app.get('/', (req, res) => {
	res.sendFile(publicPath + '/index.html');
})

app.post('/chat', (req, res) => {
    const username = req.body.user;
    if (!username) {
        return res.redirect('/') // not coming via home page: hacker?
    }
    res.render('chat', {username});
})

io.on('connection', (socket) => {
    console.log('New USER connected');

    socket.on('disconnect', () => {
        console.log('USER disconnected');
    })

    // listening to 'post_message' when client posts a new message
    socket.on('POST_MESSAGE', (msg) => {
        // broadcast the received message to all other clients except the sender
        const date = new Date().toLocaleDateString(); // date @server
        const time = new Date().toLocaleTimeString(); // time @server

        // NOTE: use io.emit() to broadcast including the sender
        socket.broadcast.emit('RECEIVE_MESSAGE', {
            from: msg.from,
            contents: msg.contents,
            timestamp: time + ' ' + date
        })

        // echo on the sender's page as 'YOU'
        socket.emit('RECEIVE_MESSAGE', {
            from: 'YOU',
            contents: msg.contents,
            timestamp: time + ' ' + date
        });
    })

});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
})