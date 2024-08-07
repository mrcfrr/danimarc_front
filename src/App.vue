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
    data() {
        return {
            apiBaseUrl: 'http://127.0.0.1:8000',
            apiUrls: {
                documents: '/nas/fetch-data',
                generateQrCode: '/api/generate-qr-code'
            },
            documents: [],
            qrCodeUrl: '',
            currentPath: ''
        };
    },
    methods: {
        getDocuments(path = '') {
            axios.get(this.apiBaseUrl + this.apiUrls.documents, { params: { path } })
            .then(response => {
                this.documents = response.data;
                console.log('Documents fetched successfully:', this.documents);
            })
            .catch(error => {
                console.error('Error fetching documents:', error);
                if (error.response) {
                    console.error('Response data:', error.response.data);
                    console.error('Response status:', error.response.status);
                } else if (error.request) {
                    console.error('Request error:', error.request);
                } else {
                    console.error('General error:', error.message);
                }
            });
        },
        updateQrCode(qrCodeUrl) {
            this.qrCodeUrl = qrCodeUrl;
        },
        downloadDocument(document) {
            const url = this.apiBaseUrl + '/nas/download/' + encodeURIComponent(document.path);
            axios({
                url,
                method: 'GET',
                responseType: 'blob',
            }).then(response => {
                const blob = new Blob([response.data], { type: response.headers['content-type'] });
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = document.name;
                link.click();
            }).catch(error => {
                console.log(error);
            });
        },
        updateCurrentPath(path) {
            this.currentPath = path;
            this.getDocuments(this.currentPath);

            // Aggiorna l'URL nella barra degli indirizzi del browser
            const queryParams = new URLSearchParams(window.location.search);
            queryParams.set('path', encodeURIComponent(this.currentPath));
            history.replaceState(null, '', `${window.location.pathname}?${queryParams}`);
        }
    },
    created() {
        const urlParams = new URLSearchParams(window.location.search);
        const path = urlParams.get('path') ? decodeURIComponent(urlParams.get('path')) : '';
        console.log('App created: path from URL params is', path);
        if (path) {
            this.currentPath = path;
            this.getDocuments(this.currentPath);
        } else {
            console.log('No path provided, staying in main directory');
            this.currentPath = ''; // Assicurati di inizializzare correttamente currentPath
            this.getDocuments(this.currentPath);
        }
    }
};
</script>

<template>
    <AppHeader />
    <AppMain :data="documents" :initialPath="currentPath" @download="downloadDocument" @update-path="updateCurrentPath" />
    <AppFooter :currentPath="typeof currentPath === 'object' && currentPath !== null ? currentPath.name : currentPath"/>
</template>
