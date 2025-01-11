<template>
  
  <!-- 
     fixat stil malo;  
     slika karte;
     -->
     <div>
     <div class="navbar">
      <h1>CardStox</h1>
      <div class="nav-links">
        <button @click="showPopularCards">Popular</button>

        <div class="profile-dropdown" style="position: relative;">
  <button @click="toggleCategories" class="profile-btn">
    Categories
  </button>
  <!-- Category Dropdown -->
  <div class="profile-dropdown" style="position: relative;" v-if="categoriesVisible">
    <a 
      class="dropdown-btn" 
      v-for="category in categories" 
      :key="category" 
      href="#"
      @click.prevent="filterByCategory(category)"
    >
      {{ category }}
    </a>
  </div>
</div>
      </div>
      <div class="profile-dropdown" style="position: relative;">
        <button @click="toggleDropdown" class="profile-btn">
          Profile
        </button>
        <div class="profile-dropdown" style="position: relative;" v-if="dropdownVisible">
         
          <router-link to="/collection">
  <button class="dropdown-btn">My Collection</button>
</router-link>

<router-link to="/wishlist">
  <button class="dropdown-btn">My Wishlist</button>
</router-link>

<router-link to="/profile">
  <button class="dropdown-btn">My Details</button>
</router-link>

        </div>
      </div>
    </div>

    <!-- Hero Section -->
    <div class="hero">
      <h2>Discover Your Favorite Trading Cards</h2>
      <p>Search through thousands of trading cards, including Magic, Pokémon, and Yu-Gi-Oh!</p>
      <div class="search-bar">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search for cards, categories, or sets..." 
          @keydown.enter="searchCards" 
        />
        <button @click="searchCards">Search</button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main" id="card-container">
      <div 
        v-for="card in filteredCards" 
        :key="card.name" 
        class="card" 
        @click="openModal(card)"
      >
        <img :src="card.imageUrl" :alt="card.name">
        <h3>{{ card.name }}</h3>
        <p>{{ card.description }}</p>
        <p><b>Category:</b> {{ card.category }}</p>
      </div>
    </div>

    <div v-if="showPopularModal" class="modal" @click="closePopularModal">
      <div class="modal-content" @click.stop>
        <h2 style="text-align: center; color: #4CAF50;">Most Popular</h2>
        <div class="popular-cards">
          <div 
            v-for="card in popularCards" 
            :key="card.name" 
            class="card fancy-card"
          >
            <img :src="card.imageUrl" :alt="card.name">
            <h3>{{ card.name }}</h3>
            <p>{{ card.description }}</p>
            <p><b>Category:</b>{{ card.category }}</p>
          </div>
        </div>
        <button class="close-btn" @click="closePopularModal">Close</button>
      </div>
    </div>


<!-- Modal -->
<div v-if="selectedCard" class="modal" @click="closeModal">
  <div class="modal-content" @click.stop>
    <img :src="modalData.imageUrl" :alt="modalData.name" />
    <h3>{{ selectedCard.name }}</h3>
    <img :src="selectedCard.imageUrl" :alt="selectedCard.name">
    <p>{{ selectedCard.description }}</p>
    <p><b>Category:</b> {{ selectedCard.category }}</p>
    <p><b>Price:</b> ${{ selectedCard.price }}</p>
    <p><b>Release Year:</b> {{ selectedCard.year }}</p>
    <canvas id="priceTrendChart" width="2000" height="1200"></canvas>
    <div class="modal-buttons">
      <button class="wishlist-btn" @click="addToWishlist">Add to Wishlist</button>
      <button class="collection-btn" @click="addToCollection">Add to Collection</button>
    </div>
    <button class="close-btn" @click="closeModal">Close</button>
  </div>
