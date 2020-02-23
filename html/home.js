axios.defaults.withCredentials = true;
const ApiServer = "http://localhost:8080"

function checkUserOnHome() {
    if (document.cookie == "") {
        window.open('login.html', '_self')
    }
};

function submit_post() {
    var form = document.querySelector('#draft_form');
    var data = new FormData(form);
    console.log(data); 
    axios.post(ApiServer + '/posts', data); // Need to handle user input before submit.
    location.reload();
    return false;
};

function quit() {
    axios.get(ApiServer + '/quit');
    document.cookie = "login= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
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
        offset: 0,
    },
    mounted() {
        axios.get(ApiServer + '/posts')
            .then(res => { this.items = res.data.posts; 
                            this.offset = res.data.offset; })
    },
    methods: {
        loadMore: function() {
            axios.get(ApiServer + '/posts?offset=' + this.offset)
                .then(res => {
                    for (i = 0; i < res.data.posts.length; i++) {
                        this.items.push(res.data.posts[i]);
                    }
                    this.offset = res.data.offset;
                })
        }
    }
});


new Vue({
    el: "#user_info",
    data: {
        info: null,
    },
    mounted() {
        axios.get(ApiServer + '/userSummary')
            .then(res => (this.info = res.data));
    }
});
