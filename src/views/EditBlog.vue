<template>
    <div class="create-post">
        <BlogCoverPreview v-show="this.$store.state.blogPhotopreview"></BlogCoverPreview>
        <Loading v-show="loading"></Loading>
        <div class="container">
            <div :class="{ invisible: !error }" class="err-message">
                <p><span>Error:</span>{{ this.errorMsg }}</p>
            </div>
            <div class="blog-info">
                <input type="text" placeholder="Enter Blog Title" v-model="blogTitle">
                <div class="upload-file">
                    <label for="blog-photo">Upload Cover Photo</label>
                    <input @change="fileChange" type="file" ref="blogPhoto" id="blog-photo" accept=".png, .jpg, .jpeg">
                    <button @click="openPreview" class="preview"
                        :class="{ 'button-inactive': !this.$store.state.blogPhotoFileURL }">Preview
                        Photo</button>
                    <span>File Chosen:{{ this.$store.state.blogPhotoName }}</span>
                </div>
            </div>
            <div class="editor">
                <vue-editor v-model="blogHTML" useCustomImageHandler @image-added="imageHandler" />
            </div>
            <div class="blog-actions">
                <button @click="updateBlog">Save Changes</button>
                <router-link class="router-button" :to="{ name: 'BlogPreview' }">Preview Changes</router-link>
            </div>
        </div>
    </div>