</div>



    <!-- Modal -->
    <div v-if="isModalOpen" class="modal">
      <div v-if="modalData" class="modal">
  <div class="modal-content">
    <div class="modal-header">{{ modalData.name }}</div>
    <div class="modal-body">
      <p><strong>Last Sold Price:</strong> {{ modalData.price }}</p>
      <p><strong>Release Year:</strong> {{ modalData.year }}</p>
      <p><strong>Category:</strong> {{ modalData.category }}</p>
      <p><strong>Price Trend:</strong></p>
      <ul class="price-trend-list">
        <li v-for="(trend, index) in modalData.priceTrend" :key="index">
          {{ trend.date }}: {{ trend.price }}
        </li>
      </ul>
      <canvas id="priceTrendChart" width="400" height="200"></canvas>
    </div>
    <div class="modal-buttons">
      <button class="wishlist-btn" @click="addToWishlist">Add to Wishlist</button>
      <button class="collection-btn" @click="addToCollection">Add to Collection</button>
    </div>
    <button class="close-btn" @click="closeModal">Close</button>
  </div>
  </div>
</div>


    <!-- Footer -->
    <div class="footer">
      © 2024 CardStox | Made with ♥ by <a href="#">Dominik Sambolec</a>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted,watch, nextTick } from 'vue';
import { useRouter } from "vue-router"; 
import { RouterLink } from 'vue-router';
import Collection from './Collection.vue'; // Import the Collection component
import Wishlist from './Wishlist.vue';


