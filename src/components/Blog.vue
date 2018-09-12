<template>
  <div class="blog">
    <h1>{{blog.title}}</h1>
    <h5 v-if="blog.author">Written by {{blog.author}}</h5>
    <p>{{blog.body}}</p>
    <button type="button" @click="deleteBlog(blog)">Delete</button>
    <h3>Add Comment</h3>
    <form @submit.prevent="createComment(); newComment = {}">
      <input type="text" name="description" id="description" v-model="newComment.description" required>
      <button type="submit">comment</button>
    </form>
    <div v-for="(comment, index) in comments">
      {{comment.description}}
    </div>
  </div>
</template>


<script>
  export default {
    name: "blog",
    data() {
      return {
        newComment: {}
      };
    },
    mounted() {
      this.$store.dispatch("getBlog", this.$route.params.blogId);
    },
    computed: {
      blog() {
        return this.$store.state.activeBlog;
      },
      user() {
        return this.$store.state.user
      },
      comments() {
        return this.$store.state.comments
      }
    },
    methods: {
      deleteBlog(blog) {
        this.$store.dispatch("deleteBlog", blog);
      },
      createComment() {
        this.newComment.creatorId = this.user.uid
        this.newComment.blogId = this.blog.id
        this.$store.dispatch('createComment', this.newComment)
      }
    },
    components: {}
  };
</script>


<style scoped>
</style>