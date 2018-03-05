const socket = io();

socket.on('connect', function() {
    console.log('Connected to SERVER');
});

socket.on('disconnect', function() {
    console.log('Disconnected from SERVER')
});

socket.on('WELCOME_MESSAGE', function(msg) {
    const h = document.createElement("H4"); // <H3> tag
    const welcome = document.createTextNode(
        `${msg.contents} (socket id: ${msg.id} )`
    );
    h.appendChild(welcome);
    document.getElementById("welcome-message").appendChild(h);
});

// listening to BROADCAST_MESSAGE event from server
socket.on('RECEIVE_MESSAGE', function(msg) {
    const li = document.createElement("LI"); // <LI> tag
    const chat = document.createTextNode(
        `${msg.from}: ${msg.contents} (post-time: ${msg.timestamp})`
    );
    li.appendChild(chat);
    document.getElementById("chat-window").appendChild(li);
});

function submitForm() {
    const user = document.forms["message-form"]["user"].value;
    const message = document.forms["message-form"]["message"].value;
    socket.emit('POST_MESSAGE', {
        from: user,
        contents: message
    });

    // clear the textarea
    document.forms["message-form"]["message"].value = '';

    return false; // do not submit the form to the server (no reloading the page)
}