export default {
  name: 'App',
  components: {
    Collection, // Register the Collection component
    Wishlist, // Register the Wishlist component
  },
  setup() {






    nextTick(() => {
        const canvas = document.getElementById("priceTrendChart");
        if (canvas) {
          initializeChart(canvas);
        } else {
          console.error("Canvas element not found after DOM update.");
        }
      });

function generateFakePriceTrend(basePrice) {
  const priceTrend = [];
  const base = parseFloat(basePrice.replace('$', ''));
  let currentPrice = base;

  // Generate trends for the last 10 days
  for (let i = 9; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    // Random fluctuation: ±5% of the base price
    const fluctuation = (Math.random() - 0.5) * 0.1 * base;
    currentPrice = parseFloat((currentPrice + fluctuation).toFixed(2));
    
    // Ensure no negative price
    currentPrice = Math.max(0, currentPrice);

    priceTrend.push({
      date: date.toISOString().split('T')[0], // Format as YYYY-MM-DD
      price: `$${currentPrice.toFixed(2)}`,
    });
  }

  return priceTrend;
}







const cards = ref([
  { name: "BlackLotus", imageUrl: "https://th.bing.com/th/id/OIP.lEBzHawiOVECEhY-Ljg7GAHaKV?rs=1&pid=ImgDetMain", description: "A cursed powerful flower", price: "$150", year: "1993", category: "Magic: The Gathering", priceTrend: generateFakePriceTrend("$150") },
  { name: "Pikachu", imageUrl: "https://th.bing.com/th/id/OIP.F1FP7pDna6eSm77EGoe0LAHaJ5?rs=1&pid=ImgDetMain", description: "Electrical menace", price: "$120", year: "1996", category: "Pokemon", priceTrend: generateFakePriceTrend("$150") },
  { name: "Blue Eyes Ultimate Dragon", imageUrl: "https://th.bing.com/th/id/OIP.7Zaj98ryYXkH2XYqC8vkgwHaKu?rs=1&pid=ImgDetMain", description: "Magical dragon which transcends time and space.", price: "$100", year: "1999", category: "Yu-Gi-Oh!", priceTrend: generateFakePriceTrend("$150") },
  { name: "Guilmon", imageUrl: "https://th.bing.com/th/id/OIP.OOra0tdXDcz09uizOLQaRAHaKU?rs=1&pid=ImgDetMain", description: "Fiery dragon", price: "$90", year: "1997", category: "Digimon", priceTrend: generateFakePriceTrend("$150") },
  { name: "Son Goku", imageUrl: "https://th.bing.com/th/id/R.9ab05cbe86ec7395e1c3a96c644d874b?rik=fIhPOgI5z19s3A&pid=ImgRaw&r=0", description: "Like Goku, but angrier.", price: "$80", year: "1989", category: "Dragon Ball", priceTrend: generateFakePriceTrend("$150") },
  { name: "Charizard", imageUrl: "https://th.bing.com/th/id/OIP.guz6dM50uI69AqoOx_ksGwHaKZ?rs=1&pid=ImgDetMain", description: "The legendary fire-breathing lizard.", price: "$250", year: "1999", category: "Pokemon", priceTrend: generateFakePriceTrend("$250") },
  { name: "Dark Magician", imageUrl: "https://th.bing.com/th/id/R.1909d5f5ea6334a30dbeb858446a1e46?rik=UwlWgkdD34GZDw&pid=ImgRaw&r=0", description: "The ultimate wizard in terms of attack and defense.", price: "$120", year: "1999", category: "Yu-Gi-Oh!", priceTrend: generateFakePriceTrend("$120") },
  { name: "Angemon", imageUrl: "https://th.bing.com/th/id/OIP.BSOVQ8IHqiFGXRfucEbn8gAAAA?w=208&h=291&c=7&r=0&o=5&dpr=1.3&pid=1.7",description: "A holy Digimon with powerful angelic energy.", price: "$75", year: "1998", category: "Digimon", priceTrend: generateFakePriceTrend("$75") },
  { name: "Vegeta", imageUrl: "https://th.bing.com/th/id/OIP.FOvkh5iCHsz2N1yvu8y4LwAAAA?rs=1&pid=ImgDetMain", description: "The Saiyan prince with immense pride.", price: "$90", year: "1990", category: "Dragon Ball", priceTrend: generateFakePriceTrend("$90") },
  { name: "Mox Sapphire", imageUrl: "https://th.bing.com/th/id/OIP.giTmm38-VRLUC6HeGfuOSAHaKX?rs=1&pid=ImgDetMain", description: "A jewel of untapped magical power.", price: "$5,000", year: "1993", category: "Magic: The Gathering", priceTrend: generateFakePriceTrend("$5000") },
  { name: "Mewtwo", imageUrl: "https://th.bing.com/th/id/OIP.b8N-WKRYEQCmdp934MB7-AHaKV?rs=1&pid=ImgDetMain",description: "A genetically engineered psychic Pokemon.", price: "$200", year: "1996", category: "Pokemon", priceTrend: generateFakePriceTrend("$200") },
  { name: "Red Eyes Black Dragon",imageUrl:"https://product-images.tcgplayer.com/285209.jpg", description: "A dragon with a fiery soul.", price: "$110", year: "1999", category: "Yu-Gi-Oh!", priceTrend: generateFakePriceTrend("$110") },
  { name: "Frieza", imageUrl:'https://th.bing.com/th/id/OIP.KHX2Kq9k4DqzsDN4SArazwAAAA?w=395&h=550&rs=1&pid=ImgDetMain',description: "The galactic tyrant with an array of transformations.", price: "$85", year: "1990", category: "Dragon Ball", priceTrend: generateFakePriceTrend("$85") },
  { name: "Time Walk", imageUrl:"https://th.bing.com/th/id/R.96451a9f3fb704ac49348d2491e01653?rik=cg6piocrEcZKXg&pid=ImgRaw&r=0",description: "Take an extra turn and manipulate time.", price: "$3,500", year: "1993", category: "Magic: The Gathering", priceTrend: generateFakePriceTrend("$3500") },
  { name: "Blastoise", imageUrl:"https://th.bing.com/th/id/OIP.gX6Y0KWNA-IEBdVh7gWDIQHaKL?w=208&h=286&c=7&r=0&o=5&dpr=1.3&pid=1.7",description: "The water cannon turtle.", price: "$190", year: "1999", category: "Pokemon", priceTrend: generateFakePriceTrend("$190") },
  { name: "Exodia the Forbidden One", imageUrl:"https://th.bing.com/th/id/OIP.QeaW0bXijZfaBUmsWlFuwAHaKz?rs=1&pid=ImgDetMain",description: "Legendary pieces combine for ultimate power.", price: "$150", year: "1999", category: "Yu-Gi-Oh!", priceTrend: generateFakePriceTrend("$150") },
  { name: "MetalGarurumon", imageUrl:"https://th.bing.com/th/id/OIP.CL8VIIB4A3aXdEgQ-DTp3QHaHa?rs=1&pid=ImgDetMain",description: "A machine-like wolf with devastating attacks.", price: "$85", year: "1999", category: "Digimon", priceTrend: generateFakePriceTrend("$85") },
  { name: "Gohan", imageUrl:"https://th.bing.com/th/id/OIP.7GkmSYGo54I2JxtULaWNRwAAAA?w=208&h=282&c=7&r=0&o=5&dpr=1.3&pid=1.7",description: "The half-Saiyan warrior with great potential.", price: "$70", year: "1991", category: "Dragon Ball", priceTrend: generateFakePriceTrend("$70") },
  { name: "Force of Will", imageUrl:"https://th.bing.com/th/id/R.0b315a799c68f08754dbd05874b1c6c4?rik=w1UzOtb2litZkQ&pid=ImgRaw&r=0",description: "A counterspell of immense power.", price: "$200", year: "1994", category: "Magic: The Gathering", priceTrend: generateFakePriceTrend("$200") },
  { name: "Lugia", imageUrl:"https://th.bing.com/th/id/OIP.H8cvznsi1LGShkfaa4jTcwHaKU?w=208&h=291&c=7&r=0&o=5&dpr=1.3&pid=1.7",description: "The guardian of the seas.", price: "$210", year: "2000", category: "Pokemon", priceTrend: generateFakePriceTrend("$210") },
  { name: "Slifer the Sky Dragon",imageUrl:"https://th.bing.com/th/id/R.e932af9d97c855bc09a30e6c58968261?rik=qFemhlDaIm7%2f7g&pid=ImgRaw&r=0", description: "The divine beast with incredible strength.", price: "$125", year: "2001", category: "Yu-Gi-Oh!", priceTrend: generateFakePriceTrend("$125") },
  { name: "Omnimon", imageUrl:"https://th.bing.com/th/id/R.bf8510e52909e9ff5122636faaec396e?rik=%2ftPrSQgYwvQI6Q&pid=ImgRaw&r=0",description: "The ultimate fusion of two legendary Digimon.", price: "$150", year: "2000", category: "Digimon", priceTrend: generateFakePriceTrend("$150") },
  { name: "Majin Buu",imageUrl:"https://th.bing.com/th/id/R.bf8510e52909e9ff5122636faaec396e?rik=%2ftPrSQgYwvQI6Q&pid=ImgRaw&r=0", description: "The chaotic force of destruction.", price: "$90", year: "1994", category: "Dragon Ball", priceTrend: generateFakePriceTrend("$90") },
]);



    const categories = ref([
      "Pokemon",
      "Yu-Gi-Oh!",
      "Magic: The Gathering",
      "Digimon",
      "Dragon Ball"
    ]);

    const wishlist = ref([]);
    const collection = ref([]);
    const searchQuery = ref('');
    const modalData = ref(null); 
    const isModalOpen = ref(false); // Track modal state
    const dropdownVisible = ref(false);
    const selectedCard = ref(null);
    const categoriesVisible = ref(false);  // Add a reactive variable for category visibility
    const router = useRouter();

    const popularCards = computed(() => {
      const shuffled = [...cards.value].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 2); // Pick 2 random cards
    });

    const showPopularModal = ref(false);

    const showPopularCards = () => {
      showPopularModal.value = true;
    };

    const closePopularModal = () => {
      showPopularModal.value = false;
    };


    const toggleCategories = () => {
      console.log("Prikaži kategorije");
      categoriesVisible.value = !categoriesVisible.value;  // Toggle the visibility of the category dropdown
      console.log("Bogdaj");
    };
  
    const openDetailedModal = (card)=> {
      modalData.value = card;
      isModalOpen.value = true;
  //selectedCard.value = card;
}

const closeDetailedModal =() => {
  modalData.value = card;
    isModalOpen.value = true;
}

    const totalValue = computed(() => {
      return collection.value.reduce((sum, card) => sum + parseFloat(card.price.replace('$', '')), 0).toFixed(2);
});
    const numCards = computed(() => collection.value.length);




    const searchCards = () => {
      console.log(`Searching for: ${searchQuery.value}`);
    };


    const openModal = (card) => {
      modalData.value = card;
      isModalOpen.value = true;

      nextTick(() => {
        drawPriceTrendChart();
      });
    };

    const closeModal = () => {
      isModalOpen.value = false;
      modalData.value = null;
    };

    const drawPriceTrendChart = () => {
      const canvas = document.getElementById('priceTrendChart');
      if (!canvas) {
        console.error('Canvas element not found.');
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!modalData.value || !modalData.value.priceTrend) {
        console.error('Price trend data is not available.');
        return;
      }

      const prices = modalData.value.priceTrend.map((item) =>
        parseFloat(item.price.replace('$', ''))
      );
      const dates = modalData.value.priceTrend.map((item) => item.date);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const padding = 50;
      const chartWidth = canvas.width - padding * 2;
      const chartHeight = canvas.height - padding * 2;
      const maxPrice = Math.max(...prices);
      const minPrice = Math.min(...prices);

      ctx.beginPath();
      ctx.moveTo(padding, canvas.height - padding);
      ctx.lineTo(padding, padding);
      ctx.lineTo(canvas.width - padding, canvas.height - padding);
      ctx.stroke();

      const points = prices.map((price, index) => {
        const x = padding + (index / (prices.length - 1)) * chartWidth;
        const y =
          canvas.height - padding - ((price - minPrice) / (maxPrice - minPrice)) * chartHeight;
        return { x, y };
      });

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      points.forEach((point) => ctx.lineTo(point.x, point.y));
      ctx.strokeStyle = '#007BFF';
      ctx.stroke();

      points.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#FF5733';
        ctx.fill();
      });

      ctx.font = '12px Arial';
      ctx.fillStyle = '#333';
      points.forEach((point, index) => {
        ctx.fillText(`$${prices[index]}`, point.x - 10, point.y - 10);
        //ctx.fillText(dates[index], point.x - 20, canvas.height - padding + 20);
      });
    };
   
    const navigate = (route) => {
      console.log(`Navigating to: ${route}`);
    };

    const toggleDropdown = () => {
      dropdownVisible.value = !dropdownVisible.value;
    };

    const addToWishlist = () => {
  // Check if the card with the same name already exists in the wishlist
  if (!wishlist.value.some(item => item.name === modalData.value.name)) {
    wishlist.value.push(modalData.value);
    saveData(); // Save to localStorage immediately after modification
  }
  saveData(); // Save to localStorage
  closeModal();
};




    const addToCollection = () => {
  console.log(collection.value.length); // Before adding
  console.log('Provivan dodat u kolekciju');

  if (!collection.value.some(item => item.name === modalData.value.name)) {
    collection.value.push(modalData.value);
    saveData(); // Save to localStorage immediately after modification
  }

  saveData(); // Save to localStorage
  console.log('Prova san dodat u kolekciju i eko ča smo dobili');
  console.log(collection.value.length); // After adding
  closeModal();
  // Navigate to collection page if needed // or router.push('/collection') for non-component methods
};



    const removeFromWishlist = (card) => {
      const index = wishlist.value.indexOf(card);
      if (index !== -1) {
        wishlist.value.splice(index, 1);
      }
      saveData(); // Save to localStorage
    };

    const removeFromCollection = (card) => {
      const index = collection.value.indexOf(card);
      if (index !== -1) {
        collection.value.splice(index, 1);
      }
      saveData(); // Save to localStorage
    };


