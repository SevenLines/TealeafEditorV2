<template>
    <div class="d-flex" style="height: 100%">
        <div class="d-flex flex-column w-100">
            <div class="p-2" style="background-color: #f1f1f1; border-top: 2px solid #e7e7e7">
                <div class="container pr-4 d-flex justify-content-end">
                    <b-select size="sm" :options="taskGroupsOptions" v-model="activeTaskGroup"></b-select>
                    <b-button-group class="flex-shrink-0">

                        <b-button class="ml-2 flex-shrink-0" size="sm" variant="warning" @click="onCreateTaskGroup"
                                  v-b-modal.newTaskGroupModal>Создать группу
                        </b-button>
                        <b-button class="ml-2 flex-shrink-0" size="sm" variant="warning"
                                  v-b-modal.orderGroupsModal>Упорядочить группы
                        </b-button>
                        <b-button v-if="activeTaskGroup != -1" class="ml-2 flex-shrink-0" size="sm" variant="danger"
                                  @click="onRemoveTaskGroup">Удалить группу
                        </b-button>
                    </b-button-group>
                    <b-button class="ml-2" size="sm" variant="info" @click="onCopyTasksClick">Скопировать</b-button>
                    <b-button class="ml-2" size="sm" variant="info" @click="onAddTaskClick">Добавить</b-button>
                </div>
            </div>
            <div class="flex-grow-1 overflow-hidden" style="padding-right: 15px">
                <div class="row" style="height: 100%">
                    <div class="col overflow-auto" style="height: calc(100% )">
                        <div class="container">
                            <draggable v-model="tasks" group="people" @start="drag=true" @end="drag=false">
                                <task-item class="m-2"
                                           :task="t"
                                           v-for="t in tasks"
                                           :key="t.id"
                                           :active-task="activeTask"
                                           @edit="onEdit(t)"
                                           @eye="onEyeClick(t)"
                                           @remove="onRemove(t)"
                                           @tip="onTipClick(t)"
                                ></task-item>
                            </draggable>
                        </div>
                    </div>
<!--                    <task-editor-->
<!--                        class="task-editor"-->
<!--                        :class="{'active': !!activeTask}"-->
<!--                        :task="activeTask"-->
<!--                        @cancel="activeTask=null"-->
<!--                        @save="onSaveTaskClick"-->
<!--                        @edit-subtask-clicked="onAddSubtaskClicked"-->
<!--                    >-->
<!--                    </task-editor>-->
                </div>
            </div>


        </div>
<!--        <copy-tasks-modal ref="copyTasksModal" @ok="onCopyTasksConfirm"/>-->
<!--        <b-modal id="newTaskGroupModal" title="Создать новую группу" @ok="onCreateTaskGroupOkClicked">-->
<!--            <b-form-group>-->
<!--                <b-input v-model="newTaskGroupTitle"></b-input>-->
<!--            </b-form-group>-->
<!--        </b-modal>-->
<!--        <b-modal id="orderGroupsModal" title="Упорядочить группы">-->
<!--            <b-list-group>-->
<!--                <draggable v-model="taskGroups" group="people" @start="drag=true" @end="drag=false">-->
<!--                    <b-list-group-item v-for="g in taskGroups" :key="g.id">-->
<!--                        {{ g.title }}-->
<!--                    </b-list-group-item>-->
<!--                </draggable>-->
<!--            </b-list-group>-->
<!--        </b-modal>-->
<!--        <SubtaskModal  ref="editSubTasksModal" :activeTask="activeTask" @ok-clicked="onSubtasksModalOkClicked"/>-->
    </div>
</template>

<script lang="ts" setup>

