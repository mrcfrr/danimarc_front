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
                
            },

            goBack(){
                this.path = this.history.pop() || '';
            },

            downloadDocument(document){
                this.$emit('download', document);
            },

            fileIcon(filename){
                const extension = filename.split('.').pop().toLowerCase();
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

            isImage(item){
                const extension = item.name.split('.').pop().toLowerCase();
                return ['jpg', 'jpeg', 'png'].includes(extension);
            },

            isPdf(item){
                const extension = item.name.split('.').pop().toLowerCase();
                return extension === 'pdf';
            },

            fileUrl(item){
                const encodedPath = encodeURIComponent(item.path);
                return `http://127.0.0.1:8000/api/documents${encodedPath}`;
            },

            viewFile(item){
                window.open(this.fileUrl(item), '_blank');
            },
        }
    };
</script>

<!-- HTML-ZONE -->
<template>
    <main>
        <div>
            <div v-if="path !== ''">
                <button @click="goBack()">Indietro</button>
            </div>

            <div class="grid-container">

                <div v-for="item in currentData" :key="item.path" class="grid-item">
                    <div v-if="item.type === 'directory'" @click="openDir(item)">
                        <i class="fas fa-folder"></i>
                        <p>{{ item.name }}</p>
                    </div>
                    <div v-else>
                        <img v-if="isImage(item)" :src="fileUrl(item)" alt="Image" @click="viewFile(item)">
                        <div v-else-if="isPdf(item)" @click="viewFile(item)">
                            <i class="fas fa-file-pdf"></i>
                            <p>{{ item.name }}</p>
                        </div>
                        <div v-else @click="downloadDocument(item)">
                            <i :class="fileIcon(item.name)"></i>
                            <p>{{ item.name }}</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </main>
</template>

<!-- STYLE-ZONE -->
<style scoped>
    .grid-container{
        display: flex;
        flex-wrap: wrap;
        margin-top: 50px;
    }

    .grid-item{
        flex: 1 1 20%;
        text-align: center;
        font-size: 40px;
        color: yellowgreen;
    }

    .grid-image{
        width: 100%;
        object-fit: cover;
        cursor: pointer;
    }

    div i{
        color: yellow;
    }

    .grid-item p{
        margin-top: 10px;
        font-size: 15px;
    }
</style>