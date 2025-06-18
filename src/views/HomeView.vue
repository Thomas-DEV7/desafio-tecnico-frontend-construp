<template>
  <div>
    <NavBar />
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-8 text-center">
          <h1 class="display-4 mb-4">
            <i class="fas fa-box-open text-primary me-2"></i>Product Registration System
          </h1>
          <p class="lead">
            Welcome to our product management system. Register and manage your products efficiently.
          </p>
          <router-link to="/products" class="btn btn-primary btn-lg mt-3">
            <i class="fas fa-arrow-right me-2"></i>Go to Products
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'

export default {
  name: 'HomeView',
  components: {
    NavBar
  }
}
</script>

<style scoped>
.display-4 {
  font-weight: 300;
  line-height: 1.2;
}

.lead {
  font-size: 1.25rem;
  font-weight: 300;
}
</style>