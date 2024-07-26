<script>

export default {
    name:'Header',
}
</script>

<!-- ****************************************************************** HTML-ZONE ***************************************************************** -->
<template>
    <header class="text-center pt-4 text-uppercase">
        
        <div class="logo_container m-auto"><img src="../../img/logo-danimarc.png" alt="danimarc-logo" class="img-fluid"></div>
        
    </header>
</template>

<!-- *************************************************************** STYLE-ZONE ******************************************************************** -->
<style lang="scss" scoped>
@use '../assets/styles/partials/variables' as *;
.logo_container{
    width: 25rem;
}
</style>