</template>
<script>
import Quill from "quill";
import BlogCoverPreview from "../components/BlogCoverPreview.vue";
import Loading from "../components/Loading.vue";
import firebase from "firebase/app";
import "firebase/storage"
import db from "../firebase/firebaseInit"
window.Quill = Quill;
const ImageResize = require("quill-image-resize-module").default;
Quill.register("modules/imageResize", ImageResize)
export default {
    name: "CreatePost",
    components: {
        BlogCoverPreview,
        Loading
    },
    data() {
        return {
            file: null,
            error: null,
            errorMsg: null,
            loading: null,
            routeID:null,
            currentBlog:null,
            editorSettings: {
                modules: {
                    ImageResize
                }
            }
        }
    },
    async mounted() {
        this.routeID = this.$route.params.blogid
        this.currentBlog = await this.$store.state.blogPosts.filter((post)=>{
            return post.blogID === this.routeID
        })
        this.$store.commit('setBlogState',this.currentBlog[0])
    },
    computed: {
        profileId() {
            return this.$store.state.profileId
        },
        blogCoverPhotoName() {
            return this.$store.state.blogPhotoName
        },
        blogTitle: {
            get() {
                return this.$store.state.blogTitle
            },
            set(payload) {
                this.$store.commit("updateBlogTitle", payload)
            }
        },
        blogHTML: {
            get() {
                return this.$store.state.blogHTML
            },
            set(payload) {
                this.$store.commit("newBlogPost", payload)
            }
        }
    },
    methods: {
        fileChange() {
            this.file = this.$refs.blogPhoto.files[0]
            const fileName = this.file.name
            this.$store.commit("fileNameChange", fileName)
            this.$store.commit("createFileURL", URL.createObjectURL(this.file))
        },
        openPreview() {
            this.$store.commit("openPhotoPreview")
        },
        imageHandler(file, Editor, cursorLocation, resetUploader) {
            const storageRef = firebase.storage().ref();
            const docRef = storageRef.child(`documents/blogPostPhotos/${file.name}`);
            docRef.put(file).on("state_changed", (snapshot) => {
                console.log(snapshot);
            }, (err) => {
                console.log(err);
            }, async () => {
                const downloadURL = await docRef.getDownloadURL();
                Editor.insertEmbed(cursorLocation, "image", downloadURL);
                resetUploader()
            })
        },
        async updateBlog() {
            const dataBase = db.collection('blogPosts').doc(this.routeID)
            if (this.blogTitle.length != 0 && this.blogHTML.length != 0) {
                if (this.file) {
                    //
                    console.log(this.$store.blogPhotoName)
                    this.loading=true
                    const stoargeRef = firebase.storage().ref()
                    const docRef = stoargeRef.child(`documents/BlogCoverPhotos/${this.$store.state.blogPhotoName}`)
                    docRef.put(this.file).on(
                        "state_changed",
                        (snapshot)=>{
                            console.log(snapshot);
                        },
                        (err)=>{
                            console.log(err);
                            this.loading=false
                        },async ()=>{
                            const downloadURL = await docRef.getDownloadURL()
                            // const timestamp = await Date.now()
                            // const dataBase = await db.collection("blogPosts").doc();

                            await dataBase.update({
                                // blogID:dataBase.id,
                                blogHTML:this.blogHTML,
                                blogCoverphoto:downloadURL,
                                blogCoverPhotoName:this.blogCoverPhotoName,
                                blogTitle:this.blogTitle,
                                // profileId:this.profileId,
                                // date:timestamp,
                            })
                            await this.$store.dispatch("updatePost",this.routeID)
                            this.loading=false
                            this.$router.push({name:'ViewBlog',params:{blogid:dataBase.id}})
                        }
                    )
                    return
                }
                this.loading = true
                await dataBase.update({
                    blogHTML:this.blogHTML,
                    blogTitle:this.blogTitle
                })
                await this.$store.dispatch("updatePost",this.routeID)
                this.loading = false;
                this.$router.push({name:"ViewBlog",params:{blogid:dataBase.id}})
                return
            }
            this.error = true
            this.errorMsg = "Please ensure Blog Title & Blog Post has been filled!"
            setTimeout(() => {
                this.error = false
            }, 5000);
            return
        }
    },
}
</script>
<style lang="scss" scoped>
.create-post {
    position: relative;
    height: 100%;

    button {
        margin-top: 0px !important;
    }

    .router-button {
        text-decoration: none;
        color: #fff;
    }

    label,
    button,
    .router-button {
        transition: 0.5s ease-in-out all;
        align-self: center;
        font-size: 14px;
        cursor: pointer;
        border-radius: 20px;
        margin-top: 0px !important;
        padding: 12px 24px;
        color: #fff;
        background-color: #303030;
        text-decoration: none;

        &:hover {
            background-color: rgba(48, 48, 48, 0.7);
        }
    }

    .container {
        position: relative;
        height: 100%;
        padding: 10px 25px 60px;
    }

    // error styling 
    .invisible {
        opacity: 0 !important;
    }

    .err-message {
        width: 100%;
        padding: 12px;
        border-radius: 8px;
        color: #fff;
        margin-bottom: 10px;
        background-color: #303030;
        opacity: 1;
        transition: 0.5s ease all;

        p {
            font-size: 14px;
        }

        span {
            font-weight: 600;
        }
    }

    .blog-info {
        display: flex;
        margin-bottom: 32px;

        input:nth-child(1) {
            min-width: 300px;
        }

        input {
            transition: 0.5 ease-in-out all;
            padding: 10px 4px;
            border: none;
            border-bottom: 1px solid #303030;

            &:focus {
                outline: none;
                box-shadow: 0 1px 0 0 #303030;
            }
        }

        .upload-file {
            flex: 1;
            margin-left: 16px;
            position: relative;
            display: flex;

            input {
                display: none;
            }

            .preview {
                margin-right: 16px;
                text-transform: inherit;
            }

            span {
                font-style: 12px;
                margin-left: 12px;
                align-self: center;
            }
        }
    }

    .editor {
        height: 60vh;
        display: flex;
        flex-direction: column;

        .quillWrapper {
            position: relative;
            display: flex;
            flex-direction: column;
            height: 100%;
        }

        .ql-container {
            display: flex;
            flex-direction: column;
            height: 100%;
            overflow: scroll;
        }
    }
}
</style>