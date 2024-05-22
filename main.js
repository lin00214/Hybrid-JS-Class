const url = `https://picsum.photos/v2/list`;

function fetchAndCacheImage() {
    fetch(url)
    // console.log("fetch url success", url);
    .then ((response) => {
        if(!response.ok) {
            throw new Error('Fail to fetch images');
        }
        // if response is success, change it to json format
        return response.json();
    })
    .then((data) => {
        console.log(data);
        // to open 'images'(name) cache
        return caches.open('images')
        .then((cache) => {
            //cache.add(url);
            //After asking chatGPT why the browser giving those errors, I knew it has a problem with CORS. But I didn't understand so I don't know how to fix it
            const promise = data.map((image) => {
                // perform a fetch request for each image URL and store the response in cache
                return fetch(image.url)
                .then(response => {
                    cache.put(image.url, response)
                });
            })
            // use this method to wait all the image request complete
            return Promise.all(promise);
        })
    .then(() => {
        console.log("Success to save images to cache");
    })
    .catch((error) => {
        console.log("Fail to get images", error);
    })
    })
}

fetchAndCacheImage();

function getImage() {
    caches.open('images')
    .then((cache) => {
        // use this method to get all keys in cache
        return cache.keys()
        .then((request) => {
            request.forEach((req) => {
                // use 'match' to find response that matches the specified request
                cache.match(req)
                .then((response) => {
                    // if response exist, output the image URL in cache
                    if (response) {
                        console.log(req.url);
                    }
                })
                .catch((err) => {
                    console.log("Fail to match images in cache", err);
                })
            })
        })
        .catch((err) => {
            console.log("Fail to display cache images", err);
        })
    })
    .catch((error) => {
        console.log("Fail to open cache", error);
    })
}

document.getElementById('saveImages').addEventListener('click', getImage);