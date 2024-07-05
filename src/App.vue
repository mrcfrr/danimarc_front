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
        apiBaseUrl: 'http://127.0.0.1:8000/api',
        apiUrls: {
          documents: '/documents',
          generateQrCode: '/generate-qrcode/'
        },
        documents: [],
        qrCodeUrl: ''
      }
    },
    methods: {
      getDocuments(){
        axios.get(this.apiBaseUrl + this.apiUrls.documents)
          .then(response => {
            this.documents = response.data;
            console.log(this.documents);
            if(this.documents.length > 0){
              this.getQrCode(this.documents[0].path);
            }
          })
          .catch(error => {
            console.log('Error fetching documents: ', error);
            console.log('Error response: ', error.response);

          });
      },
      getQrCode(path){
        axios.get(this.apiBaseUrl + this.apiUrls.generateQrCode + encodeURIComponent(path))
          .then(response => {
            console.log('Qr code URL:', response.data);
            this.qrCodeUrl = this.apiBaseUrl.replace('/api', '') + response.data;
            console.log(this.qrCodeUrl);
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
    <AppFooter :qrCodeUrl="qrCodeUrl"/>
</template>