<script>
    export default {
        name:'Footer',
        props: {
            qrCodeUrl: {
                type: String,
                required: false
            },
            currentPath: {
                type: String,
                required: true
            }
        },
        computed: {
            displayPath(){
                return this.currentPath || 'Main directory';
            }
        },
        methods:{
            qrShare(){
                if(navigator.share){
                    navigator.share({
                        title: 'QR Code',
                        text: 'Condividi il QR Code',
                        url: this.qrCodeUrl
                    }).then(() => {
                        console.log('Condivisione riuscita');
                    }).catch(error => {
                        console.log('Errore condivisione: ', error);
                    });
                } else {
                    alert('Condivisione non supportata');
                }
            },
            qrDownload(){
                const link = document.createElement('a');
                link.href = this.qrCodeUrl;
                link.download = 'qr_code.png';
                link.click();
                document.body.removeChild(link);
            },
            qrPrint(){
                const printWindow = window.open(this.qrCodeUrl);
                printWindow.onload = () => {
                    printWindow.print();
                };
            }
        
        }
    }
</script>

<!-- ****************************************************************** HTML-ZONE ***************************************************************** -->
<template>
    <footer class="footer">
        
        <div><input type="text" :value="displayPath" readonly class="input"></div>
        <div v-if="qrCodeUrl">
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">Visualizza QR code</button>
        </div>
        <div class="logo_box">
            <img src="../../img/sts_logo.png" alt="logo" class="img-fluid">
        </div>
        
    </footer>

<!-------------------------------------------------------------------- MODALE ---------------------------------------------------------------->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="qr_icons d-flex gap-3">
                        <div @click="qrShare"><i class="fa-solid fa-share-nodes" title="Condividi"></i></div>
                        <div @click="qrDownload"><i class="fa-solid fa-cloud-arrow-down" title="Scarica"></i></div>
                        <div @click="qrPrint"><i class="fa-solid fa-print" title="Stampa"></i></div>
                    </div>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-center">
                    <img :src="qrCodeUrl" alt="QR Code" :title="qrCodeUrl"/>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<!-- *************************************************************** STYLE-ZONE ******************************************************************** -->
<style lang=scss scoped>
@use '../assets/styles/partials/variables' as *;

.footer{
    display: flex;
    justify-content: space-between;
    padding: 20px 100px;
    align-items: center;

    .input{
        text-align: center;
        width: 500px;
        height: 40px;
        border-radius: 20px;
        padding: 0 20px;
        border: 1px solid $tertiary-color;
    }


    .logo_box{
        width: 100px;
    }
}

.qr_icons div{
    background-color: $headfoot-color;
    height: 50px;
    width: 50px;
    border-radius: 50%;
    color: $tertiary-color;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;

    &:hover{
        cursor: pointer;
    }
}
        
</style>