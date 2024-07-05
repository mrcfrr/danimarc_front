<script>
import AppNav from './AppNav.vue';
export default {
    name:'Header',
    components: {
        AppNav,
    }
}
</script>

<!-- ****************************************************************** HTML-ZONE ***************************************************************** -->
<template>
    <header>

        <div>
            <h3>Danimarc</h3>
        </div>
        
        <div>
            <h1>tutorial <v-3></v-3></h1>
        </div>

        <AppNav />
        
    </header>
</template>

<!-- *************************************************************** STYLE-ZONE ******************************************************************** -->
<style lang="scss" scoped>
@use '../assets/styles/partials/variables' as *;
header{
    padding: 20px 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-transform: uppercase;
}
</style>