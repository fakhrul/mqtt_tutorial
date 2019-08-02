function startConnect() {
    clientID = "clientID-" + parseInt(Math.random() * 100);
    host = document.getElementById("host").value;
    port = document.getElementById("port").value;
    document.getElementById("messages").innerHTML += '<span>Connecting to: ' + host + ' on port: ' + port + '</span><br/>';
    document.getElementById("messages").innerHTML += '<span>Using the following client value: ' + clientID + '</span><br/>';
    client = new Paho.MQTT.Client(host, Number(port), clientID);
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    client.connect({
        onSuccess: onConnect,
    });
}

// Called when the client connects
function onConnect() {
    // Fetch the MQTT topic from the form
    topic = document.getElementById("topic").value;

    // Print output for the user in the messages div
    document.getElementById("messages").innerHTML += '<span>Subscribing to: ' + topic + '</span><br/>';

    // Subscribe to the requested topic
    client.subscribe(topic);
}

// Called when the client loses its connection
function onConnectionLost(responseObject) {
    document.getElementById("messages").innerHTML += '<span>ERROR: Connection lost</span><br/>';
    if (responseObject.errorCode !== 0) {
        document.getElementById("messages").innerHTML += '<span>ERROR: ' + + responseObject.errorMessage + '</span><br/>';
    }
}

// Called when a message arrives
function onMessageArrived(message) {
    console.log("onMessageArrived: " + message.payloadString);
    document.getElementById("messages").innerHTML += '<span>Topic: ' + message.destinationName + '  | ' + message.payloadString + '</span><br/>';

    try {
        msgJSON = message.payloadString;
        obj = JSON.parse(msgJSON);
        if (obj['state'] == 1) {
            $('#alert').html("<div class='alert alert-success'>Value = " + obj['value'] + "</div>");
        }
        else
        {
            $('#alert').html("<div class='alert alert-danger'>Value = " + obj['value'] + "</div>");
        }
    }
    catch (error) {
        alert(error);
        console.error(error);
    }

}

// Called when the disconnection button is pressed
function startDisconnect() {
    client.disconnect();
    document.getElementById("messages").innerHTML += '<span>Disconnected</span><br/>';
}

function sendMessage() {
    topic = document.getElementById("topic").value;
    text = document.getElementById("message").value;
    message = new Paho.MQTT.Message(text);
    message.destinationName = topic;
    client.send(message);

}

function sendJsonMessage() {
    topic = document.getElementById("topic").value;
    text = document.getElementById("sensorValue").value;
    message = new Paho.MQTT.Message(text);
    message.destinationName = topic;
    client.send(message);

}