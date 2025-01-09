<template>
  <!-- Wishlist Section -->
  <div class="wishlist-section">
    <h3>My Wishlist</h3>
    <p>Number of Cards: {{ numCards }}</p>
    <p>Total Value: ${{ totalValue }}</p>
    <div class="card-container">
      <div
        v-for="card in wishlist"
        :key="card.name"
        class="card"
        @click="openDetailedModal(card)"
      >
        <img :src="card.imageUrl" :alt="card.name" />
        <h3>{{ card.name }}</h3>
        <button
          class="remove-btn"
          @click.stop="removeFromWishlist(card)"
        >
          Remove from Wishlist
        </button>
      </div>
    </div>
  </div>

  <!-- Modal for Detailed View -->
  <div v-if="isModalOpen" class="modal">
    <div class="modal-content">
      <h3>{{ modalData.name }}</h3>
      <img :src="modalData.imageUrl" :alt="modalData.name" />
      <p>Price: {{ modalData.price }}</p>
      <button @click="closeDetailedModal">Close</button>
    </div>
  </div>
</template>

<script>

import { ref, computed, onMounted } from "vue";

export default {
  name: "Wishlist",
  setup() {
    const wishlist = ref([]);
    const collection = ref([]);
    const isModalOpen = ref(false);
    const modalData = ref({});
    const selectedCategory = ref(null);
    const searchQuery = ref("");

    const openDetailedModal = (card) => {
      modalData.value = card;
      isModalOpen.value = true;
    };

    const closeDetailedModal = () => {
      isModalOpen.value = false;
      modalData.value = {};
    };

    const totalValue = computed(() => {
      return wishlist.value
        .reduce((sum, card) => sum + parseFloat(card.price.replace("$", "")), 0)
        .toFixed(2);
    });

    const numCards = computed(() => wishlist.value.length);

    const removeFromWishlist = (card) => {
      const index = wishlist.value.indexOf(card);
      if (index !== -1) {
        wishlist.value.splice(index, 1);
      }
      saveWishlist(); // Save to localStorage
    };

    const filteredCards = computed(() => {
      let filtered = wishlist.value;

      if (selectedCategory.value) {
        filtered = filtered.filter((card) =>
          card.name.toLowerCase().includes(selectedCategory.value.toLowerCase())
        );
      }

      if (searchQuery.value.trim()) {
        filtered = filtered.filter((card) =>
          card.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
      }

      return filtered;
    });

    const saveData = () => {
  // Save wishlist and collection to localStorage
  localStorage.setItem('wishlist', JSON.stringify(wishlist.value));
  localStorage.setItem('collection', JSON.stringify(collection.value));
};

const saveWishlist = () => {
  localStorage.setItem('collection', JSON.stringify(collection.value));
};


const loadWishlists= () => {
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist'));
    if (savedWishlist){
      wishlist.value = savedWishlist;
    }
};
    const loadData = () => {
  // Load wishlist and collection from localStorage, if available
  const savedWishlist = JSON.parse(localStorage.getItem('wishlist'));
  const savedCollection = JSON.parse(localStorage.getItem('collection'));
  
  if (savedWishlist) {
    wishlist.value = savedWishlist;
  }

  if (savedCollection) {
    collection.value = savedCollection;
  }
};

const saveCollection = () => {
  localStorage.setItem('collection', JSON.stringify(collection.value));
};


 

  const loadCollections = () => {
    const savedCollection = JSON.parse(localStorage.getItem('collection'));
    if (savedCollection){
      collection.value = savedCollection;
    }
};

    onMounted(() => {
      loadWishlists();
    });



    return {
      wishlist,
      isModalOpen,
      modalData,
      openDetailedModal,
      closeDetailedModal,
      totalValue,
      numCards,
      removeFromWishlist,
      filteredCards,
      searchQuery,
      selectedCategory,
    };
  },
};
</script>

<style scoped>
.wishlist-section {
  padding: 1rem;
}

.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.card {
  border: 1px solid #ccc;
  padding: 1rem;
  text-align: center;
}


.remove-btn {
  background-color: red; /* Red background for Remove button */
  color: white;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
}

.card button {
  position: absolute;
  bottom: 10px;
  right: 10px;
  padding: 5px 10px;
  border: none;
  background-color: red; /* Red background for Remove button */
  color: white;
  border-radius: 5px;
  cursor: pointer;
  opacity: 0; /* Hide by default */
  transition: opacity 0.3s; /* Smooth transition */
}

.card:hover button {
  opacity: 1; /* Show the button when card is hovered */
}

.card button:hover {
  background-color: darkred; /* Darker red on hover */
}

.card {
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  background-color: #f9f9f9;
  position: relative; /* Ensure positioning for the button */
}

.card img {
  width: 100%;
  height: auto;
  border-radius: 5px;
}

.card button {
  position: absolute;
  bottom: 10px;
  right: 10px;
  padding: 5px 10px;
  border: none;
  background-color: #007BFF;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  opacity: 0; /* Hide by default */
  transition: opacity 0.3s; /* Smooth transition */
}

.card:hover button {
  opacity: 1; /* Show the button when card is hovered */
}

.card button:hover {
  background-color: #0056b3;
}


.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 2rem;
  text-align: center;
}
</style>
