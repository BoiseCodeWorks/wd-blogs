<template>
  <div class="dashboard">
    <form @submit.prevent="createBlog(); newBlog = {}">
      <input type="text" name="title" id="title" v-model="newBlog.title" required>
      <textarea cols="100" rows="10" name="body" id="body" v-model="newBlog.body" required></textarea>
      <button type="submit">Create MasterPiece</button>
    </form>
    <div class="row">
      <router-link style="display: block;" :to="{name: 'Blog', params: {blogId: blog.id}}" v-for="blog in blogs" :key="blog.id">{{blog.title}}</router-link>
    </div>
    <div class="row">
      <div class="col-4" v-for="blog in myBlogs" :key="blog.id">
        <p>{{blog.title}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "dashboard",
  data() {
    return {
      newBlog: {}
    };
  },
  mounted() {
    this.$store.dispatch("getBlogs");
  },
  methods: {
    createBlog() {
      this.newBlog.creatorId = this.user.uid;
      this.$store.dispatch("createBlog", this.newBlog);
    }
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    blogs() {
      return this.$store.state.blogs;
    },
    myBlogs() {
      return this.$store.state.myBlogs;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>