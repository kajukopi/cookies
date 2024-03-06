const myModalEl = document.getElementById("modalLoading")
this.Loading = new mdb.Modal(myModalEl, {backdrop: "static", keyboard: false, focus: true})
Loading.show()
this.instance = mdb.Toast.getInstance(document.getElementById("placement-example-toast"))
// Notif
;(this.Notif = (instance) => {
  return {
    update: () => {
      instance.update({
        stacking: true,
        hidden: true,
        width: "375px",
        position: "top-right",
        autohide: true,
        delay: 3000,
      })
    },
    show: ({...arg}) => {
      !arg.status
        ? instance.update({color: "danger", stacking: true, hidden: true, width: "375px", position: "top-right", autohide: true, delay: 3000})
        : instance.update({color: "success", stacking: true, hidden: true, width: "375px", position: "top-right", autohide: true, delay: 3000})
      document.getElementById("placement-example-toast").children[1].textContent = arg.message.text
      instance.show()
    },
    hide: () => {
      instance.hide()
    },
  }
})(instance).update()
