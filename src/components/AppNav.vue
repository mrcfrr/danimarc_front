<script>
    export default {
        name:'Nav',
        data(){
            return{
                menuItem: [
                    {
                        name: 'dati macchina',
                        link: '#',
                        target: '_self',
                        isActive: false,
                    },
                    {
                        name: 'commesse',
                        link: '#',
                        target: '_self',
                        isActive: false,
                    },
                    {
                        name: 'difetti',
                        link: '#',
                        target: '_self',
                        isActive: false,
                    },
                    {
                        name: 'tutorials',
                        link: '#',
                        target: '_self',
                        isActive: false,
                    },
                    {
                        name: 'qc',
                        link: '#',
                        target: '_self',
                        isActive: true,
                    },
                ]
            }
        }
    }
</script>

<!-- ****************************************************************** HTML-ZONE ***************************************************************** -->
<template>
    <nav>
        <ul>
            <li v-for="item in menuItem">
                <a :href="item.link" :target="item.target">{{ item.name }}</a>
            </li>
        </ul>
    </nav>
</template>

<!-- *************************************************************** STYLE-ZONE ******************************************************************** -->
<style lang="scss" scoped>
    @use '../assets/styles/partials/variables' as *;
    nav{

        ul{
            display: flex;
            justify-content: end;
            list-style: none;
            gap: 70px;

            li{

                a{
                    display: inline-block;
                    text-decoration: none;
                    color: #fff;

                    &:hover{
                        border-bottom: 2px solid $border-color;
                    }
                }
            }
        }
    }
</style>