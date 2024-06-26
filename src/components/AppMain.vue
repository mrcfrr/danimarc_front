<template>
    <main>
        <div>
        <ul>
            <template v-for="item in data">
                <li v-if="item.type === 'directory'" :key="item.path">
                    <span @click="toggleFolder(item.path)" >
                        {{ item.name }}
                        <span v-if="isOpen(item.path)" >[-]</span>
                        <span v-else>[+]</span>
                    </span>
                    <ul v-if="isOpen(item.path)">
                        <app-main :data="item.contents" />
                    </ul>
                </li>
                <li v-if="item.type === 'file'" :key="item.path">
                    <div v-if="isImage(item.path)">
                        <img :src="getDocumentUrl(item.path)" :alt="item.name" width="200">
                    </div>
                    <div v-else-if="isPdf(item.path)">
                        <a :href="getDocumentUrl(item.path)" target="_blank">Apri PDF: {{ item.name }}</a>
                    </div>
                    <div v-else>
                        {{ item.name }}
                    </div>
                </li>
            </template>
        </ul>
    </div>
    </main>
</template>

<script>
    export default {
        name:'AppMain',
        props: {
            data: Array
        },
        data(){
            return {
                openFolders: []
            };
        },
        methods: {
            isImage(file) {
                const extension = file.split('.').pop().toLowerCase();
                return ['jpg', 'jpeg', 'png'].includes(extension);
            },

            isPdf(file) {
                const extension = file.split('.').pop().toLowerCase();
                return extension === 'pdf';
            },

            getDocumentUrl(document) {
                return `http://127.0.0.1:8000/api/documents/${encodeURIComponent(document)}`;
            },

            toggleFolder(path){
                if(this.isOpen(path)){
                    this.openFolders = this.openFolders.filter(folder => folder !== path);
                } else {
                    this.openFolders.push(path);
                }
            },

            isOpen(path){
                return this.openFolders.includes(path);
            }
        }
    }
</script>

<style>

</style>