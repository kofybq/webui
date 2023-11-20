
<template>
    <div class="worddetail">
        
    </div>
</template>

<script>
    export default {
        name: "asmAdd",
        data(){
            return{

            }
        },
        mounted(){
            this.getAsmExteriorList()
        },
        methods:{
            getAsmExteriorList(){
                // this.$axios.get(this.$appConfig.serviceBaseUrl + '/api/getAsmExteriorList').then(res => {
                //     this.asmExteriorList = res
                // }).catch(err => {
                //     console.log(err)
                // })
            },
            //会将:value的值传递到val
            getSelected(val){
                for(let i=0;i<this.asmExteriorList.length;i++){
                    console.log(this.asmExteriorList[i].propValue)
                    if(this.asmExteriorList[i].propValue==val){
                        this.addForm.asmExteriorNo=this.asmExteriorList[i].propValue
                        console.log('???')
                    }
                }
                console.log('ok'+this.addForm.asmExteriorNo)
            }
        }
    }
</script>