// private activeDiscipline: Discipline
// public activeTask?: Task = null;
// public activeLab!: Lab;
// public labs!: Array<Lab>;
// public activeTaskGroup = -1;
// public newTaskGroupTitle = "";
//
// @Watch("$route", {deep: true, immediate: true})
// onRouteChange() {
//     this.$store.dispatch("setActiveLabId", this.$route.params.labId)
// }
//
// get tasks() {
//     return this.$store.state.tasks.filter(x => {
//         return (this.activeTaskGroup == -1 && x.group_id == null) || x.group_id == this.activeTaskGroup
//     });
// }
//
// set tasks(tasks) {
//     this.$store.commit("setTasks", tasks)
//     this.$store.dispatch("updateTasksOrder", tasks)
// }
//
// get taskGroups() {
//     return this.$store.state.taskGroups;
// }
//
// set taskGroups(taskGroups) {
//     this.$store.commit("setTaskGroups", taskGroups)
//     this.$store.dispatch("updateTaskGroupsOrder", taskGroups)
// }
//
// get taskGroupsOptions() {
//     return [{value: -1, text: "без группы"}, ...this.taskGroups.map(x => {
//         return {
//             value: x.id,
//             text: x.title,
//         }
//     })]
// }
//
// onEdit(task) {
//     if (this.activeTask == task) {
//         this.activeTask = null
//     } else {
//         this.activeTask = task;
//     }
// }
//
// async onEyeClick(task) {
//     task.visible = !task.visible
//     await task.save()
// }
//
// async onRemove(task) {
//     let doDelete = await this.$bvModal.msgBoxConfirm(
//         'Точно удалить задачу?', {
//             title: 'Подтвердите',
//             size: 'sm',
//             buttonSize: 'sm',
//             okVariant: 'danger',
//             okTitle: 'Удалить',
//             cancelTitle: 'НЕЕЕЕТ!!!',
//             footerClass: 'p-2',
//             hideHeaderClose: false,
//             centered: true
//         })
//     if (doDelete) {
//         await task.destroy();
//         await this.$store.dispatch("fetchTasks")
//     }
// }
//
// async onSubtasksModalOkClicked(subtasks: Array<Subtask>) {
//     this.activeTask.subtasks = subtasks;
//     await this.SaveActiveTasks();
// }
//
// async onSaveTaskClick(task_form, buttonClicked) {
//     this.activeTask.title = task_form.title;
//     this.activeTask.order = task_form.order;
//     this.activeTask.custom_class = task_form.custom_class;
//     this.activeTask.content = task_form.content;
//     this.activeTask.complexity = task_form.complexity;
//     this.activeTask.additional_content = task_form.additional_content;
//     this.activeTask.visible = task_form.visible;
//     this.activeTask.youtube_link = task_form.youtube_link;
//     this.activeTask.show_help_in_modal = task_form.show_help_in_modal;
//     this.activeTask.lab_id = task_form.lab_id;
//
//     await this.SaveActiveTasks(buttonClicked);
// }
//
// async SaveActiveTasks(buttonClicked = false) {
//     await this.activeTask.save()
//     this.$notify({
//         group: 'messages',
//         title: 'Database',
//         type: 'success',
//         duration: 500,
//         text: 'Successfully task saved!'
//     });
//
//     let isNew = !this.activeTask.id;
//
//     if (isNew || buttonClicked) {
//         await this.$store.dispatch("fetchTasks")
//     }
//
//     if (buttonClicked) {
//         this.activeTask = null;
//     }
// }
//
// async onAddTaskClick() {
//     let task = Task.build({
//         title: "",
//         order: (_(this.tasks).map(x => x.order).max() + 1) || 0,
//         custom_class: "",
//         youtube_link: "",
//         content: "",
//         complexity: ComplexityTypes.easy,
//         additional_content: "",
//         visible: true,
//         group_id: this.activeTaskGroup == -1 ? null : this.activeTaskGroup,
//         lab_id: this.activeLab.id,
//     })
//     this.activeTask = task;
// }
//
// async onAddSubtaskClicked() {
//     (this.$refs.editSubTasksModal as any).show()
// }
//
// async onCopyTasksClick() {
//     (this.$refs.copyTasksModal as any).show()
// }
//
// async onCopyTasksConfirm(tasks) {
//     let tas = await this.activeLab.getTasks({
//         attributes: [[sequelize.fn('max', sequelize.col('order')), 'max_order']],
//         raw: true,
//     });
//
//     let maxOrder = 0;
//     if (tas.length > 0) {
//         maxOrder = (tas[0] as any).max_order
//     }
//
//     let i = 1;
//     let regexp = /\!\[\]\((\/assets\/.*?)\)/gm;
//     let lab = await tasks[0].getLab();
//     let discipline = await lab.getDiscipline();
//
//     for (const t of tasks) {
//         let data = t.get({plain: true})
//         let items = [
//             ...data.content.matchAll(regexp),
//             ...data.additional_content.matchAll(regexp),
//         ];
//         items = items.map(i => {
//             let new_match = path.join("copied", discipline.id.toString(), lab.id.toString(), path.basename(i[1]))
//             let pth = path.join("assets", new_match).replace(/\\/g, "/");
//             let to = path.join(this.activeDiscipline.jekyll_folder, "assets", new_match);
//
//             let dir = path.dirname(to);
//
//             if (!fs.existsSync(dir)) {
//                 fs.mkdirSync(dir, { recursive: true });
//             }
//
//             return {
//                 "match": i[0],
//                 "from": path.join(discipline.jekyll_folder, i[1]),
//                 "new_match": `![](/${pth})`,
//                 "to": to,
//             }
//         })
//
//         for(const item of items) {
//             fsExtra.copySync(item.from, item.to)
//             data.content = data.content.replace(item['match'], item['new_match'])
//             data.additional_content = data.additional_content.replace(item['match'], item['new_match'])
//         }
//
//         delete data.id
//         data.lab_id = this.activeLab.id
//         data.order = maxOrder + i
//         data.LabId = this.activeLab.id
//         data.group_id = this.activeTaskGroup == -1 ? null : this.activeTaskGroup
//         data.TaskGroupId = this.activeTaskGroup == -1 ? null : this.activeTaskGroup
//         await Task.create(data)
//         await this.$store.dispatch("fetchTasks")
//         i++;
//     }
// }
//
// async onCreateTaskGroup() {
//     this.newTaskGroupTitle = ""
// }
//
// async onRemoveTaskGroup() {
//     let has_subtasks = await Task.count({
//         where: {group_id: this.activeTaskGroup}
//     })
//
//     if (has_subtasks) {
//         await this.$bvModal.msgBoxOk(
//             'У группы есть задачи, не могу ее удалить', {
//                 title: 'Бесполезно',
//                 size: 'md',
//                 okVariant: 'info',
//                 footerClass: 'p-2',
//                 hideHeaderClose: false,
//                 centered: true
//             })
//         return;
//     }
//
//     let doDelete = await this.$bvModal.msgBoxConfirm(
//         `Точно удалить группу?`, {
//             title: 'Подтвердите',
//             size: 'sm',
//             buttonSize: 'sm',
//             okVariant: 'danger',
//             okTitle: 'Удалить',
//             cancelTitle: 'НЕЕЕЕТ!!!',
//             footerClass: 'p-2',
//             hideHeaderClose: false,
//             centered: true
//         })
//     if (doDelete) {
//         await TaskGroup.destroy({
//             where: {
//                 id: this.activeTaskGroup
//             }
//         });
//         await this.$store.dispatch("fetchTaskGroups")
//         this.activeTaskGroup = -1
//     }
// }
//
// async onCreateTaskGroupOkClicked() {
//     let order = _(this.taskGroups).map((x: TaskGroup) => x.order || 0).max()
//     let task_group = TaskGroup.build({
//         lab_id: this.activeLab.id,
//         title: this.newTaskGroupTitle,
//         type: this.activeLab.type,
//         order: order + 1,
//     })
//     await task_group.save()
//     await this.$store.dispatch("fetchTaskGroups")
//     this.activeTaskGroup = task_group.id
// }
//
// async onTipClick(t) {
//     let href = `http://localhost:4000/tasks/${t.id}`
//     await shell.openExternal(href);
// }
</script>

<style lang="scss">
.task-editor {


    &.active {
        height: 100%;
        padding: 1em;
        overflow-y: auto;
        flex-basis: 0;
        flex-grow: 1;
        visibility: visible;
    }

    flex-basis: 0;
    flex-grow: 0;
    max-width: 100%;
    overflow: hidden;

    box-shadow: 0 0 4px silver;

    background-color: white;
    transition: all 0.5s;
    animation-timing-function: ease-in-out;
    visibility: hidden;

}
</style>


