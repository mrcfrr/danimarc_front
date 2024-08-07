<script>
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import axios from 'axios';
import QRCode from 'qrcode';

export default {
    name: 'Main',
    props: {
        data: {
            type: Array,
            default: () => [],
            required: true,
        },
        initialPath: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            path: this.initialPath,
            history: [],
            currentFileUrl: '',
            currentFileName: '',
            currentFileType: '',
            showModal: false,
            isListView: false,
            qrCodeDataUrl: '', 
            qrCodeLink: '',
            isQrCodeModal: false,
            active: true,
        };
    },
    computed: {
        currentData() {
            return this.data.length ? this.data : [];
        },
        containsFiles() {
            return this.currentData.some(item => item.type === 'file');
        }
    },
    watch: {
        currentData(newVal) {
            const containsOnlyFiles = newVal.every(item => item.type === 'file');
            if (containsOnlyFiles) {
                this.generateQrCode(this.path);
            } else {
                this.qrCodeDataUrl = ''; // Resetta il QR code se non ci sono solo file
            }
        }
    },
    methods: {
        fetchData(path = this.path) {
            console.log('Fetching data for path:', path);
            axios.get('http://127.0.0.1:8000/nas/fetch-data', {
                params: { path }
            })
            .then(response => {
                console.log('Fetched data:', response.data);
                if (response.data) {
                    this.$emit('update-path', path);
                    this.$emit('update-documents', response.data);
                } else {
                    console.error('Invalid response data:', response.data);
                }
            })
            .catch(error => {
                console.error('Error during data fetch:', error);
            });
        },
        updatePathInUrl() {
            console.log('Updating path in URL:', this.path);
            const queryParams = new URLSearchParams(window.location.search);
            queryParams.set('path', encodeURIComponent(this.path));
            history.replaceState(null, '', `${window.location.pathname}?${queryParams}`);
        },
        openDir(directory) {
            console.log('Opening directory:', directory);
            if (directory.path) {
                this.history.push(this.path);
                this.path = decodeURIComponent(directory.path);
                console.log('Updated path:', this.path);
                this.updatePathInUrl();
                this.fetchData(this.path);
            }
        },
        generateQrCode(path) {
            console.log('Generating QR code for path:', path);
            const clientUrl = `${window.location.origin}/nas?path=${encodeURIComponent(path)}`;

            // Utilizza la libreria QRCode per generare un QR code come data URL
            QRCode.toDataURL(clientUrl, { width: 200, margin: 2 }, (err, url) => {
                if (err) {
                    console.error('Errore durante la generazione del QR code', err);
                } else {
                    console.log('QR Code Data URL:', url); // Log per verificare l'URL del QR code
                    this.qrCodeDataUrl = url; // Memorizza l'immagine del QR code come data URL
                    this.qrCodeLink = clientUrl; // Memorizza l'URL da visualizzare sotto il QR code
                    this.$emit('update-qr-code', url);
                }
            });
        },
        goBack() {
            this.path = this.history.pop() || '';
            this.fetchData();
        },
        openFileModal(item) {
            this.currentFileUrl = this.fileUrl(item);
            this.currentFileName = item.name;
            this.currentFileType = this.isImage(item) ? 'image' :
            this.isPdf(item) ? 'pdf' :
            this.isSpreadsheet(item) ? 'spreadsheet' : 'other';
            this.isQrCodeModal = false;
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
            this.isQrCodeModal = false;
        },
        downloadDocument(document) {
            this.$emit('download', document);
        },
        getFileExtension(filename) {
            return filename.split('.').pop().toLowerCase();
        },
        fileIcon(filename) {
            const extension = this.getFileExtension(filename);
            switch (extension) {
                case 'jpg':
                case 'jpeg':
                case 'png':
                    return 'fas fa-file-image';
                case 'pdf':
                    return 'fas fa-file-pdf';
                case 'ods':
                case 'xls':
                case 'xlsx':
                    return 'fas fa-file-excel';
                default:
                    return 'fas fa-file';
            }
        },
        isImage(item) {
            return ['png', 'jpg', 'jpeg'].some(ext => item.name.toLowerCase().endsWith(`.${ext}`));
        },
        isPdf(item) {
            return item.name.toLowerCase().endsWith('.pdf');
        },
        isSpreadsheet(item) {
            return ['ods', 'xls', 'xlsx'].some(ext => item.name.toLowerCase().endsWith(`.${ext}`));
        },
        fileUrl(item) {
            return `http://127.0.0.1:8000/nas/download/${encodeURIComponent(item.path)}`;
        },
        showQrCodeModal() {
            if (this.qrCodeDataUrl) {
                console.log('Showing QR code modal with Data URL:', this.qrCodeDataUrl);
                this.isQrCodeModal = true;
                this.showModal = true;
            } else {
                alert('QR code non disponibile per questa cartella.');
            }
        },
        downloadQrCode() {
            // Funzione per scaricare l'immagine del QR code
            const link = document.createElement('a');
            link.href = this.qrCodeDataUrl;
            link.download = 'qr_code.png';
            link.click();
        }
    },
    mounted() {
        console.log('Mounted: initialPath is', this.initialPath);
        if (this.initialPath && this.initialPath !== '') {
            this.path = decodeURIComponent(this.initialPath);
            this.fetchData(this.path);
            this.updatePathInUrl();
        } else {
            console.error('initialPath is empty or not provided, fetching main directory');
            this.fetchData('');
        }
    }
}
</script>

