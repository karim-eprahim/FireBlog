import Vue from "vue";
import Vuex from "vuex";
import firebase from "firebase/app";
import "firebase/auth";
import db from "../firebase/firebaseInit";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // sampleBlogCards: [
    //   {
    //     blogTitle: "Blog Card #1",
    //     blogCoverPhoto: "stock-1",
    //     blogDate: "may1,2021",
    //   },
    //   {
    //     blogTitle: "Blog Card #2",
    //     blogCoverPhoto: "stock-2",
    //     blogDate: "may1,2021",
    //   },
    //   {
    //     blogTitle: "Blog Card #3",
    //     blogCoverPhoto: "stock-3",
    //     blogDate: "may1,2021",
    //   },
    //   {
    //     blogTitle: "Blog Card #4",
    //     blogCoverPhoto: "stock-4",
    //     blogDate: "may1,2021",
    //   },
    // ],
    blogPosts:[],
    postLoaded:null,
    blogHTML:"write your blog title here...",
    blogTitle:"",
    blogPhotoName:"",
    blogPhotoFileURL:null,
    blogPhotopreview:null,
    editPost: null,
    user: null,
    profileAdmin:null,
    profileEmail: null,
    profileFirstName: null,
    profileLastName: null,
    profileUserName: null,
    profileId: null,
    profileInitials: null,
  },
  getters:{
    blogPostsFeed(state){
      return state.blogPosts.slice(0,2)
    },
    blogPostsCards(state){
      return state.blogPosts.slice(2,6)
    },
  },
  mutations: {
    newBlogPost(state,payload){
      state.blogHTML = payload
    },
    updateBlogTitle(state,payload){
      state.blogTitle = payload
    },
    fileNameChange(state,payload){
      state.blogPhotoName = payload
      console.log("store",state.blogPhotoName)
    },
    createFileURL(state,payload){
      state.blogPhotoFileURL = payload
    },
    openPhotoPreview(state){
      state.blogPhotopreview = !state.blogPhotopreview
    },
    toggleEditPost(state, payload) {
      state.editPost = payload;
      console.log(state.editPost);
    },
    setBlogState(state,payload){
      state.blogTitle = payload.blogTitle
      state.blogHTML = payload.blogHTML
      state.blogPhotoFileURL = payload.blogCoverphoto
      state.blogPhotoName = payload.blogPhotoName
    },
    filterBlogPost(state,payload){
      state.blogPosts = state.blogPosts.filter((post)=>{
        return post.blogID !== payload
      })
    },
    updateUser(state,payload){
      state.user = payload
    },
    setProfileAdmin(state,payload){
      state.profileAdmin = payload
    },
    setProfileInfo(state, doc) {
      state.profileId = doc.id;
      state.profileEmail = doc.data().email;
      state.profileFirstName = doc.data().firstName;
      state.profileLastName = doc.data().lastName;
      state.profileUserName = doc.data().username;
    },
    setprofileInitials(state) {
      const firstInitial = state.profileFirstName.charAt(0);
      const lastInitial = state.profileLastName.charAt(0);
      state.profileInitials = firstInitial + lastInitial;
    },
    changeFirstName(state,payload){
      state.profileFirstName = payload
    },
    changeLastName(state,payload){
      state.profileLastName = payload
    },
    changeUserName(state,payload){
      state.profileUserName = payload
    },
    resetPost(state){
      // state.blogPosts=[];
      // state.postLoaded=null;
      state.blogHTML="write your blog title here...";
      state.blogTitle="";
      state.blogPhotoName="";
      state.blogPhotoFileURL=null;
      state.blogPhotopreview=null;
      // state.editPost=null;
    }
  },
  actions: {
    async getCurrentUser({commit},user){
      const dataBase = await db.collection('users').doc(firebase.auth().currentUser.uid)
      const dbResults = await dataBase.get();
      commit("setProfileInfo",dbResults)
      commit("setprofileInitials")
      const token = await user.getIdTokenResult();
      const admin = await token.claims.admin
      commit('setProfileAdmin',admin)
    },
    async getPost({state}){
      const dataBase = await db.collection('blogPosts').orderBy("date", "desc")
      const dbResults = await dataBase.get()
      dbResults.forEach((doc)=>{
        if(!state.blogPosts.some((post)=>post.blogID === doc.id)){
          const data = {
            blogID : doc.data().blogID,
            blogHTML : doc.data().blogHTML,
            blogCoverphoto : doc.data().blogCoverphoto,
            blogTitle : doc.data().blogTitle,
            blogPhotoName : doc.data().blogCoverPhotoName,
            blogPhotoFileURL : doc.data().blogPhotoFileURL,
            blogDate : doc.data().date,
          }
          state.blogPosts.push(data)
        }
      })
      state.postLoaded = true
      // console.log(state.blogPosts);
    },
    async updateUserSettings({commit,state}){
      const dataBase = await db.collection('users').doc(state.profileId)
      await dataBase.update({
        firstName:state.profileFirstName,
        lastName:state.profileLastName,
        username:state.profileUserName,
      })
      commit("setprofileInitials")
    },
    async updatePost({commit,dispatch},payload){
      commit("filterBlogPost",payload);
      await dispatch("getPost")
      // setTimeout(() => {
      //   commit("resetPost")
      // }, 3000);
    },
    async deletePost({commit},payload){
      const getPost = await db.collection("blogPosts").doc(payload)
      await getPost.delete();
      commit("filterBlogPost",payload)
    }
  },
  modules: {},
});
