<script>
export default {
    name:'Footer',
    props: {
        currentPath: {
            type: String,
            default: ''
        }
    },
    computed: {
        displayPath(){
            return this.currentPath || 'Main directory';
        }
    },
    methods:{
        
    }
}
</script>

<!-- ********************************************************** HTML-ZONE ************************************************************* -->
<template>
    <footer class="footer d-flex flex-column flex-lg-row justify-content-between align-items-center py-3 px-4 position-absolute bottom-0 start-0 end-0">
        
        <div class="input-container mb-3 mb-md-0">
            <input type="text" :value="displayPath" readonly class="input fst-italic text-primary text-center font-monospace">
        </div>

        
        <div class="logo_box mt-md-3">
            <img src="../../img/sts_logo.png" alt="logo" class="img-fluid">
        </div>
        
    </footer>

</template>

<!-- *************************************************************** STYLE-ZONE ***************************************************** -->
<style lang="scss" scoped>
@use '../assets/styles/partials/variables' as *;

.footer{
    .input-container {
        width: 100%;
        max-width: 600px;
    }

    .input{
        width: 100%;
        height: 40px;
        border-radius: 20px;
        padding: 0 20px;
        border: 1px solid $tertiary-color;
    }

    .logo_box{
        width: 100px;
    }
}

</style>