const selectedCategory = ref(null); // Reactive variable for selected category

const filteredCards = computed(() => {
  let filtered = cards.value;

  if (selectedCategory.value) {
    // Filter by selected category
    filtered = filtered.filter(card => 
      card.category.toLowerCase().includes(selectedCategory.value.toLowerCase())
    );
  }

  if (searchQuery.value.trim()) {
    // Further filter by search query
    filtered = filtered.filter(card =>
      card.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      card.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      card.category.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  return filtered;
});


const filterByCategory = (category) => {
  selectedCategory.value = category;
  console.log(`Filtering by category: ${category}`);
};

const saveData = () => {
      localStorage.setItem('wishlist', JSON.stringify(wishlist.value));
      localStorage.setItem('collection', JSON.stringify(collection.value));
    };

    // Load data from localStorage
const loadData = () => {
      const savedWishlist = localStorage.getItem('wishlist');
      const savedCollection = localStorage.getItem('collection');

      if (savedWishlist) {
        wishlist.value = JSON.parse(savedWishlist);
      }

      if (savedCollection) {
        collection.value = JSON.parse(savedCollection);
      }
    };


    watch(
      () => modalData.value,
      (newValue) => {
        if (newValue && newValue.priceTrend) {
          nextTick(() => {
            drawPriceTrendChart();
          });
        }
      }
    );

    onMounted(() => {
      console.log("Component mounted. Modal is empty until a card is clicked.");
    });

    

return {
  cards,
  wishlist,
  collection,
  searchQuery,
  filteredCards,
  isModalOpen,
  modalData,
  searchCards,
  openModal,
  closeModal,
  navigate,
  addToWishlist,
  addToCollection,
  dropdownVisible,
  toggleDropdown,
  totalValue,
  numCards,
  removeFromWishlist,
  removeFromCollection,
  openDetailedModal,
  closeDetailedModal,
  categories,
  categoriesVisible,
  toggleCategories,
  selectedCategory,
  filterByCategory,
  popularCards,
  showPopularModal,
  showPopularCards,
  closePopularModal
};

    
  }
};
</script>

