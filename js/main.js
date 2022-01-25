
// Denna fil ska innehålla er lösning till projektuppgiften.

"use strict";

/*  Delar till ej obligatorisk funktionalitet, som kan ge poäng för högre betyg
*   Radera rader för funktioner du vill visa på webbsidan. */
//document.getElementById("player").style.display = "none";      // Radera denna rad för att visa musikspelare
document.getElementById("shownumrows").style.display = "none"; // Radera denna rad för att visa antal träffar

/* Här under börjar du skriva din JavaScript-kod */



//Globala variabler
let i; //Variabel som kommer att användas i for-looparna
let channelUrl = "https://api.sr.se/api/v2/channels?format=json&pagination=false"; // Variabel för fetch-requestet
let infoEl = document.getElementById("info"); //Variabel för utskrift till elementet info 
let dataInfo;

//Variabler för tiden
let startHour;
let startMinute;
let stopHour;
let stopMinute
let startDate;
let endDate;
let today = new Date(); //Variabel för ett date object

//Onload-event
window.onload = init;

//Funktion som anropar laddning av kanaler och läser in texten som visas till höger när sidan laddas/laddar om.
function init() {
    loadChannels();
    welcomeText();
}

//Funktion för hämtning av program med fetch-request. Anropar funktionen showChannels. 
function loadChannels() {
    fetch(channelUrl)
        .then((resp) => resp.json())
        .then((data) => {

            let channels = data.channels;
            showChannels(channels)
        })
        .catch((error) => {
            //console.log(error);
        }
        );
}

//Funktion för utskrift av program
function showChannels(channels) {

    //Variabel för utskrift till listan
    let mainNavEl = document.getElementById("mainnavlist");

    
    //Loopar igenom kanaler. Gör en if-sats för att kontrollera om kanalens namn är SR Extra15. Skriver inte ut den kanalen.
    for (let i = 0; i < channels.length; i++) {
        if(channels[i].id != "4868") {
        mainNavEl.innerHTML += "<li id=" + channels[i].id + " title =' " + channels[i].tagline + "'>" + channels[i].name + "</li>";
    }
}
    //Lagrar li-elementen och dess ID i en variabel
    let liEl = document.getElementsByTagName("li");

    //Loopar igenom li och lägger till en eventlistener på li-elementen. Anropas av loadInfo
    for (let i = 0; i < liEl.length; i++) {
        liEl[i].addEventListener("click", loadInfo, false);

    }
}


//Funktion för inladdning av program-info med fetch request
function loadInfo(event) {
    let x = event.target.id;
    let url = "https://api.sr.se/v2/scheduledepisodes?channelid=" + x + "&format=json&pagination=false";
    fetch(url)
        .then((resp) => resp.json())
        .then((data) => {
            //console.log(data.schedule)
            showInfo(data)

        })
        .catch((error) => {
            //console.log(error);
        }
        );
}

//Funktion för att skriva ut tablån
function showInfo(data) {

    //Variabel som ska loopas. 
    dataInfo = data.schedule;



    //Anropar funktionen som tar bort tablån när man byter sida
    restoreList();

    //Loopar igenom tablåerna
    for (i = 0; i < dataInfo.length; i++) {

        //Anropar funktionen som konverterar tiden till rätt format
        timeConverter();

        if (today < endDate) {

            //If-sats för att kontrollera om det finns någon subtitle. Skriver inte ut subtitle om det har värdet null eller undefined
            if (dataInfo[i].subtitle === undefined) {
                infoEl.innerHTML += "<article>" + "<h3>" + dataInfo[i].title + "</h3>" + "<h5>" + startHour + ":" + startMinute + " - " + stopHour + ":" + stopMinute + "</h5>" + "<p>" + dataInfo[i].description + "</p>" + "</article>";

            } else {
                infoEl.innerHTML += "<article>" + "<h3>" + dataInfo[i].title + "</h3>" + "<h4>" + dataInfo[i].subtitle + "</h4>" + "<h5>" + startHour + ":" + startMinute + " - " + stopHour + ":" + stopMinute + "</h5>" + "<p>" + dataInfo[i].description + "</p>" + "</article>";
            }
        }

    }
}

//Funktion för att rensa tablån vid byte av kanal
function restoreList() {
    infoEl.innerHTML = "";
}

//Funktion för att lägga till nollor till tiden.
function addZero(zero) {
    if (zero < 10) {
        zero = "0" + zero;
    }
    return zero;
}

//Funktion för att konvertera tiden till rätt format
function timeConverter() {

    //Konverterar starttiden
    let startTime = dataInfo[i].starttimeutc;
    startDate = new Date(parseInt(startTime.substr(6)));
    startHour = addZero(startDate.getHours());
    startMinute = addZero(startDate.getMinutes());

    //Konverterar sluttiden
    let endTime = dataInfo[i].endtimeutc;
    endDate = new Date(parseInt(endTime.substr(6)));
    stopHour = addZero(endDate.getHours());
    stopMinute = addZero(endDate.getMinutes());
}

//Funktion för att visa text
function welcomeText() {
    infoEl.innerHTML += "<h3>" + "Välkommen till tablåer för Sveriges radio!" + "</h3>" + "<p>" + "Denna Webbapplikation använder Sveriges radios öppna API för tablåer och program. <br> Välj kanal till vänster för att visa tablå för denna kanal. </p>";
}

function showRadio() {

}


