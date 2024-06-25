<script>
  import HelloWorld from './components/HelloWorld.vue';
  import AppHeader from './components/AppHeader.vue';
  import AppMain from './components/AppMain.vue';
  import axios from 'axios';

  export default {
    name: 'App',
    data(){
      return {
        apiBaseUrl: 'http://127.0.0.1:8000/api',
        apiUrls: {
          documents: '/documents'
        },
        documents: [],
      }
    },
    components: {
      HelloWorld,
      AppHeader,
      AppMain,
    },
    methods: {
      getDocuments(){
        axios.get(this.apiBaseUrl + this.apiUrls.documents)
          .then(response => {
            this.documents = response.data;
            console.log(this.documents);
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    created(){
      this.getDocuments();
    }
  }
</script>

<template>
    <AppHeader />
    <AppMain :data="documents"/>
</template>

<style scoped>

</style>
