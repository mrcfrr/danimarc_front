<script>

export default {
    name:'Header',
}
</script>

<!-- ****************************************************************** HTML-ZONE ***************************************************************** -->
<template>
    <header class="text-center py-4">
        
        <div class="logo_container mx-auto"><img src="../../img/logo-danimarc.png" alt="danimarc-logo" class="img-fluid"></div>
        
    </header>
</template>

<!-- *************************************************************** STYLE-ZONE ******************************************************************** -->
<style lang="scss" scoped>
@use '../assets/styles/partials/variables' as *;
.logo_container{
    width: 100%;
    width: 25rem;
}
</style>