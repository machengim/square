axios.defaults.withCredentials = true;
const ApiServer = "http://localhost:8080"

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}

function checkUserOnHome() {
    if (document.cookie == "") {
        window.open('login.html', '_self')
    }
};

function submit_post() {
    var form = document.querySelector('#draft_form');
    var content = form[0].value;
    if (content.trim() == "") {
        alert("Empty input!");
        return false;
    }
    var data = new FormData(form);
    console.log(data); 
    axios.post(ApiServer + '/posts', data)
            .then(res => { location.reload(); },
                    err => { alert(err); });
    return false;
};

function quit() {
    axios.get(ApiServer + '/quit');
    document.cookie = "local= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.open('login.html', '_self');
};

new Vue({
    el:"#write_box",
    data: {
        show: 0
    },
    methods: {
        show_area () {
            this.show = 1;
            this.$refs.draft.style.height = "120px";
        },
        hide_area() {
            this.show = 0;
            this.$refs.draft.style.height = "20px";
        }
    }
});

new Vue({
    el: "#post_list",
    data: {
        items: null,
        hasNew: false,
        hasOld: false,
        min: -1,    // Record the min ID (Oldest post on page)
        max: -1,    // Record the max ID (newest post on page)
        greeting: "",   // Temporary used for websocket
    },
    mounted() {
        axios.get(ApiServer + '/posts')
            .then(res => { 
                this.items = res.data.posts; 
                this.min = res.data.min;
                this.max = res.data.max;
                this.hasOld = res.data.hasOld;
                this.checkNew();
            })
    },
    methods: {
        loadMore: function() {
            axios.get(ApiServer + '/posts?min=' + this.min)
                .then(res => {
                    for (i = 0; i < res.data.posts.length; i++) {
                        this.items.push(res.data.posts[i]);
                    }
                    this.min = res.data.min;
                    this.hasOld = res.data.hasOld;
                });
        },
        checkNew: function() {
            var ws = new WebSocket("ws://localhost:8080/newPosts");

            ws.onopen = function() {
                console.log("Websocket open...");
            }
            ws.onmessage = function(e) {
                console.log("Get data: " + e.data);
                this.greeting = e.data;
                this.hasNew = true;
            }
            ws.onclose = function() {
                console.log("Websocket closed.")
            }
        }
    }
});

new Vue({
    el: "#user_info",
    data: {
        info: {
            "nickname": "",
            "posts": 0,
            "marked": 0,
            "comments": 0,
        },
        changing: false,
        newName: "",
    },
    mounted() {
        axios.get(ApiServer + '/userSummary')
            .then(res => {this.info = res.data;
                        if (this.info.nickname == "") {
                            this.info.nickname = "Anonymous"
                        }
                        this.newName = this.info.nickname});
        let self = this;
        this.$nextTick(function () {
            document.addEventListener('keyup', function (e) {
              //此处填写你的业务逻辑即可
              if (self.$refs.newNameInput == document.activeElement) {
                if (e.keyCode == 27) {
                    self.cancleChange();
                } else if (e.keyCode == 13) {
                    self.submitChangeName();
                }
              }
            })
          })
    },
    methods: {
        changeName: function () {
            this.changing = true;
            this.$nextTick(() => this.$refs.newNameInput.focus());
        },
        submitChangeName: function () {
            name = this.newName;
            axios.post(ApiServer + '/userInfo?name=' + name)
                .then(res => { this.info.nickname = name;
                                this.changing = false;},
                      err => (alert(err)));
        },
        cancleChange: function() {
            this.newName = this.info.nickname;
            this.changing = false;
        }
    }
});
