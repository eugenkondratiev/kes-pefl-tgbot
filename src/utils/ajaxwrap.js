module.exports = function ajaxGet(method, requestString) {
    return new Promise((res, rej) => {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener("error", () => { rej("xhr error") });
        xhr.addEventListener("abort", () => { rej("xhr aborted") });

        xhr.addEventListener("loadend", function () {
            res(this.responseText);

            // res(xhr.responseText);

        });

        xhr.addEventListener('progress', function (event) {
            if (event.lengthComputable) {
                console.log(`Received ${event.loaded} of ${event.total} bytes`);
            } else {
                console.log(`Received ${event.loaded} bytes totally`); // no Content-Length
            }

        });
        xhr.open(method, requestString);
        xhr.setRequestHeader('Content-type', 'charset=UTF-8')
        xhr.send();
    });

}