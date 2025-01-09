<template>
    <div>
      <h1>Scraped Data</h1>
      <div v-if="error" class="error">{{ error }}</div>
      <div v-if="scrapedData" class="scraped-data">
        <h2>{{ scrapedData.title }}</h2>
        <img :src="scrapedData.image" alt="Scraped Image" />
        <p>{{ scrapedData.description }}</p>
      </div>
      <button @click="scrapeData">Scrape Data</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'ScraperComponent',
    data() {
      return {
        scrapedData: null,
        error: null
      };
    },
    methods: {
  scrapeData() {
    try {
      const targetElement = document.querySelector('.target-element');
      if (!targetElement) {
        throw new Error('Target element is missing');
      }

      const data = targetElement.textContent?.trim();
      if (!data) {
        throw new Error('Target element is empty');
      }

      this.scrapedData = { title: data }; // Update as per your requirement
      this.error = null; // Clear any previous error
    } catch (error) {
      console.error('Scrape error:', error.message);
      this.scrapedData = null;
      this.error = error.message; // Display the error in the UI
    }
  }
}

};
  </script>
  
  <style scoped>
  .error {
    color: red;
  }
  .scraped-data {
    margin-top: 20px;
  }
  </style>
  