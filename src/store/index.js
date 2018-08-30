import vue from "vue"
import vuex from 'vuex'
import router from '../router'
import firebase from 'firebase/app'
import 'firebase/auth'
import db from '../utils/firebaseInit'

vue.use(vuex)

export default new vuex.Store({
    state: {
        user: {},
        blogs: [],
        myBlogs: [],
        activeBlog: {}
    },
    mutations: {
        setUser(state, user) {
            state.user = user
        },
        setBlogs(state, blogs) {
            state.blogs = blogs
        },
        setMyBlogs(state, blogs) {
            state.myBlogs = blogs
        },
        setActiveBlog(state, blog) {
            state.activeBlog = blog
        }
    },
    actions: {
        //#region Blogs
        createBlog({ commit, dispatch }, newBlog) {
            db.collection('blogs').add(newBlog).then(doc => {
                console.log("Created Blog with ID: ", doc.id)
                dispatch('getBlogs')
            })
        },
        getBlogs({ commit, dispatch }) {
            db.collection('blogs').get().then(querySnapShot => {
                let blogs = []
                querySnapShot.forEach(doc => {
                    if (doc.exists) {
                        let blog = doc.data()
                        blog.id = doc.id
                        blogs.push(blog)
                    }
                })
                commit('setBlogs', blogs)
            })
        },
        getMyBlogs({ state, commit, dispatch }) {
            db.collection('blogs').where("author", "==", state.user.email).get().then(querySnapShot => {
                let blogs = []
                querySnapShot.forEach(doc => {
                    if (doc.exists) {
                        let blog = doc.data()
                        blog.id = doc.id
                        blogs.push(blog)
                    }
                })
                commit('setMyBlogs', blogs)
            })
        },
        getBlog({ commit, dispatch }, blogId) {
            db.collection('blogs').doc(blogId).get().then(doc => {
                let blog = doc.data()
                blog.id = doc.id
                commit('setActiveBlog', blog)
            })
        },
        //#endregion
        //#region Auth        
        register({ commit, dispatch }, newUser) {
            firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
                .then(res => {
                    commit('setUser', res)
                    router.push({ name: 'Dashboard' })
                }).catch(err => {
                    console.error(err)
                })
        },
        login({ commit, dispatch }, creds) {
            firebase.auth().signInWithEmailAndPassword(creds.email, creds.password)
                .then(res => {
                    commit('setUser', res.user)
                    router.push({ name: 'Dashboard' })
                }).catch(err => {
                    console.error(err)
                })
        },
        authenticate({ commit, dispatch }) {
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    commit('setUser', user)
                    dispatch('getMyBlogs')
                    // router.push({ name: 'Dashboard' })
                } else {
                    commit('setUser', {})
                    router.push({ name: 'Login' })
                }
            })
        },
        logout({ commit, dispatch }) {
            firebase.auth().signOut()
                .then(res => {
                    commit('setUser', {})
                    router.push({ name: 'Login' })
                })
                .catch(err => {
                    console.error(err)
                })
        }
        //#endregion
    }
})