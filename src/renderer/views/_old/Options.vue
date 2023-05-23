<template>
    <b-modal ref="modal">
        <b-form-input
            id="inline-form-input-name"
            class="mb-2 mr-sm-2 mb-sm-0"
        ></b-form-input>
        <b-form-group>
            <b-button @click="onBackupCreateClick">Создать бэкап</b-button>
        </b-form-group>
    </b-modal>
</template>

<script>
import Component from "vue-class-component";
import {Vue} from "vue-property-decorator";
import {mapState} from "vuex";

@Component({
    computed: {
        ...mapState({})
    }
})
export default class Options extends Vue {
    onBackupCreateClick() {
        this.$refs.modal.hide();
        this.$store.dispatch("backupDatabase");
    }

    show() {
        this.$refs.modal.show();
    }
}
</script>

<style scoped>

</style>