<style>
body {
    margin: 0;
    font-family: Arial, sans-serif;
    background-color: #74B49B; /* Soft green background */
}

/* Navbar */
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background-color: #6F4F28; /* Brownish */
}

.navbar h1 {
    color: #2F4F2F; /* Dark green */
    margin: 0;
}

.nav-links {
    display: flex;
    gap: 20px;
    position: relative;
}

.nav-links button {
    background-color: #A8D5BA; /* Light green */
    border: none;
    border-radius: 20px;
    padding: 8px 15px;
    cursor: pointer;
    font-size: 16px;
    position: relative;
}

.nav-links button:hover {
    background-color: #74B49B; /* Hover with darker green */
}

/* Profile Button & Dropdown */
.profile-btn, .dropdown-btn {
    background-color: #A8D5BA; /* Light green */
    border: none;
    border-radius: 20px;
    padding: 8px 15px;
    cursor: pointer;
    font-size: 16px;
    position: relative;
}

.profile-btn:hover, .dropdown-btn:hover {
    background-color: #74B49B; /* Darker green on hover */
}

/* Hero Section */
.hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 50px 20px;
    background: linear-gradient(to right, #74B49B, #A8D5BA);
    text-align: center;
    color: #fff;
}

.hero h2 {
    font-size: 48px;
    margin: 0;
}

