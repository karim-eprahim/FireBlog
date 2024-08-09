<template>
  <div class="app-wrapper">
    <div class="app" v-if="this.$store.state.postLoaded">
      <Navigation v-if="!navigation"></Navigation>
      <router-view />
      <Footer v-if="!navigation"></Footer>
    </div>
  </div>
</template>

<script>
import Navigation from "./components/Navigation";
import Footer from "./components/Footer.vue";
import firebase from "firebase/app";
import "firebase/auth";
export default {
  name: "app",
  components: {
    Navigation,
    Footer,
  },
  data() {
    return {
      navigation: null,
    };
  },
  created() {
    this.checkRoute();
    firebase.auth().onAuthStateChanged(async (user) => {
      this.$store.commit("updateUser", user);
      if (user) {
        // const token = await user.getIdTokenResult();
        // console.log(token.claims)
        await this.$store.dispatch("getCurrentUser", user); // Wait for action to complete
      }
    });
    this.$store.dispatch("getPost")
  },

  mounted() {
  },
  methods: {
    checkRoute() {
      if (this.$route.name == "Login" || this.$route.name == "Register" || this.$route.name == "ForgotPassword") {
        this.navigation = true;
        return;
      } this.navigation = false
    }
  },
  watch: {
    $route() {
      this.checkRoute()
    }
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Quicksand", sans-serif;
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.container {
  max-width: 1440px;
  margin: 0 auto;
}

.link {
  cursor: pointer;
  text-decoration: none;
  text-transform: uppercase;
  color: black;
}

.link-light {
  color: #fff;
}

.arrow {
  margin-left: 8px;
  width: 12px;

  path {
    fill: #000;
  }
}

.arrow-light {
  path {
    fill: #fff;
  }
}

button,
.router-button {
  transition: 500ms ease all;
  cursor: pointer;
  margin-top: 24px;
  padding: 12px 24px;
  background-color: #303030;
  color: #fff;
  border-radius: 20px;
  border: none;
  text-transform: uppercase;

  &:focus {
    outline: none;
  }

  &:hover {
    background-color: rgba(48, 48, 48, 0.7);
  }
}

.button-ghost {
  color: #000;
  padding: 0;
  border-radius: 0;
  margin-top: 50px;
  font-size: 15px;
  font-weight: 500;
  background-color: transparent;

  @media (min-width: 700px) {
    margin-top: 0;
    margin-left: auto;
  }

  i {
    margin-left: 8px;
  }
}

.button-light {
  background-color: transparent;
  border: 2px solid #fff;
  color: #fff;
}

.button-inactive {
  pointer-events: none !important;
  cursor: none !important;
  background-color: rgba(128, 128, 128, 0.5) !important;
}

.error {
  text-align: center;
  font-size: 12px;
  color: red;
}
.blog-card-wrap {
  position: relative;
  padding: 80px 16px;
  background-color: #f1f1f1;

  @media (min-width: 500px) {
    padding: 100px 16px;
  }

  .blog-cards {
    display: grid;
    gap: 32px;
    grid-template-columns: 1fr;

    @media (min-width: 500px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 900px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (min-width: 1200px) {
      grid-template-columns: repeat(4, 1fr);
    }
  }
}

// for create bost 
.ql-formats button {
  margin-top: 0px !important;
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
      margin-left: 16px;
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
  .ql-editor{
    padding: 20px 16px 36px;
  }
}
.blog-actions{
  margin-top: 32px;
  button{
    margin-right: 16px;
  }
}
</style>
