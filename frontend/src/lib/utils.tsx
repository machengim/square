// helper function to start a request.
export function request(url: string, callback: Function, errorHandler: Function) {
        fetch(url)
        .then(res => {
            if (res.status === 200) {
                callback(res);
            } else {
                errorHandler(res);
            }
        })
}

// a place holder to fill in the UserForContext fields 'setUid' and 'setUname'.
export function empty() {
    return;
}