.hero p {
    font-size: 20px;
    margin: 15px 0;
}

.search-bar {
    display: flex;
    width: 50%;
    max-width: 600px;
    border-radius: 30px;
    overflow: hidden;
    background-color: #fff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.search-bar input {
    flex: 1;
    padding: 10px 20px;
    border: none;
    outline: none;
    font-size: 16px;
}

.search-bar button {
    background-color: #6F4F28; /* Brownish */
    color: #fff;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    font-size: 16px;
}

.search-bar button:hover {
    background-color: #5A3A1C; /* Darker brown */
}

/* Main Content */
.main {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 20px;
    padding: 20px;
}

.card {
    width: 200px;
    height: 250px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    text-align: center;
    padding: 10px;
}

.card img {
    max-width: 80%;
    max-height: 150px;
    margin-bottom: 10px;
}

.card:hover {
    transform: scale(1.05);
    transition: transform 0.2s;
}

/* Footer */
.footer {
    background-color: #6F4F28; /* Brownish */
    color: #fff;
    text-align: center;
    padding: 15px 20px;
    font-size: 14px;
    margin-top: 30px;
}

.footer a {
    color: #A8D5BA; /* Light green */
    text-decoration: none;
    font-weight: bold;
}

.footer a:hover {
    text-decoration: underline;
}

/* Modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex; /* Ensure the modal is centered */
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  z-index: 1000;
}

.modal .price-trend-list {
  margin: 10px 0;
  padding-left: 20px;
  list-style-type: disc; /* Adds bullet points */
}

.modal .price-trend-list li {
  margin-bottom: 5px;
  font-size: 14px;
  color: #333;
}


.modal-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    width: 80%;
    max-width: 400px;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.modal-header {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
}

.modal-body {
    font-size: 18px;
    margin-bottom: 20px;
}

.modal-buttons button {
    margin: 5px;
    padding: 10px 20px;
    cursor: pointer;
    border: none;
    border-radius: 20px;
    font-size: 16px;
}

.wishlist-btn {
    background-color: #6F4F28; /* Brownish */
    color: #fff;
}

.collection-btn {
    background-color: #A8D5BA; /* Light green */
    color: #fff;
}

.close-btn {
    background-color: #FF6347; /* Tomato red */
    color: #fff;
    border-radius: 20px;
    font-size: 18px;
    cursor: pointer;
}

.close-btn:hover {
    background-color: #FF4500; /* Darker tomato red */
}

/* Dropdown */
/* Hide the dropdown initially */
.profile-dropdown {
  position: relative;
}

.dropdown {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #fff;
  border-radius: 5px;
  padding: 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-width: 200px; /* Optional: Ensure a minimum width */
  flex-direction: column; /* Ensures vertical stacking */
}

.profile-dropdown:hover .dropdown {
  display: block;
}

.dropdown a {
  display: block; /* Ensures vertical stacking */
  padding: 10px 15px;
  text-decoration: none;
  color: #333;
  border-radius: 5px;
  margin: 2px 0;
}

.dropdown a:hover {
  background-color: #f1f1f1;
}

.wishlist-section, .collection-section {
  margin-top: 20px;
  padding: 10px;
  background-color: #f9f9f9;
}

.card-container {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.card img {
  max-width: 100px;
  max-height: 100px;
  margin-bottom: 10px;
}

.card h3 {
  font-size: 16px;
  margin: 0;
}

.remove-btn {
  background-color: red;       /* Red background */
  color: white;                /* White text */
  border: none;                /* No border */
  padding: 5px 10px;           /* Padding for better click area */
  border-radius: 5px;          /* Rounded corners */
  cursor: pointer;            /* Pointer cursor on hover */
  font-size: 14px;             /* Font size */
  transition: background-color 0.3s ease; /* Smooth color transition */
}

.remove-btn:hover {
  background-color: darkred;   /* Darker red on hover */
}

.fancy-card {
  display: inline-block;
  margin: 10px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s, box-shadow 0.3s;
}

.fancy-card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.close-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.close-btn:hover {
  background-color: #d32f2f;
}

.card-image {
  width: 100%;
  height: auto;
  object-fit: cover; /* Ensures the image covers the area without distortion */
}

</style>
