<template>
    <div class="blog">
        <h1>{{blog.title}}</h1>
        <h5 v-if="blog.author">Written by {{blog.author}}</h5>
        <p>{{blog.body}}</p>
        <button type="button" @click="deleteBlog(blog)">Delete</button>
    </div>
</template>


<script>
export default {
  name: "blog",
  data() {
    return {};
  },
  mounted() {
    this.$store.dispatch("getBlog", this.$route.params.blogId);
  },
  computed: {
    blog() {
      return this.$store.state.activeBlog;
    }
  },
  methods: {
    deleteBlog(blog) {
      this.$store.dispatch("deleteBlog", blog);
    }
  },
  components: {}
};
</script>


<style scoped>
</style>