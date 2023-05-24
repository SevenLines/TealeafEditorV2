import {defineStore} from "pinia";
import Toastify from 'toastify-js'


const useToastsStore = defineStore("toastsStore", () => {
    function showSuccess(message: string) {
        Toastify({
          text: message,
          duration: 1000,
          newWindow: true,
          close: true,
          gravity: "top", // `top` or `bottom`
          position: "right", // `left`, `center` or `right`
          stopOnFocus: true, // Prevents dismissing of toast on hover
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          },
          onClick: function(){} // Callback after click
        }).showToast();
    }

     function showInfo(message: string) {
        Toastify({
          text: message,
          duration: 1000,
          newWindow: true,
          close: true,
          gravity: "top", // `top` or `bottom`
          position: "right", // `left`, `center` or `right`
          stopOnFocus: true, // Prevents dismissing of toast on hover
          style: {
            background: "linear-gradient(90deg, rgba(0,184,134,1) 0%, rgba(0,212,255,1) 100%);",
          },
          onClick: function(){} // Callback after click
        }).showToast();
    }

    return {
        showInfo,
        showSuccess
    }
})

export default useToastsStore;