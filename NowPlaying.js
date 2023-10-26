//---- User Variables ----//
const likeEmoji = "💖";
const url = 'http://192.168.2.12:1025/'; // URL to the WebServer API

const textLength = 24;
const artist = document.getElementById("artist");
const title = document.getElementById("title");
const cover = document.getElementById("cover");
let currentArtist = "";
let currentTitle = "";
let currentCover = "";
let dataArtists = "";
let dataTitle = "";
let dataCover = "";
let currentLiked = false;
let updating = false;
setInterval(function () {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            updating = true;
            if (data.Albums != null && data.Albums.length === 0) {
                dataCover = "/songify/cover.png";
            } else {
                dataCover = data.Albums[0].Url;
            }
            value = data.Title;
            dataArtists = data.Artists;
            dataTitle = data.Title;
            if ((currentCover !== dataCover) && dataCover !== "") {
                updateData(currentCover, dataCover, cover, 2);
            }
            if ((currentArtist !== dataArtists) && dataArtists !== "") {
                updateData(currentArtist, dataArtists, artist, 0);
            }
            if ((currentTitle !== dataTitle) && dataTitle !== "") {
                updateData(currentTitle, dataTitle, title, 1);
            }
            if (currentLiked !== data.IsInLikedPlaylist) {
                updateData(currentLiked, data.IsInLikedPlaylist, liked, 3);
            }
            setScroll();
        })
        .catch(error => console.error(error))
    document.getElementById("canvas").classList.remove("animate__fadeOut");
    document.getElementById("canvas").style.visibility = "visible";
    document.getElementById("canvas").classList.add("animate__fadeIn");
}, 1000);

function updateData(current, data, element, type) {
    let inTransition = "animate__fadeIn"
    let outTransition = "animate__fadeOut"
    switch (type) {
        case 0:
            element = document.getElementById("artist");
            document.getElementById("containerArtist")?.classList.remove(inTransition)
            document.getElementById("containerArtist")?.classList.add(outTransition);
            setTimeout(() =>{
                currentArtist = data;
                element.innerText = data;
                if (data.length > textLength) {
                    element.classList.remove('animation');
                    element.classList.add('animation');
                } else {
                    element.classList.remove('animation');
                }
                document.getElementById("containerArtist")?.classList.add(inTransition)
                document.getElementById("containerArtist")?.classList.remove(outTransition);
            }, 1000);

            break;
        case 1:
            element = document.getElementById("title");
            document.getElementById("containerTitle")?.classList.remove(inTransition)
            document.getElementById("containerTitle")?.classList.add(outTransition);
            setTimeout(() => {
                currentTitle = data;
                element.innerText = data;
                if (data.length > textLength) {
                    element.classList.remove('animation');
                    element.classList.add('animation');
                } else {
                    element.classList.remove('animation');
                }
                document.getElementById("containerTitle")?.classList.add(inTransition)
                document.getElementById("containerTitle")?.classList.remove(outTransition);
            }, 1000);
            break;
        case 2:
            element = document.getElementById("cover");
            element.classList.remove(inTransition)
            element.classList.add(outTransition);
            setTimeout(() => {
                let canvas = document.getElementById("canvas");
                currentCover = data;
                const imageUrl = data;
                const img = new Image();
                img.src = imageUrl;
                img.onload = () => {
                    if(canvas !== null)
                        canvas.style.backgroundImage = `url(${imageUrl})`;
                    element.src = data;

                    if(document.getElementById("background") !== null){
                        document.getElementById("background").style.backgroundImage = `url(${imageUrl})`;
                    }
                    element.classList.add(inTransition)
                    element.classList.remove(outTransition);
                }
            }, 1000);
            break;
        case 3:
            element = document.getElementById("liked");
            element.classList.remove("animate__jackInTheBox")
            element.classList.add("animate__bounceOut");
            setTimeout(() => {
                currentLiked = data;
                if (data) {
                    element.innerText = likeEmoji;
                    element.classList.add("animate__jackInTheBox");
                }
            }, 1000);
            break;
    }
}

function setScroll() {
    /**
     * The speed in time (in milliseconds) of a single pixel.
     * Changing this value will change the speed.
     * @type {number}
     */
    const timePerPixel = 20;

    /**
     * Width of the container.
     * Hardcoded for simplicity's sake.
     * @type {number}
     */
    const containerWidth = 0;

    /**
     * Select all the messages
     * @type {NodeList}
     */
    const messages = document.querySelectorAll('.message');

    /**
     * For each message, calculate the duration based on the lenght of the message.
     * Then set the animation-duration of the animation.
     */
    messages.forEach(message => {
        message.style.transform = `none`;
        const messageWidth = message.offsetWidth;
        const distance = messageWidth + containerWidth;
        const duration = timePerPixel * distance;
        if (message.style.animationDuration === `${duration}ms`)
            return;
        message.style.transform = `transform: translate3d(calc(100% - 300px), 0, 0)`;
        message.style.animationDuration = `${duration}ms`;
    });
}