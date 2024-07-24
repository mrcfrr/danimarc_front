<script>
  import AppHeader from './components/AppHeader.vue';
  import AppMain from './components/AppMain.vue';
  import AppFooter from './components/AppFooter.vue';
  import axios from 'axios';


  export default {
    name: 'Danimarc',
    components: {
      AppHeader,
      AppMain,
      AppFooter,
    },
    data(){
      return {
        apiBaseUrl: 'http://127.0.0.1:8000',
        apiUrls: {
          documents: '/nas',
          generateQrCode: '/nas/generate-qrcode/'
        },
        documents: [],
        qrCodeUrl: '',
        currentPath: ''
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
            console.log('Error fetching documents: ', error);
            console.log('Error response: ', error.response);

          });
      },
      updateQrCode(qrCodeUrl){
        this.qrCodeUrl = qrCodeUrl ? (this.apiBaseUrl + qrCodeUrl) : '';
      },
      downloadDocument(document){
        const url = this.apiBaseUrl + '/nas/download/' + encodeURIComponent(document.path);
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
      },
      updateCurrentPath(path){
        this.currentPath = path;
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
    <AppMain :data="documents" @update-qr-code="updateQrCode" @download="downloadDocument" @update-path="updateCurrentPath"/>
    <AppFooter :qrCodeUrl="qrCodeUrl" :currentPath="currentPath"/>
</template>