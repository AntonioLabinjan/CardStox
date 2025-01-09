<template>
  <!-- Collection Section -->
  <div class="collection-section">
    <h3>My Collection</h3>
    <p>Number of Cards: {{ numCards }}</p>
    <p>Total Value: ${{ totalValue }}</p>
    <div class="card-container">
      <div
        v-for="card in collection"
        :key="card.name"
        class="card"
        @click="openDetailedModal(card)"
      >
        <img :src="card.imageUrl" :alt="card.name" />
        <h3>{{ card.name }}</h3>
        <button
          class="remove-btn"
          @click.stop="removeFromCollection(card)"
        >
          Remove from Collection
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
  name: "Collection",
  setup() {
    const collection = ref([]);
    const wishlist = ref([]);
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
      return collection.value
        .reduce((sum, card) => sum + parseFloat(card.price.replace("$", "")), 0)
        .toFixed(2);
    });

    const numCards = computed(() => collection.value.length);

    const removeFromCollection = async (card) => {
      const index = collection.value.indexOf(card);
      if (index !== -1) {
        collection.value.splice(index, 1);
      }
      await saveCollection(); // Save to Firestore
    };

    const filteredCards = computed(() => {
      let filtered = collection.value;

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

    // Save wishlist and collection to Firestore
    const saveData = () => {
  // Save wishlist and collection to localStorage
  localStorage.setItem('wishlist', JSON.stringify(wishlist.value));
  localStorage.setItem('collection', JSON.stringify(collection.value));
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
      loadCollections();
    });

    return {
      collection,
      wishlist,
      isModalOpen,
      modalData,
      openDetailedModal,
      closeDetailedModal,
      totalValue,
      numCards,
      removeFromCollection,
      filteredCards,
      searchQuery,
      selectedCategory,
    };
  },
};
</script>



<style scoped>
.collection-section {
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
  background-color: red;
  color: white;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
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
