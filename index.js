const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fs = require('fs');

const dom = new JSDOM(fs.readFileSync('test.html'));
const document = dom.window.document;


var details = new Object();
details.price = parseInt(document.querySelector(".\\\"very-important\\\"").innerHTML.trim().split(",")[0]);
details.roundTrips = [];

products = document.querySelectorAll(".\\\"product-details\\\"")
products.forEach(pro => {
    var roundTrip = new Object();
    var train = new Object();
    train.departureTime = pro.querySelector(".\\\"origin-destination-hour").innerHTML.trim().replace('h', ':');
    train.departureStation = pro.querySelector(".\\\"origin-destination-station").innerHTML.trim();
    train.arrivalTime = pro.querySelector("td[origin-destination-hour]").innerHTML.trim().replace('h', ':');
    train.arrivalStation = pro.querySelector("td[origin-destination-station]").innerHTML.trim();
    train.type = pro.querySelector(".\\\"origin-destination-station").nextElementSibling.innerHTML.trim();
    train.number = pro.querySelector(".\\\"origin-destination-station").nextElementSibling.nextElementSibling.innerHTML.trim();
    roundTrip.type = pro.querySelector(".\\\"travel-way\\\"").innerHTML.trim();
    roundTrip.date = pro.previousElementSibling.querySelector(".\\\"product-travel-date\\\"").innerHTML.trim();
    roundTrip.trains = [train];
    details.roundTrips.push(roundTrip);
});


var parentBlockPnrNodes = document.querySelector(".\\\"block-pnr\\\"");
var parentBlockPnr = parentBlockPnrNodes[parentBlockPnrNodes.length - 1];

var trip = new Object();
trip.code = document.querySelector(".\\\"horizontal-separator\\\"").nextElementSibling.nextElementSibling.querySelector(".\\\"pnr-ref\\\"").querySelector("span").innerHTML.trim();
trip.name = document.querySelector(".\\\"horizontal-separator\\\"").nextElementSibling.nextElementSibling.querySelector(".\\\"pnr-name\\\"").querySelector("span").innerHTML.trim().toUpperCase();
trip.details = details;

var res = new Object();
res.status = "ok";
res.trips = [trip];

fs.writeFile("test.json", JSON.stringify(res), function(err) {
    if (err) {
        console.log(err);
    }
});