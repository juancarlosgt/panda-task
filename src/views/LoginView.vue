<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <Header :is-authenticated="false" />
    
    <div class="flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <AuthForm />
    </div>
  </div>
</template>

<script>
import Header from '../components/Header.vue'
import AuthForm from '../components/AuthForm.vue'

export default {
  name: 'LoginView',
  components: {
    Header,
    AuthForm
  }
}
</script>