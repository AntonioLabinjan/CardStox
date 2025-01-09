<template>
    <div class="profile">
      <div class="profile-header">
        <div class="profile-picture">
          <img :src="profilePicture || placeholderImage" alt="Profile Picture" class="pfp" />
          <input type="file" accept="image/*" @change="uploadProfilePicture" />
        </div>
        <div class="username">
          <template v-if="isEditingUsername">
            <input
              type="text"
              v-model="usernameInput"
              placeholder="Enter your username"
              @keyup.enter="saveUsername"
            />
          </template>
          <template v-else>
            <h1 @click="editUsername">{{ username || 'Click to set your username' }}</h1>
          </template>
        </div>
      </div>
  
      <div class="collections">
        <h2>Your Collection</h2>
        <br>
        <br>
        <div class="card-grid">
          <div v-for="card in collection" :key="card.name" class="card">
            <img :src="card.imageUrl" alt="Card Image" />
            <h3>{{ card.name }}</h3>
            <p>{{ card.description }}</p>
            <p><strong>Price:</strong> {{ card.price }}</p>
            <p><strong>Year:</strong> {{ card.year }}</p>
            <button @click="removeFromCollection(card)">Remove from Collection</button>
          </div>
        </div>
      </div>
  
      <div class="wishlist">
        <br>
        <h2>Your Wishlist</h2>
        <br>
        <br>
        <div class="card-grid">
          <div v-for="card in wishlist" :key="card.name" class="card">
            <img :src="card.imageUrl" alt="Card Image" />
            <h3>{{ card.name }}</h3>
            <p>{{ card.description }}</p>
            <p><strong>Price:</strong> {{ card.price }}</p>
            <p><strong>Year:</strong> {{ card.year }}</p>
            <button @click="removeFromWishlist(card)">Remove from Wishlist</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  
  export default {
    name: 'ProfilePage',
    setup() {
      const placeholderImage = 'https://via.placeholder.com/150';
      const profilePicture = ref(null);
      const username = ref('');
      const usernameInput = ref('');
      const isEditingUsername = ref(false);
      const wishlist = ref([]);
      const collection = ref([]);
  
      const uploadProfilePicture = (event) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            profilePicture.value = reader.result;
            saveProfileData();
          };
          reader.readAsDataURL(file);
        }
      };
  
      const saveUsername = () => {
        username.value = usernameInput.value.trim();
        usernameInput.value = '';
        isEditingUsername.value = false;
        saveProfileData();
      };
  
      const editUsername = () => {
        isEditingUsername.value = true;
        usernameInput.value = username.value;
      };
  
      const removeFromWishlist = (card) => {
        const index = wishlist.value.indexOf(card);
        if (index !== -1) {
          wishlist.value.splice(index, 1);
          saveProfileData();
        }
      };
  
      const removeFromCollection = (card) => {
        const index = collection.value.indexOf(card);
        if (index !== -1) {
          collection.value.splice(index, 1);
          saveProfileData();
        }
      };
  
      // Save profile data to localStorage
      const saveProfileData = () => {
        localStorage.setItem('profilePicture', profilePicture.value);
        localStorage.setItem('username', username.value);
        localStorage.setItem('wishlist', JSON.stringify(wishlist.value));
        localStorage.setItem('collection', JSON.stringify(collection.value));
      };
  
      // Load profile data from localStorage
      const loadProfileData = () => {
        profilePicture.value = localStorage.getItem('profilePicture') || null;
        username.value = localStorage.getItem('username') || '';
        wishlist.value = JSON.parse(localStorage.getItem('wishlist')) || [];
        collection.value = JSON.parse(localStorage.getItem('collection')) || [];
      };
  
      onMounted(() => {
        loadProfileData();
      });
  
      return {
        placeholderImage,
        profilePicture,
        username,
        usernameInput,
        isEditingUsername,
        wishlist,
        collection,
        uploadProfilePicture,
        saveUsername,
        editUsername,
        removeFromWishlist,
        removeFromCollection,
      };
    },
  };
  </script>
  
  <style scoped>
  .profile {
    padding: 20px;
    max-width: 800px;
    margin: auto;
  }
  
  .profile-header {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .profile-picture {
    position: relative;
  }
  
  .profile-picture img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #ccc;
  }
  
  .profile-picture input {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    opacity: 0;
    cursor: pointer;
  }
  
  .username h1 {
    font-size: 24px;
    cursor: pointer;
    color: #007BFF;
  }
  
  .username input {
    font-size: 18px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .collections,
  .wishlist {
    margin-top: 30px;
  }
  
  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
  }
  
  .card {
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 10px;
    text-align: center;
    background-color: #f9f9f9;
  }
  
  .card img {
    width: 100%;
    height: auto;
    border-radius: 5px;
  }
  
  .card button {
  margin-top: 10px;
  padding: 5px 10px;
  border: none;
  background-color: red; /* Red background for Remove button */
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

.card button:hover {
  background-color: #cc0000; /* Darker red on hover */
}


  .button {
    background-color: red;
  }
  </style>
  