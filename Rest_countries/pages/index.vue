<template>
  <div class="container">
    <!-- Search box with a search button -->
    <div class="search_container">
      <div class="input_wrapper">
        <input
          type="text"
          v-model="searchQuery"
          @keyup.enter="searchCountries"
          placeholder="Search for a country..."
          class="search_input"
        />
      </div>

      <!-- Search Button -->
    </div>

    <!-- Region Filter Dropdown -->
    <div class="filter-container">
      <!-- Region Filter Dropdown -->
      <SelectRoot
        class="SelectRoot"
        :model-value="selectedRegion"
        @update:modelValue="onRegionChange"
      >
        <SelectTrigger class="SelectTrigger">
          <SelectValue placeholder="Filter by Region" />
          <!-- Optionally add an icon for the dropdown -->
          <Icon icon="radix-icons:chevron-down" />
        </SelectTrigger>

        <!-- Dropdown Content (Select Portal) -->
        <SelectPortal>
          <SelectContent class="SelectContent" :side-offset="5">
            <!-- Scrollable dropdown -->
            <SelectScrollUpButton class="SelectScrollButton">
              <Icon icon="radix-icons:chevron-up" />
            </SelectScrollUpButton>

            <SelectViewport class="SelectViewport">
              <!-- Options in the dropdown -->
              <SelectItem value="Africa" class="SelectItem">
                <SelectItemIndicator class="SelectItemIndicator">
                  <Icon icon="radix-icons:check" />
                </SelectItemIndicator>
                <SelectItemText>Africa</SelectItemText>
              </SelectItem>
              <SelectItem value="Americas" class="SelectItem">
                <SelectItemIndicator class="SelectItemIndicator">
                  <Icon icon="radix-icons:check" />
                </SelectItemIndicator>
                <SelectItemText>Americas</SelectItemText>
              </SelectItem>
              <SelectItem value="Asia" class="SelectItem">
                <SelectItemIndicator class="SelectItemIndicator">
                  <Icon icon="radix-icons:check" />
                </SelectItemIndicator>
                <SelectItemText>Asia</SelectItemText>
              </SelectItem>
              <SelectItem value="Europe" class="SelectItem">
                <SelectItemIndicator class="SelectItemIndicator">
                  <Icon icon="radix-icons:check" />
                </SelectItemIndicator>
                <SelectItemText>Europe</SelectItemText>
              </SelectItem>
              <SelectItem value="Oceania" class="SelectItem">
                <SelectItemIndicator class="SelectItemIndicator">
                  <Icon icon="radix-icons:check" />
                </SelectItemIndicator>
                <SelectItemText>Oceania</SelectItemText>
              </SelectItem>
            </SelectViewport>

            <SelectScrollDownButton class="SelectScrollButton">
              <Icon icon="radix-icons:chevron-down" />
            </SelectScrollDownButton>
          </SelectContent>
        </SelectPortal>
      </SelectRoot>
    </div>
  </div>
  <!-- Show an error message if the fetch fails -->
  <div v-if="error" class="error-message">
    <p>{{ error }}</p>
  </div>

  <!-- Show loading message only when data is being fetched -->
  <div
    v-else-if="displayedCountries.length === 0 && !searchQuery"
    class="loading-message"
  >
    <p>Loading countries...</p>
  </div>

  <!-- Display countries or a message if no countries match -->
  <!-- <div v-if="filteredCountries.length > 0" class="country_cards">
    <CountryCard
      v-for="country in filteredCountries"
      :key="country.cca3"
      :country="country"
    />
  </div> -->

  <div v-if="paginatedCountries.length > 0" class="country_cards">
    <CountryCard
      v-for="country in paginatedCountries"
      :key="country.cca3"
      :country="country"
    />
  </div>

  <!-- Show More button -->
  <div
    v-if="paginatedCountries.length < filteredCountries.length"
    class="pagination"
  >
    <button @click="loadMore" class="show-more-btn">Show More</button>
  </div>

  <!-- Show 'No countries match your search' when filteredCountries is empty -->
  <div
    v-else-if="filteredCountries.length === 0 && searchQuery"
    class="no_results-message"
  >
    <p>No countries match your search.</p>
  </div>
</template>

<script setup>
import {
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectPortal,
  SelectItemIndicator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  SelectViewport,
} from "radix-vue";
import { Icon } from "@iconify/vue";

// Define reactive variables
const selectedRegion = ref(""); // For selected region
const displayedCountries = ref([]); // For countries displayed based on selected region
const error = ref(null); // Error state for failed API requests
const searchQuery = ref(""); // For search query input
const paginatedCountries = ref([]); // Initialize as an empty array
const currentPage = ref(1); // Tracks the current page
const itemsPerPage = 8; // Number of countries per page

// Function to fetch all countries
async function fetchAllCountries() {
  try {
    const apiUrl = "https://restcountries.com/v3.1/all";
    const response = await fetch(apiUrl);
    const data = await response.json();
    displayedCountries.value = data;
  } catch (err) {
    console.error("Error fetching countries:", err);
    error.value = "Failed to load countries.";
  }
}

// Function to handle region change
async function onRegionChange(region) {
  selectedRegion.value = region;
  try {
    const apiUrl = region
      ? `https://restcountries.com/v3.1/region/${region}`
      : "https://restcountries.com/v3.1/all";
    const response = await fetch(apiUrl);
    const data = await response.json();
    displayedCountries.value = data;
  } catch (err) {
    console.error("Error fetching countries by region:", err);
    error.value = "Error fetching countries.";
  }
}

// Watch for changes in search query or region filter
watch([searchQuery, selectedRegion], () => {
  currentPage.value = 1; // Reset to the first page when filters change
});

// Computed property to filter countries based on the search query and region
const filteredCountries = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return displayedCountries.value.filter((country) => {
    const matchesSearch = country.name.common.toLowerCase().includes(query);
    const matchesRegion =
      !selectedRegion.value || country.region === selectedRegion.value;
    return matchesSearch && matchesRegion;
  });
});

// Watch for changes in filtered countries and update pagination
watch([filteredCountries, currentPage], () => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  paginatedCountries.value = filteredCountries.value.slice(start, end);
});

// Load countries initially
onMounted(() => {
  fetchAllCountries();
});

// Function to load more countries (pagination)
function loadMore() {
  currentPage.value += 1;
}
</script>

<style scoped>
.country_cards {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  padding-bottom: 2rem;
}

.container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1.5rem;
  justify-content: center;
}

.search_container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.input_wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.search_input {
  width: 100%;
  font-size: var(--size-base);
  border: none;
  background-color: var(--card-bg);
  box-shadow: var(--bs);
  border-radius: var(--br);
  padding: 0.75rem 1.5rem;
}

.no_results-message {
  text-align: center;
  font-size: var(--size-sm);
  color: var(--clr-secondary-1);
}

/* ms lq */
@media (min-width: 1440px) {
  .container {
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 1.75rem;
  }

  .country_cards {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }

  .search_input {
    width: 400px;
  }
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.show-more-btn {
  padding: 0.75rem 1.5rem;
  font-size: var(--size-sm);
  background-color: var(--card-bg);
  color: var(--text-light);
  margin-top: 1rem;
  border-radius: var(--br);
  margin-bottom: 1.75rem;
  box-shadow: var(--bs);
}

.show-more-btn:hover {
  background-color: var(--primary-dark);
}
/*  */
</style>
