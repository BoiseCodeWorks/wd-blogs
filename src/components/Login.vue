<template>
    <div class="login">
        <form @submit.prevent="login(creds);creds = {}">
            <input type="email" name="email" id="email" placeholder="Email" v-model="creds.email">
            <input type="password" name="password" id="password" placeholder="Password" v-model="creds.password">
            <button type="submit">Login</button>
        </form>
    </div>
</template>


<script>
    export default {
        name: 'login',
        data() {
            return {
                creds: {

                }
            }
        },
        computed: {},
        methods: {
            login(creds) {
                this.$store.dispatch('login', creds)
            }
        },
        components: {}
    }
</script>


<style scoped>
</style>