<template>
    <div class="register">
        <form @submit.prevent="register(newUser);newUser = {}">
            <input type="email" name="email" id="email" placeholder="Email" v-model="newUser.email">
            <input type="password" name="password" id="password" placeholder="Password" v-model="newUser.password">
            <button type="submit">Register</button>
        </form>
    </div>
</template>


<script>
    export default {
        name: 'register',
        data() {
            return {
                newUser: {

                }
            }
        },
        computed: {},
        methods: {
            register(newUser) {
                this.$store.dispatch('register', newUser)
            }
        },
        components: {}
    }
</script>


<style scoped>
</style>