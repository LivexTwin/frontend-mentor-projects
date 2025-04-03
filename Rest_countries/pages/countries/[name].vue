<template>
  <div class="country_details">
    <!-- Back Button -->
    <button class="back btn" @click="goBack">
      <Icon name="material-symbols:arrow-left-alt" class="back_btn-icon" /> Back
    </button>

    <!-- Country Details -->
    <div v-if="country" class="country_info">
      <!-- Flag -->
      <img
        :src="country.flags.svg"
        :alt="`${country.name.common} flag`"
        class="flag"
      />

      <!-- General Info -->
      <div class="info">
        <h1>{{ country.name.common }}</h1>

        <div class="info_main">
          <ul>
            <li>
              <strong>Population:</strong>
              {{ country.population }}
            </li>
            <li><strong>Region:</strong> {{ country.region }}</li>
            <li><strong>Subregion:</strong> {{ country.subregion }}</li>
            <li><strong>Capital:</strong> {{ country.capital?.join(", ") }}</li>
          </ul>
        </div>

        <!-- Additional Info -->
        <div class="info_add">
          <ul>
            <li>
              <strong>Top Level Domain:</strong> {{ country.tld?.join(", ") }}
            </li>
            <li><strong>Currencies:</strong> {{ currencies }}</li>
            <li><strong>Languages:</strong> {{ languages }}</li>
          </ul>
        </div>

        <!-- Border Countries -->
        <div v-if="country.borders && country.bordersData" class="borders">
          Border Countries:
          <ul>
            <li
              class="btn btn-2"
              v-for="(name, code) in country.bordersData"
              :key="code"
            >
              {{ name }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { useAsyncData } from "#app";

const route = useRoute();
const router = useRouter();

// Fetch country data with useAsyncData
const { data: country, error } = await useAsyncData("country", async () => {
  const handle = decodeURIComponent(route.params.name).replace(/-/g, " ");
  const apiUrl = `https://restcountries.com/v3.1/all`;
  const countries = await $fetch(apiUrl);

  const matchedCountry = countries.find(
    (c) => c.name.common.toLowerCase() === handle.toLowerCase()
  );

  if (!matchedCountry) {
    throw new Error("Country not found");
  }

  // Fetch border country names if borders exist
  if (matchedCountry.borders?.length) {
    const bordersApiUrl = `https://restcountries.com/v3.1/alpha?codes=${matchedCountry.borders.join(
      ","
    )}`;
    const borderCountries = await $fetch(bordersApiUrl);
    matchedCountry.bordersData = borderCountries.reduce((acc, border) => {
      acc[border.cca3] = border.name.common;
      return acc;
    }, {});
  }

  return matchedCountry;
});

// Computed properties for currencies and languages
const currencies = computed(() =>
  country.value?.currencies
    ? Object.values(country.value.currencies)
        .map((c) => c.name)
        .join(", ")
    : "N/A"
);

const languages = computed(() =>
  country.value?.languages
    ? Object.values(country.value.languages).join(", ")
    : "N/A"
);

// Navigation back to the previous page
function goBack() {
  router.back();
}

async function fetchBorderData(codes) {
  if (!codes || codes.length === 0) return {};
  const apiUrl = `https://restcountries.com/v3.1/alpha?codes=${codes.join(
    ","
  )}`;
  return await $fetch(apiUrl).then((data) =>
    data.reduce((acc, border) => {
      acc[border.cca3] = border.name.common;
      return acc;
    }, {})
  );
}

onMounted(async () => {
  if (country.value?.borders?.length) {
    const bordersData = await fetchBorderData(country.value.borders);
    country.value.bordersData = bordersData;
  }
});
</script>

<style scoped>
.country_details {
  padding: 2rem;
}

.flag {
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  margin-bottom: 2rem;
}

.country_info {
  display: flex;
  flex-direction: column;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.info li {
  font-size: var(--size-sm);

  line-height: 2;
}

.borders ul {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  list-style: none;
  padding-top: 1rem;
}

.back {
  margin-bottom: 2rem;
}

.btn-2 {
  padding: 0.4rem 0.75rem;
}

/* mq lg */
@media (min-width: 1440px) {
  .country_info {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .country_details {
    padding: 0;
  }

  .back {
    margin-bottom: 4rem;
  }

  .flag {
    max-height: 400px;
    object-fit: contain;
  }

  .info {
    display: grid;
    grid-template-rows: auto 1fr auto;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    width: 100%;
    padding: 2rem 5rem;
  }

  .info p {
    font-size: var(--size-base);
    line-height: 2.2;
  }

  .info h1 {
    grid-column: 1 / -1;
    grid-row: 1;
    font-size: var(--size-3xl);
  }

  .info_main {
    grid-column: 1;
    grid-row: 2;
  }

  .info_add {
    grid-column: 2;
    grid-row: 2;
  }

  .borders {
    grid-column: 1 / -1;
    grid-row: 3;
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .borders ul {
    padding-top: unset;
  }

  .back_btn-icon {
    font-size: var(--size-2xl);
  }
}
</style>
