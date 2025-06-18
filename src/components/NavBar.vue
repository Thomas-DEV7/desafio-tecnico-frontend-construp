<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div class="container">
            <router-link class="navbar-brand" to="/">
                <i class="fas fa-box-open me-2"></i>Product System
            </router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <router-link class="nav-link" to="/">
                            <i class="fas fa-home me-1"></i> Home
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/products">
                            <i class="fas fa-list me-1"></i> Products
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/about">
                            <i class="fas fa-info-circle me-1"></i> About
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
    name: 'NavBar'
}
</script>

<style>
.navbar {
  margin-bottom: 2rem;
}

.nav-link.router-link-exact-active {
  font-weight: bold;
  border-bottom: 2px solid white;
}

body, html, #app {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
