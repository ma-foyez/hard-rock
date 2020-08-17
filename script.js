//Input field and search button
const inputSong = document.getElementById("inputSong");
const searchSong = document.getElementById("search-button");
const fancyResult = document.getElementById("fancy-result");
const singleLyrics = document.getElementById("single-lyrics");
const lyricsContainer = document.getElementById("lyrics");
const lyricsTitle = document.querySelector("#single-lyrics h2");

/// api URL ///
const apiURL = 'https://api.lyrics.ovh';
let extraInfo = {};

//search song with click button
searchSong.addEventListener("click", function() {
    emptyInput();
});

//search song with keyboard enter key
searchSong.addEventListener('keypress', setQuery);

function setQuery(event) {
    if (event.keyCode == 13) {
        emptyInput();
    }
}
// search empty input functionality
function emptyInput() {
    if (inputSong.value == "") {
        alert("Please enter a song name");
    } else {
        fancyResult.innerHTML = "";
        fetchMusic(inputSong.value);
        toggleElement(singleLyrics, fancyResult);
        extraInfo.inputSong = inputSong.value;
        inputSong.value = "";
    }
}
//Load lyrics from api
async function loadSongByTitle(searchValue) {
    const res = await fetch(`${apiURL}/suggest/${searchValue}`);
    const data = await res.json();
    return data;
}

//display data into html body
function fetchMusic(searchValue) {
    const lyrics = loadSongByTitle(searchValue);
    lyrics.then((lyrics) => {
        const musicList = lyrics.data;
        for (let i = 0; i < musicList.length; i++) {
            const lyricsElement = musicList[i];
            const albumName = lyricsElement.album.title;
            const artistName = lyricsElement.artist.name;
            const title = lyricsElement.title;
            extraInfo.cover = lyricsElement.album.cover;
            extraInfo.songLink = lyricsElement.link;

            fancyResult.innerHTML += `<div class="single-result row align-items-center my-3 p-3">
                                <div class="col-md-3">
                                    <img src = '${extraInfo.cover}' alt='cover' >
                                </div>
                                <div class="col-md-6">
                                    <h3 class="lyrics-name">${title}</h3>
                                    <p class="author lead">Album by <span>${artistName}</span></p>
                                </div>
                                <div class="col-md-3 text-md-right text-center">
                                    <button onclick="getLyrics('${artistName}','${title}')" class="btn btn-success">Get Lyrics</button>
                                </div>
                                </div>`;
            if (i === 9) {
                break;
            }
        }
    });
}

//Load lyrics
async function loadLyrics(artistName, title) {
    const res = await fetch(`${apiURL}/v1/${artistName}/${title}`);
    const data = await res.json();
    return data;
}

//getLyrics by artistName and title
function getLyrics(artistName, title) {
    toggleElement(fancyResult, singleLyrics);
    const lyrics = loadLyrics(artistName, title);
    const hearSongButton = document.getElementById("hear-song");
    let albumCover = document.getElementById("albumCover");

    lyrics.then((lyric) => {
        if (lyric.lyrics) {
            lyricsContainer.innerHTML = lyric.lyrics;
            albumCover.src = extraInfo.cover;
            hearSongButton.href = extraInfo.songLink;
        } else {
            lyricsContainer.innerHTML = "Sorry! Lyrics not available.";
            albumCover.src = "";
        }
        //=======
        document.getElementById('go-back').addEventListener('click', function() {
                fancyResult.innerHTML = "";
                fetchMusic(extraInfo.inputSong);
                toggleElement(singleLyrics, fancyResult);
                console.log("clicked by song")
            })
            //===========
            //     const goToButton = document.querySelector(".go-back");
            //     goToButton.onclick = function() {
            //         fancyResult.innerHTML = "";
            //         fetchMusic(extraInfo.inputSong);
            //         toggleElement(singleLyrics, fancyResult);
            //     };

        //     lyricsTitle.innerHTML = title + " - " + artistName;
    });
}

//change Element display state
function toggleElement(hideElement, displayElement) {
    hideElement.style.display = "none";
    displayElement.style.display = "block";
}