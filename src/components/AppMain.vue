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
                const decodedPath = decodeURIComponent(item.path);
                return `http://127.0.0.1:8000/api/documents${decodedPath}`;
            },

            viewFile(item){
                window.open(this.fileUrl(item), '_blank');
            },
        }
    };
</script>

<!-- ****************************************************************** HTML-ZONE ***************************************************************** -->
<template>
    <main>
        <div class="folder-container">
            <div class="grid-container" v-if="path !== ''">
            
                <div @click="goBack()" class="grid-item back-folder">
                    <i class="fas fa-folder"></i>
                    <p>indietro</p>
                </div>
            
            </div>
            <div v-for="item in currentData" :key="item.path" class="grid-item">
                <div v-if="item.type === 'directory'" @click="openDir(item)">
                    <i class="fas fa-folder"></i>
                    <p :title="item.name">{{ item.name }}</p>
                </div>
                <div v-else>
                    <img v-if="isImage(item)" :src="fileUrl(item)" alt="Image" @click="viewFile(item)">
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

<!-- *************************************************************** STYLE-ZONE ******************************************************************** -->
<style lang="scss" scoped>
@use '../assets/styles/partials/variables' as *;
main{
    height: calc(100vh - 270px);

    .folder-container{
        display: flex;
        flex-wrap: wrap;
        margin-top: 30px;
    }

    .grid-container{
        display: flex;
        flex-wrap: wrap;

        .back-folder{
            background-color: $secondary-color;
        }

        .grid-item{
            background-color: $tertiary-color;
            height: 120px;
            width: 120px;
            text-align: center;
            font-size: 40px;
            color: #fff;
            padding: 20px;
            border-radius: 20px;
            margin: 10px;

            p {
                margin-top: 10px;
                font-size: 12px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            }
        }

    div i{
        color: yellow;
    }
}

    
</style>