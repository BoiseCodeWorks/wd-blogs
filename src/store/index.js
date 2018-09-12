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
        activeBlog: {},
        comments: []
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
        },
        setComments(state, comments) {
            state.comments = comments
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
            db.collection('blogs').where("creatorId", "==", state.user.uid).get().then(querySnapShot => {
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
                dispatch('getComments', blog.id)
            })
        },
        deleteBlog({ commit, dispatch }, blog) {
            db.collection('blogs').doc(blog.id).delete().then(doc => {
                console.log(doc)
                router.push('/')
            })
        },
        //#endregion
        //#region comments
        createComment({ commit, dispatch }, newComment) {
            db.collection("blogs").doc(newComment.blogId).collection('comments').add(newComment).then(doc => {
                console.log("Created Comment!")
            })
        },
        getComments({ commit, dispatch }, blogId) {
            //this is for a parent level collect of comments(equal level as blogs)
            // db.collection('comments').where("blogId", "==", blogId).onSnapshot(querySnapShot => {
            //this is for a sub collection that only exists on an individual blog level
            db.collection('blogs').doc(blogId).collection('comments').onSnapshot(querySnapShot => {
                let comments = []
                querySnapShot.forEach(doc => {
                    let comment = doc.data()
                    comment.id = doc.id
                    comments.push(comment)
                })
                commit('setComments', comments)
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