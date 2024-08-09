<template>
  <div class="profile-info">
    <Modal v-if="modalActive" :modalMessage="modalMessage" v-on:close-modal="closeModal"></Modal>
    <p class="heading">Account Settings</p>
    <div class="card-info">
      <div class="user-info">
        <div class="profile" ref="profile">
          <span>{{ this.$store.state.profileInitials }}</span>
        </div>
        <div class="admin-badge">
          <span><AdminIcon class="adminIcon"></AdminIcon>Admin</span>
        </div>
      </div>
      <form class="account-form" @submit.prevent="updateProfile">
        <div class="form-group">
          <label for="first-name">First Name</label>
          <input type="text" id="first-name" v-model="firstName" required />
        </div>
        <div class="form-group">
          <label for="last-name">Last Name</label>
          <input type="text" id="last-name" v-model="lastName" required />
        </div>
        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" id="username" v-model="userName" required />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input disabled type="email" id="email" v-model="email" required />
        </div>
        <button type="submit" class="save-button">Save Changes</button>
      </form>
    </div>
  </div>
</template>

<script>
import Modal from "../components/Modal.vue";
import AdminIcon from "../assets/Icons/user-crown-light.svg";
export default {
  name: "Profile",
  components: {
    Modal,
    AdminIcon,
  },
  data() {
    return {
      modalActive:null,
      modalMessage:"Changes were saved!",
    };
  },
  methods: {
    updateProfile() {
      this.$store.dispatch("updateUserSettings")
      this.modalActive = !this.modalActive;
    },
    closeModal() {
      this.modalActive = !this.modalActive;
    },
  },
  computed:{
    firstName:{
      get(){
        return this.$store.state.profileFirstName
      },
      set(payload){
        this.$store.commit("changeFirstName",payload)
      }
    },
    lastName:{
      get(){
        return this.$store.state.profileLastName
      },
      set(payload){
        this.$store.commit("changeLastName",payload)
      }
    },
    userName:{
      get(){
        return this.$store.state.profileUserName
      },
      set(payload){
        this.$store.commit("changeUserName",payload)
      }
    },
    email(){
        return this.$store.state.profileEmail
    }
  }
};
</script>

<style scoped>
.card-info {
  width: 500px;
  margin: 30px auto;
  padding: 20px;
  background-color: #f1f1f1;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-info {
  text-align: center;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.profile {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  color: #fff;
  background-color: #303030;
  span {
    user-select: none; /* Standard syntax */
    pointer-events: none;
    font-size: 22px;
  }
}
.admin-badge {
  margin-top: 15px;
}
.admin-badge span {
  padding: 5px 25px;
  background-color: #303030;
  color: #fff;
  border-radius: 25px;
}
.admin-badge .adminIcon {
  width: 13px;
  margin-right: 4px;
}

.user-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
}

.account-form {
  text-align: left;
}

.heading {
  font-size: 30px;
  margin-top: 20px;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

label {
  margin: 3px 5px;
  display: block;
  color: #000;
  /* font-weight: bold; */
}

input[type="text"],
input[type="email"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: aliceblue;
  outline: none;
}

.save-button {
  display: block;
  margin: auto;
  padding: 10px 20px;
  background-color: #303030;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.save-button:hover {
  background-color: #000;
}
.w-100 {
  width: 100%;
}
@media (max-width: 787px) {
  .card-info {
    width: 100%;
    min-width: 350px;
  }
}
</style>
