<template>
    <b-modal ref="modal" size="xl" class="test">
        <div class="table-responsive">
            <table class="table" style="table-layout: fixed">
                <thead>
                <tr>
                    <template v-for="l in labsSorted">
                        <th v-if="l.Tasks.length > 0"  :key="l.id">{{ l.title }}</th>
                    </template>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <template v-for="l in labsSorted">
                        <td class="p-0" v-if="l.Tasks.length > 0" :key="l.id">
                            <div class="border m-1 p-2" v-for="t in l.Tasks" :key="t.id" style="max-height: 60px; overflow: hidden">
                                {{ t.content }}
                            </div>
                        </td>
                    </template>
                </tr>
                </tbody>
            </table>
        </div>
    </b-modal>
</template>

<script lang="ts">
import Lab from "../models/Lab";
import {mapActions, mapState} from "vuex";
import draggable from "vuedraggable";
import Component from "vue-class-component";
import {Prop, Vue} from "vue-property-decorator";
import Discipline from "../models/Discipline";
import Task from "../models/Task";
import _ from 'lodash'

@Component({
    components: {
        draggable
    },
    computed: {
        ...mapState({
            activeDiscipline: "activeDiscipline",
            activeDisciplineArticles: "activeDisciplineArticles",
            jekyllProcess: "jekyllProcess",
        }),
    },
    methods: {
        ...mapActions({
            "setActiveLabId": "setActiveLabId",
        }),
    }
})
export default class LabTaskSorter extends Vue {
    @Prop() discipline!: Discipline;
    labs: Array<Lab> = [];

    async show() {
        (this.$refs.modal as any).show();
        await this.fetchLabs()
    }

    async fetchLabs() {
        this.labs = await this.discipline.getLabs({
            include: Task
        })
        console.log(this.labs)
    }

    get labsSorted() {
        return _(this.labs).sortBy(x => x.order).value()
    }
}
</script>

<style lang="scss" scoped>
//@media (min-width: 1200px) {
    .modal-xl::v-deep {
        max-width: 100%;
    }
//}
</style>