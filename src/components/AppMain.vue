<template>
    <main>
        <div>
        <h1>Documenti</h1>
        <ul>
            <li v-for="document in data" :key="document">
                <div v-if="isImage(document)">
                    <img :src="getDocumentUrl(document)" :alt="document" width="200" />
                </div>
                <div v-else-if="isPdf(document)">
                    <a :href="getDocumentUrl(document)" target="_blank">View PDF: {{ document }}</a>
                </div>
                <div v-else>
                    {{ document }}
                </div>
            </li>
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
        }
    }
}
</script>

<style>

</style>