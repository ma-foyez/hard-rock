//Input field and search button
const inputSong = document.getElementById("inputSong");
const searchSong = document.getElementById("search-button");
const fancyResult = document.getElementById("fancy-result");
const singleLyrics = document.getElementById("single-lyrics");
const lyricsContainer = document.getElementById("lyrics");
const lyricsTitle = document.querySelector("#single-lyrics h2");

/// api URL ///
const apiURL = 'https://api.lyrics.ovh';
let Album = {};

//search lyrcis with click button
searchSong.addEventListener("click", function() {
    inputFunction();
});

//search lyrcis with keyboard enter key
inputSong.addEventListener('keypress', setQuery);

function setQuery(event) {
    if (event.keyCode == 13) {
        inputFunction();
    }
}

// search input functionality
function inputFunction() {
    if (inputSong.value == "") {
        alert("Please enter a song name");
    } else {
        fancyResult.innerHTML = "";
        fetchMusic(inputSong.value);
        toggleElement(singleLyrics, fancyResult);
        Album.inputSong = inputSong.value;
        inputSong.value = "";
    }
}
//Load lyrics from api
async function loadSongByTitle(searchValue) {
    const res = await fetch(`${apiURL}/suggest/${searchValue}`);
    const data = await res.json();
    return data;
}

//display data
function fetchMusic(searchValue) {
    const lyrics = loadSongByTitle(searchValue);
    lyrics.then((lyrics) => {
        const musicList = lyrics.data;
        for (let i = 0; i < 10; i++) {
            const lyricsElement = musicList[i];
            const ID = lyricsElement.id;
            const artistName = lyricsElement.artist.name;
            const songTitle = lyricsElement.title;
            const audio = lyricsElement.preview;
            Album.cover = lyricsElement.album.cover;
            Album.songLink = lyricsElement.link;
            fancyResult.innerHTML += `
            <div class="single-result row align-items-center my-3 p-3">
                <div class="col-md-3">
                <img src = '${Album.cover}' alt='cover' >
            </div>
             <div class="col-md-6 text-center">
                <h3 class="lyrics-name">${songTitle}</h3>
                <p class="author lead">Album by <span>${artistName}</span></p>
                <audio controls class="audioPlay">
                    <source src='${audio}' type="audio/ogg">
                 </audio>
            </div>
            <div class="col-md-3 text-md-right text-center">
                <button onclick="getLyrics('${artistName}','${songTitle}')" id="${ID}" class="btn btn-success getLyrics">Get Lyrics</button>
            </div>
        </div>`;
        }
    });
}

//Load lyrics
async function loadLyrics(artistName, title) {
    const res = await fetch(`${apiURL}/v1/${artistName}/${title}`);
    const data = await res.json();
    return data;
}

//getLyrics by artist name and lyrics title
function getLyrics(artistName, title) {
    toggleElement(fancyResult, singleLyrics);
    const lyrics = loadLyrics(artistName, title);
    const hearSongButton = document.getElementById("hear-song");
    let albumCover = document.getElementById("albumCover");

    lyrics.then((lyric) => {

        if (lyric.lyrics) {
            lyricsContainer.innerHTML = lyric.lyrics;
            albumCover.src = Album.cover;
            hearSongButton.href = Album.songLink;
        } else {
            lyricsContainer.innerHTML = "Sorry! Lyrics is not available at the moment.";
            albumCover.src = "";
        }
        const goBack = document.querySelector(".btn.go-back");
        goBack.onclick = function() {
            fancyResult.innerHTML = "";
            fetchMusic(Album.songInput);
            toggleElement(singleLyrics, fancyResult);
        };

        lyricsTitle.innerHTML = title + " - " + artistName;
    });
}

//change display state
function toggleElement(hideElement, displayElement) {
    hideElement.style.display = "none";
    displayElement.style.display = "block";
}