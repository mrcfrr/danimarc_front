<script>
    export default {
        name:'Footer',
        props: {
            qrCodeUrl: {
                type: String,
                required: false
            }
        }
    }
</script>

<!-- ****************************************************************** HTML-ZONE ***************************************************************** -->
<template>
    <footer class="footer">
        
        <div class="icons">
            <div></div>
            <div></div>
            <div></div>
        </div>
        <div class="footer-end">
            <div><h2>16:11:06</h2></div>
            <div>
                <h2>sts</h2>
                <h2>lab</h2>
            </div>
            <div v-if="qrCodeUrl" class="qr">
                <img :src="qrCodeUrl" alt="QR Code"/>
            </div>
        </div>
        
    </footer>
</template>

<!-- *************************************************************** STYLE-ZONE ******************************************************************** -->
<style lang=scss scoped>
.footer{
    display: flex;
    justify-content: space-between;
    padding: 0 100px;
    align-items: center;

    .icons{
        display: flex;
        gap: 10px;

        div{
            height: 50px;
            width: 50px;
            border-radius: 50%;
            background-color: blue;
        }
    }

    .footer-end{
        display: flex;
        gap: 50px;
        text-transform: uppercase;

        .qr{
            height: 50px;
            width: 50px;
        }
    }
}
        
</style>