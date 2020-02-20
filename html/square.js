function submit_post() {
    var form = document.querySelector('#draft_form');
    var data = new FormData(form);
    console.log(data);
    axios.post('http://localhost:8080/posts', data);
    location.reload();
    return false;
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

var post_list = new Vue({
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
})