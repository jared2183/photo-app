function getCookie (key) {
    let name = key + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(name, val) {
    const d = new Date();
    const days = 365;
    d.setTime(d.getTime() + (days*24*60*60*1000));
    const expires = "expires="+ d.toUTCString();
    document.cookie = name + "=" + val + ";" + expires;
}

export function setAccessTokenCookie(username, password, callback) {
    const postData = {
        "username": username,
        "password": password
    };
    fetch('https://photo-app-secured.herokuapp.com/api/token/', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(data => {
            const token = data.access_token;
            setCookie('access_token_cookie_js', token); 
            callback();
        });
}

export function hasCsrfToken () {
    return getCookie('csrf_access_token'); // || token;
}

export function getAccessTokenCookie () {
    return getCookie('access_token_cookie_js'); // || token;
}

export function getHeaders () {
    const access_token_cookie_js = getCookie('access_token_cookie_js');
    const csrf_access_token = getCookie('csrf_access_token');
    let headers;
    if (csrf_access_token && window.location.port !== '3000') {
        headers = {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrf_access_token
        };
    } else if (access_token_cookie_js) {
        headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + access_token_cookie_js
        };
    } else {
        console.error('Neither access_token_cookie nor csrf_access_token found')
    }
    return headers;
}