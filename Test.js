const express = require('express')
const bodyParser = require('body-parser')
const dialogflow = require('dialogflow')
const { WebhookClient } = require('dialogflow-fulfillment');
const app = express().use(bodyParser.json())
const port = 3000

var admin = require("firebase-admin");

var serviceAccount = require("./config/fir-functions-d34f7-firebase-adminsdk-r3897-71886e43dc.json");
const { database } = require('firebase-admin');

try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://fir-functions-d34f7.firebaseio.com"
      });

      console.log("connected to database");

} catch (error) {
    console.log("Error here" + error);
}

var db = admin.firestore();


app.post('/gethotelname', (req, res) => {
	const cityToSearch =
		req.body.queryResult && req.body.queryResult.parameters && req.body.queryResult.parameters.hotel
			? req.body.result.parameters.hotel
			: ''

	const reqUrl = encodeURI(
		`https://hotels4.p.rapidapi.com/properties/?get-details=${cityToSearch}&apikey=${process.env.API_KEY}`
	)
	http.get(
		reqUrl,
		responseFromAPI => {
			let completeResponse = ''
			responseFromAPI.on('data', chunk => {
				completeResponse += chunk
			})
			responseFromAPI.on('end', () => {
				const hotel = JSON.parse(completeResponse)

				let dataToSend = cityToSearch
				dataToSend = `${hotel.name}`

				return res.json({
					fulfillmentText: dataToSend,
					source: 'get-details'
				})
			})
		},
		error => {
			return res.json({
				fulfillmentText: 'Could not get results at this time',
				source: 'get-details'
			})
		}
	)

    function hotelName(agent) {
        return agent.add(dataToSend);
    }

    var intents = new Map()

      intents.set("get-hotel-location",hotelName)
      _agent.handleRequest(intents)
})

app.post("/webhook", (request, response) => {
    const _agent = new WebhookClient({request: request, response: response});

    function Welcome(agent) {
        return agent.add(`Hello!! I am your hotel booking agent.. How may I hep you ?`);
      }


    function userDetail(agent) {
        var location = agent.context.get("awaiting-location").parameters('geo-city');
        var hotelName = agent.context.get("awaiting-hotel-name");
        var name = agent.context.get("awaiting-name").parameters.person;
        var age = agent.context.get("awaiting-age").parameters.age;
        var email = agent.context.get("awaiting-email").parameters.email;
        var phoneNumber = agent.context.get("awaiting-phno").parameters('phone-number');
        var roomCategory = agent.context.get("awaiting-room-category").parameters('room-category');
        var checkinDate = agent.context.get("awaiting-checkin-date").parameters.date;
        var checkinTime = agent.context.get("awaiting-checkin-time").parameters.time;
        var roomQuantity = agent.context.get("awaiting-room-quantity").parameters.number;


        console.log(name);
        console.log(age);
        console.log(email);
        console.log(phoneNumber);
        console.log(location);
        console.log(hotelName);
        console.log(roomCategory);
        console.log(checkinDate);
        console.log(checkinTime);
        console.log(roomQuantity);

        return db.collection('hotel-booking').add({
            location : location,
            hotelName : hotelName,
            name : name,
            age : age,
            email : email,
            phoneNumber : phoneNumber,
            roomCategory : roomCategory,
            checkinDate : checkinDate,
            checkinTime : checkinTime,
            roomQuantity : roomQuantity
        }).then(ref =>
            console.log("User details added to Database")
            )

    }

      var intents = new Map()

      intents.set("Default Welcome Intent",Welcome)
      intents.set("get-customer-details",userDetail)
      _agent.handleRequest(intents)
})


app.get("/", (req, res) => {
    res.send("Hello from pooja")
})

app.listen(port, () => {
    console.log("Server is listening on port : ", port)
})