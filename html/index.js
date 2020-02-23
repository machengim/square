axios.defaults.withCredentials = true;

function register() {
    var form = document.querySelector('#register');
    var email = form[0].value;
    var pw = form[1].value;
    var pw2 = form[2].value;
    var nickname = form[3].value;
    if (pw != pw2) {
        alert("Passwords not match!");
        return false;
    }

    /* Need to optimize later */
    var data = {
        "email": email,
        "password": pw,
        "nickname": nickname
    };

    axios.post("http://localhost:8080/register", data)
            .then(
                (response) => { window.open('index.html', '_self'); },
                (error) => { alert(error.response.data);  }
            );

    return false;
}

function login() {
    var form = document.querySelector('#login');
    var email = form[0].value;
    var pw = form[1].value;
    console.log(email)
    var data = {
        "email": email,
        "password": pw
    };

    axios.post('http://localhost:8080/login', data)
            .then(
                (response) => { window.open('home.html', '_self');},
                (error) => { alert('Login error!'); }
            );

    return false;
}