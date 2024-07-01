<script>
  import AppHeader from './components/AppHeader.vue';
  import AppMain from './components/AppMain.vue';
  import axios from 'axios';

  export default {
    name: 'App',
    components: {
      AppHeader,
      AppMain,
    },
    data(){
      return {
        apiBaseUrl: 'http://127.0.0.1:8000/api',
        apiUrls: {
          documents: '/documents'
        },
        documents: [],
      }
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
      },
      downloadDocument(document){
        const url = this.apiBaseUrl + '/documents/download/' + encodeURIComponent(document.path);
        axios({
          url,
          method: 'GET',
          responseType: 'blob',
        }).then(response => {
          const blob= new Blob([response.data], {type: response.headers['content-type']});
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = document.name;
          link.click();
        }).catch(error => {
          console.log(error);
        })
      }
    },
    created(){
      this.getDocuments();
    }
  }
</script>

<!-- HTML-ZONE -->
<template>
    <AppHeader />
    <AppMain :data="documents" @download="downloadDocument"/>
</template>

<!-- STYLE-ZONE -->
<style scoped>

</style>
