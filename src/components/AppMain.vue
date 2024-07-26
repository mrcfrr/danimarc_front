<script>
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

export default {
    name:'Main',
    props: {
        data: Array,
        required: true,
    },
    data(){
        return{
            path: '',
            history: [],
            currentFileUrl: '',
            currentFileName: '',
            currentFileType: '',
            showModal: false,
        };
    },
    computed:{
        currentData(){
            let current = this.data;
            const segments = this.path.split('/').filter(segment => segment);

            for (let segment of segments) {
                if (Array.isArray(current)) {
                    let folder = current.find(item => item.name === segment && item.type === 'directory');
                    if (folder) {
                        current = folder.contents;
                    } else {
                        current = []; // In caso di errore, assegna un array vuoto
                    }
                } else {
                    current = []; // In caso di errore, assegna un array vuoto
                }
            }

            if (!Array.isArray(current)) {
                current = [];
            }

            return current.filter(item => item.name && item.name.trim() !== '');
        }
    },
    methods: {
        openDir(directory){
            this.history.push(this.path);

            if(this.path === ''){
                this.path = directory.name;
            } else {
                this.path += '/' + directory.name;
            }

            this.$emit('update-path', this.path);

            if (directory.qr_code) {
                this.$emit('update-qr-code', directory.qr_code);
            }
        },

        goBack(){
            this.path = this.history.pop() || '';
            this.$emit('update-path', this.path);

            const currentFolder = this.currentData.find(folder => folder.path === this.path);
            if (currentFolder && currentFolder.qr_code) {
                this.$emit('update-qr-code', currentFolder.qr_code);
            } else {
                this.$emit('update-qr-code', '');
            }
        },

        openFileModal(item) {
            this.currentFileUrl = this.fileUrl(item);
            this.currentFileName = item.name;
            if (this.isImage(item)) {
                this.currentFileType = 'image';
            } else if (this.isPdf(item)) {
                this.currentFileType = 'pdf';
            } else if (this.isSpreadsheet(item)) {
                this.currentFileType = 'spreadsheet';
            } else {
                this.currentFileType = 'other';
            }
            this.showModal = true; // Mostra la modale
        },
        closeModal() {
            this.showModal = false; // Chiudi la modale
        },

        downloadDocument(document){
            this.$emit('download', document);
        },

        getFileExtension(filename) {
            const parts = filename.split('.');
            const extension = parts.length > 1 ? parts.pop().toLowerCase() : '';
            return extension;
        },

        fileIcon(filename){
            if (!filename) return false;
            const extension = this.getFileExtension(filename);
            switch(extension){
                case 'jpg':
                case 'jpeg':
                case 'png':
                    return 'fas fa-file-image';
                case 'pdf':
                    return 'fas fa-file-pdf';
                case 'ods':
                    return 'fas fa-file-excel';
                case 'xls':
                case 'xlsx':
                    return 'fas fa-file-excel';
                default:
                    return 'fas fa-file';
            }
        },

        isImage(item) {
            if (!item.name) return false;
            return ['png', 'jpg', 'jpeg'].some(ext => item.name.toLowerCase().endsWith(`.${ext}`));
        },

        isPdf(item) {
            if (!item.name) return false;
            return item.name.toLowerCase().endsWith('.pdf');
        },
        isSpreadsheet(item) {
            if (!item.name) return false;
            return ['ods', 'xls', 'xlsx'].some(ext => item.name.toLowerCase().endsWith(`.${ext}`));
        },

        fileUrl(item){
            // Sostituisce i backslash con forward slash
            const normalizedPath = item.path.replace(/\\/g, '/');
            // Codifica il percorso normalizzato
            const encodedPath = encodeURIComponent(normalizedPath);
            const url = `http://127.0.0.1:8000/nas/download/${encodedPath}`;
            console.log('Generated file URL:', url);  // Aggiungi un log per il debug
            return url;
        },
        fileShare(){
            if (navigator.share) {
                navigator.share({
                    title: this.currentFileName,
                    text: 'Condividi questo file',
                    url: this.currentFileUrl,
                }).then(() => {
                    console.log('Condivisione riuscita');
                }).catch(error => {
                    console.error('Errore durante la condivisione', error);
                });
            } else {
                alert('Condivisione non supportata');
            }
        },
        fileDownload(){
            fetch(this.currentFileUrl)
                .then(response => response.blob())
                .then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = this.currentFileName;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                })
                .catch(error => console.error('Errore durante il download del file', error));
        },
        filePrint(){

            /* const printWindow = window.open('', '_blank');
            printWindow.document.write('<html><head><title>Print</title></head><body>');
            if (this.currentFileType === 'image') {
                printWindow.document.write(`<img src="${this.currentFileUrl}" style="width:100%">`);
            } else if (this.currentFileType === 'pdf') {
                printWindow.document.write(`<embed src="${this.currentFileUrl}" type="application/pdf" width="100%" height="100%">`);
            } else if (this.currentFileType === 'spreadsheet') {
                printWindow.document.write(`<iframe src="https://view.officeapps.live.com/op/embed.aspx?src=${this.currentFileUrl}" width="100%" height="100%"></iframe>`);
            } else {
                printWindow.document.write('<p>Impossibile mostrare l\'anteprima.</p>');
            }
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.onload = () => {
                printWindow.print();
                printWindow.close();
            }; */

            const printIframe = document.createElement('iframe');
            printIframe.style.position = 'absolute';
            printIframe.style.width = '0';
            printIframe.style.height = '0';
            printIframe.style.border = 'none';
            document.body.appendChild(printIframe);

            const printDocument = printIframe.contentWindow.document;
            printDocument.open();
            printDocument.write('<html><head><title>' + this.currentFileName + '</title>');
            printDocument.write('</head><body>');

            if (this.currentFileType === 'image') {
                printDocument.write(`<img src="${this.currentFileUrl}" style="width:100%">`);
            } else if (this.currentFileType === 'pdf') {
                printDocument.write(`<embed src="${this.currentFileUrl}" type="application/pdf" width="100%" height="100%">`);
            } else if (this.currentFileType === 'spreadsheet') {
                printDocument.write(`<iframe src="https://view.officeapps.live.com/op/embed.aspx?src=${this.currentFileUrl}" width="100%" height="600px"></iframe>`);
            } else {
                printDocument.write('<p>Impossibile mostrare l\'anteprima.</p>');
            }

            printDocument.write('</body></html>');
            printDocument.close();

            printIframe.contentWindow.focus();
            printIframe.contentWindow.print();

            // Rimuovere l'iframe dopo la stampa
            setTimeout(() => {
                document.body.removeChild(printIframe);
            }, 1000);
            
        }
    }
};
</script>