<template>
    <main class="position-relative">
        <div class="view-switcher m-3 form-check form-switch text-light">
            <label class="form-check-label"></label>
            <input @click="isListView = !isListView" class="form-check-input" type="checkbox" role="switch">Cambia vista

            <!-- Pulsante per visualizzare il QR code -->
            <div class="text-center mt-4">
                <button v-if="qrCodeDataUrl" class="btn btn-primary" @click="showQrCodeModal">Visualizza QR Code</button>
            </div>
        </div>
        <div v-if="isListView" class="list-container mx-3">
            <div class="list-item d-flex align-items-center mb-2 bg-warning" v-if="path !== ''" @click="goBack()">
                <i class="fas fa-folder me-2"></i>
                <span>indietro</span>
            </div>
            <div v-for="item in currentData" :key="item.path" class="list-item d-flex align-items-center mb-2 bg-light">
                <div v-if="item.type === 'directory'" @click="openDir(item)" class="flex-grow-1">
                    <i class="fas fa-folder me-2"></i>
                    <span :title="item.name">{{ item.name }}</span>
                </div>
                <div v-else @click="isImage(item) ? openFileModal(item) : downloadDocument(item)" class="flex-grow-1">
                    <i :class="fileIcon(item.name)" class="me-2"></i>
                    <span :title="item.name">{{ item.name }}</span>
                </div>
            </div>
        </div>
        <div v-else class="folder-container">
            <div class="grid-container" v-if="path !== ''">
                <div @click="goBack()" class="grid-item back-folder p-3">
                    <i class="fas fa-folder"></i>
                    <p>indietro</p>
                </div>
            </div>
            <div v-for="item in currentData" :key="item.path" :class="['grid-item', { 'has-padding': !isImage(item) }]">
                <div v-if="item.type === 'directory'" @click="openDir(item)">
                    <i class="fas fa-folder"></i>
                    <p :title="item.name">{{ item.name }}</p>
                </div>
                <div v-else>
                    <div v-if="isImage(item)" class="img-container" @click="openFileModal(item)">
                        <img :src="fileUrl(item)" alt="Image" class="img">
                    </div>
                    <div v-else-if="isPdf(item)" @click="openFileModal(item)">
                        <i class="fas fa-file-pdf"></i>
                        <p :title="item.name">{{ item.name }}</p>
                    </div>
                    <div v-else-if="isSpreadsheet(item)" @click="openFileModal(item)">
                        <i class="fas fa-file-excel"></i>
                        <p :title="item.name">{{ item.name }}</p>
                    </div>
                    <div v-else @click="downloadDocument(item)">
                        <i :class="fileIcon(item.name)"></i>
                        <p :title="item.name">{{ item.name }}</p>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Modale per i file e QR Code -->
        <div v-if="showModal" class="modal fade show" tabindex="-1" style="display: block;" aria-labelledby="fileModalLabel" aria-modal="true" role="dialog">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="fileModalLabel">{{ isQrCodeModal ? 'QR Code' : currentFileName }}</h5>
                        <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body text-center">
                        <div v-if="isQrCodeModal && qrCodeDataUrl" class="d-flex flex-column w-50 m-auto">
                            <img :src="qrCodeDataUrl" alt="QR Code" class="qr-code img-fluid">

                            <!-- Pulsante per scaricare il QR Code -->
                            <button @click="downloadQrCode" class="btn btn-success mt-3">Scarica QR Code</button>
                        </div>
                        <div v-else-if="currentFileType === 'image'">
                            <img :src="currentFileUrl" class="img-fluid" alt="Image preview">
                        </div>
                        <div v-else-if="currentFileType === 'pdf'">
                            <embed :src="currentFileUrl" width="100%" height="600px" type="application/pdf" />
                        </div>
                        <div v-else-if="currentFileType === 'spreadsheet'">
                            <iframe :src="currentFileUrl" width="100%" height="600px"></iframe>
                        </div>
                        <div v-else>
                            <p>Nessuna anteprima disponibile per questo file. Puoi scaricarlo <a :href="currentFileUrl" download>qui</a>.</p>
                        </div>
                    </div>
                    <div class="modal-footer d-flex justify-content-between">
                        <!-- Mostra l'URL -->
                        <input type="text" readonly :value=" qrCodeLink " class="mt-2 modal_input text-center">
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showModal" class="modal-backdrop fade show"></div>
    </main>
</template>

<style lang="scss" scoped>
@use '../assets/styles/partials/variables' as *;

main {
    .folder-container {
        display: flex;
        flex-wrap: wrap;
        margin-top: 30px;

        .grid-container {
            display: flex;
            flex-wrap: wrap;

            .back-folder {
                background-color: $tertiary-color;
            }
        }

        .grid-item {
            background-color: $secondary-color;
            height: 120px;
            width: 120px;
            text-align: center;
            font-size: 40px;
            color: #fff;
            border-radius: 20px;
            margin: 10px;
            overflow: hidden;
            position: relative;
            cursor: pointer;

            &.has-padding {
                padding: 20px;
            }

            .img-container {
                height: 100%;
                width: 100%;
                overflow: hidden;
            }

            .img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                display: block;
            }
        }

        p {
            margin-top: 10px;
            font-size: 12px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }

    .list-container {
        .list-item {
            padding: 10px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s;

            &:hover {
                opacity: 0.8;
            }

            i {
                margin-right: 10px;
            }
        }
    }

    .modal_img {
        width: 500;
    }

    .file_icons div {
        background-color: $headfoot-color;
        height: 50px;
        width: 50px;
        border-radius: 50%;
        color: $tertiary-color;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;

        &:hover {
            cursor: pointer;
        }
    }

    .modal_input {
        width: 100%;
        height: 30px;
        border-radius: 20px;
        padding: 0 10px;
        border: 1px solid $tertiary-color;
    } 
}
</style>
