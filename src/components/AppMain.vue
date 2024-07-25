<script>
export default {
    name:'Main',
    props: {
        data: Array
    },
    data(){
        return{
            path: '',
            history: []
        };
    },
    computed:{
        currentData(){
            let current = this.data;
            const segments = this.path.split('/').filter(segment => segment);

            for(let segment of segments){
                let folder = current.find(item => item.name === segment && item.type === 'directory');
                if(folder){
                    current = folder.contents;
                }
            }

            return current;
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
                this.$emit('update-qr-code', directory.qr_code); // Emetti l'evento per aggiornare il QR code
            }
        },

        goBack(){
            this.path = this.history.pop() || '';
            this.$emit('update-path', this.path);  // Emetti l'evento per aggiornare il percorso

            const currentFolder = this.currentData.find(folder => folder.path === this.path);
            if (currentFolder && currentFolder.qr_code) {
                this.$emit('update-qr-code', currentFolder.qr_code); // Emetti l'evento per aggiornare il QR code
            } else {
                this.$emit('update-qr-code', '');
            }
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

        fileUrl(item){
            // Sostituisce i backslash con forward slash
            const normalizedPath = item.path.replace(/\\/g, '/');
            // Codifica il percorso normalizzato
            const encodedPath = encodeURIComponent(normalizedPath);
            const url = `http://127.0.0.1:8000/nas/download/${encodedPath}`;
            console.log('Generated file URL:', url);  // Aggiungi un log per il debug
            return url;
        },

        viewFile(item){
            window.open(this.fileUrl(item), '_blank');
        },
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
                    <div v-if="isImage(item)" class="img-container">
                        <img :src="fileUrl(item)" alt="Image" @click="viewFile(item)" class="img">
                    </div>
                    <div v-else-if="isPdf(item)" @click="viewFile(item)">
                        <i class="fas fa-file-pdf"></i>
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
</template>

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
</style>
