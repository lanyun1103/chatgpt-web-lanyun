<script>
export default {
  created() {
    const token = localStorage.getItem('token')
    if (!token) {
      this.$router.push('/')
    }
    else {
      this.$http.get('/verify', { headers: { Authorization: `Bearer ${token}` } }).then((response) => {
        console.log('Verified user: ', response.data)
      }).catch((error) => {
        console.error('Error verifying token: ', error)
        this.$router.push('/')
      })
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token')
      this.$router.push('/')
    },
  },
}
</script>

<template>
  <div>
    <h1>Welcome to the Dashboard</h1>
    <button @click="logout">
      Logout
    </button>
  </div>
</template>