<template>
    <main>
        <div class="folder-container">
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
    </main>
<!------------------------------------------------------------ MODALE ----------------------------------------------------------------------->

        <div v-if="showModal" class="modal fade show" tabindex="-1" style="display: block;" aria-labelledby="fileModalLabel" aria-modal="true" role="dialog">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="file_icons d-flex gap-3">
                            <div @click="fileShare"><i class="fa-solid fa-share-nodes" title="Condividi"></i></div>
                            <div @click="fileDownload"><i class="fa-solid fa-cloud-arrow-down" title="Scarica"></i></div>
                            <div @click="filePrint"><i class="fa-solid fa-print" title="Stampa"></i></div>
                        </div>
                        <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body text-center">
                        <div v-if="currentFileType === 'image'">
                            <img :src="currentFileUrl" alt="Image Preview" class="modal_img">
                        </div>
                        <div v-else-if="currentFileType === 'pdf'">
                            <embed :src="currentFileUrl" type="application/pdf" width="100%" height="600px"/>
                        </div>
                        <div v-else-if="currentFileType === 'spreadsheet'">
                            <iframe :src="`https://view.officeapps.live.com/op/embed.aspx?src=${currentFileUrl}`" width="100%" height="600px"></iframe>
                        </div>
                        <div v-else>
                            <p>Impossibile mostrare l'anteprima.</p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <h5 class="modal-title m-auto" id="fileModalLabel">{{ currentFileName }}</h5>
                        <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="showModal" class="modal-backdrop fade show"></div>
    
</template>

<!-- *************************************************************** STYLE-ZONE ******************************************************************** -->

<style lang="scss" scoped>
@use '../assets/styles/partials/variables' as *;

main{
    height: calc(100vh - 270px);

    .folder-container{
        display: flex;
        flex-wrap: wrap;
        margin-top: 30px;

        .grid-container{
        display: flex;
        flex-wrap: wrap;

            .back-folder{
                background-color: $tertiary-color;
            }
        }

        .grid-item{
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
    
}
.modal_img{
        width: 500px;
}
.file_icons div{
    background-color: $headfoot-color;
    height: 50px;
    width: 50px;
    border-radius: 50%;
    color: $tertiary-color;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;

    &:hover{
        cursor: pointer;
    }
}
</style>
