<template>
    <div class="post-view" v-if="currentBlog">
        <div class="container quillwrapper" v-if="this.currentBlog[0]">
            <h2>{{ this.currentBlog[0].blogTitle }}</h2>
            <h4>Posted on:{{ new Date(this.currentBlog[0].blogDate).toLocaleString('en-us',{dateStyle:"long"}) }}</h4>
            <img style="max-width: 100%;" :src="this.currentBlog[0].blogCoverphoto" alt="">
            <div class="post-content ql-editor" v-html="this.currentBlog[0].blogHTML"></div>
        </div>
    </div>
</template>
<script>
export default {
    name:"ViewBlog",
    data() {
        return {
            currentBlog:null,
        }
    },
    async mounted() {
        this.currentBlog = await this.$store.state.blogPosts.filter((post)=>{
            return post.blogID == this.$route.params.blogid
        })
        console.log(this.currentBlog)
    },
}
</script>
<style lang="scss" scoped>
    .post-view{
        min-height: 100%;
        .container{
            max-width: 1000px;
            padding: 60px 25px;
        }
        .ql-editor{
            padding: 0;
        }
        h2{
            margin-bottom: 16px;
            font-weight: 300;
            font-size: 32px;
        }
        h4{
            font-weight: 400;
            font-size: 14px;
            margin-bottom: 24px;
        }
        img{
            width: 100%;
            margin-bottom: 32px;
            max-width: 100% !important;
        }
    }
    .ql-editor img{
        max-width: 100%;
    }
    .post-view .ql-editor img{
        max-width: 100%;
    }
</style>