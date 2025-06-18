<template>
  <div>
    <NavBar />
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <h2 class="mb-4">
            <i class="fas fa-info-circle text-primary me-2"></i>About the System
          </h2>
          <div class="card shadow">
            <div class="card-body">
              <p>This is a professional product registration system built with:</p>
              <ul class="list-group list-group-flush mb-3">
                <li class="list-group-item">
                  <i class="fab fa-vuejs text-success me-2"></i>Vue.js 3
                </li>
                <li class="list-group-item">
                  <i class="fab fa-laravel text-danger me-2"></i>Laravel API
                </li>
                <li class="list-group-item">
                  <i class="fab fa-bootstrap text-primary me-2"></i>Bootstrap 5
                </li>
              </ul>
              <router-link to="/" class="btn btn-outline-primary">
                <i class="fas fa-arrow-left me-2"></i>Back to Home
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'

export default {
  name: 'AboutView',
  components: {
    NavBar
  }
}
</script>