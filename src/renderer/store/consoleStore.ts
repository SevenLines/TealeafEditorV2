import {defineStore} from "pinia";
import {onBeforeMount, ref} from "vue";

const useConsoleStore = defineStore("consoleStore", () => {
    const jekyllProcessLog = ref<string[]>([])
    const consoleActive = ref(false);

    window.electronAPI.onPushJekyllLogItem((event: any, message: string) => {
        console.log(message);
        jekyllProcessLog.value.push(message)
    })


    function clearLog() {
        jekyllProcessLog.value = []
    }

    return {
        consoleActive,
        jekyllProcessLog,

        clearLog,
    }
})

export default useConsoleStore;