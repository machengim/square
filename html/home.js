axios.defaults.withCredentials = true;

function checkUserOnHome() {
    if (document.cookie == "") {
        window.open('login.html', '_self')
    }
};

function submit_post() {
    var form = document.querySelector('#draft_form');
    var data = new FormData(form);
    console.log(data);
    axios.post('http://localhost:8080/posts', data);
    location.reload();
    return false;
};

function quit() {
    axios.get('http://localhost:8080/quit')
        .then(window.open('login.html', '_self'))
}

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
    el:"#post_list",
    data() {
        return {
            items: null
        }
    },
    mounted() {
        axios.get('http://localhost:8080/posts')
            .then(res => (this.items = res.data));
    }
});


new Vue({
    el:"#user_info",
    data() {
        return {
            info: null
        }
    },
    mounted() {
        axios.get('http://localhost:8080/userSummary')
            .then(res => (this.info = res.data));
    }
})
