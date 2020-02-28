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
    post_lists.closeWs();
    var data = new FormData(form);
    console.log(data); 
    axios.post(ApiServer + '/posts', data)
            .then(res => {
                post_lists.loadNew(); 
                document.getElementById('draft').value = '';
                write_box.hide_area();
            },
                err => { alert(err); });
    return false;
};

// This function could be replaced by server side operation after deployment.
function quit() {
    axios.get(ApiServer + '/quit');
    document.cookie = "local= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.open('login.html', '_self');
};

var write_box = new Vue({
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

var post_lists = new Vue({
    el: "#post_list",
    data: {
        items: null,
        hasNew: 0,
        hasOld: false,
        ws: null,   // Record the curret websocket connection.
        min: -1,    // Record the min ID (Oldest post on page)
        max: -1,    // Record the max ID (newest post on page)
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
        loadOld: function() {
            axios.get(ApiServer + '/posts?min=' + this.min)
                .then(res => {
                    for (i = 0; i < res.data.posts.length; i++) {
                        this.items.push(res.data.posts[i]);
                    }
                    this.min = res.data.min;
                    this.hasOld = res.data.hasOld;
                });
        },
        loadNew: function() {
            axios.get(ApiServer + '/posts?max=' + this.max)
                .then(res => {
                    for (i = res.data.posts.length - 1; i >= 0; i--) {
                        this.items.unshift(res.data.posts[i]);
                    }
                    this.max = res.data.max;
                    this.hasNew = 0;
                    this.checkNew();
                })
        },
        checkNew: function() {
            var self = this;    // Notice the content of "this" changes here.
            var ws = new WebSocket("ws://localhost:8080/newPosts");

            ws.onopen = function() {
                console.log("Websocket open...");
                self.ws = ws;
                ws.send(self.max);
                console.log(self.max);
            }
            ws.onmessage = function(e) {
                self.hasNew = parseInt(e.data);
                console.log(e.data);
            }
            ws.onclose = function() {
                console.log("Websocket closed.")
            }
        },
        closeWs: function() {
            this.ws.close();
            console.log("Socket closed.")
        },
        readComments: function(id) {
            item = this.getItemById(id);
            if (item == null) {
                console.log("Found nothing");
                return;
            }

            if (item.showComments) {
                item.showComments = false;
                this.$forceUpdate();
            } else {
                axios.get(ApiServer + '/comments?pid=' + item.id)
                    .then(res => {
                        item.comments = res.data;
                        item.newComment = "";
                        item.showComments = true;
                        this.$forceUpdate();
                    });
            }
        },
        sendComment: function(id) {
            item = this.getItemById(id);
            data = { "pid": id, "content": item.newComment };
            axios.post(ApiServer + '/comments', data);
        },
        getItemById: function(pid) {
            for (i = 0; i < this.items.length; i++) {
                if (this.items[i].id == pid) {
                    return this.items[i];
                }
            }
            return null;
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
