;(async ([Loading, Notif]) => {
  Loading.hide()

  // Sign In
  const buttonSignIn = document.querySelector("#buttonSignIn")
  if (buttonSignIn)
    buttonSignIn.addEventListener("click", async (e) => {
      Loading.show()
      console.log("Sending data...")

      const response = await fetch("/auth?col=users&signin=true", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Charset: "UTF-8",
        },
        body: JSON.stringify({
          username: "klinikburuh",
          password: "123123",
          email: "klinikburuh@gmail.com",
          name: "Karim Roy Tampubolon",
          phone: "089693313000",
        }),
      })
      const result = await response.json()
      Loading.hide()
      Notif(instance).show(result)
      console.log("Result : ", result)
    })

  // Sign Out
  const buttonSignOut = document.querySelector("#buttonSignOut")
  if (buttonSignOut)
    buttonSignOut.addEventListener("click", async (e) => {
      Loading.show()
      console.log("Sending data...")
      const response = await fetch("/auth?col=users&signout=true", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Charset: "UTF-8",
        },
      })
      const result = await response.json()
      Loading.hide()
      Notif(instance).show(result)
      console.log("Result : ", result)
    })

  // Profile
  const buttonProfile = document.querySelector("#buttonProfile")
  if (buttonProfile)
    buttonProfile.addEventListener("click", async (e) => {
      Loading.show()
      console.log("Sending data...")
      const response = await fetch("/auth?col=users&profile=true", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Charset: "UTF-8",
        },
        body: JSON.stringify({
          username: "klinikburuh",
          password: "123123",
          email: "klinikburuh@gmail.com",
          name: "Karim Roy Tampubolon",
          phone: "089693313000",
        }),
      })
      const result = await response.json()
      Loading.hide()
      Notif(instance).show(result)
      console.log("Result : ", result)
    })

  // Api Get
  const buttonApiGet = document.querySelector("#buttonApiGet")
  if (buttonApiGet)
    buttonApiGet.addEventListener("click", async (e) => {
      Loading.show()
      console.log("Sending data...")
      const response = await fetch("/api?col=contacts&page=2", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Charset: "UTF-8",
        },
      })
      console.log(response)
      console.log(response.headers.get("Link"))
      const result = await response.json()
      Loading.hide()
      Notif(instance).show(result)
      console.log("Result : ", result)
    })

  // Api Post
  const buttonApiPost = document.querySelector("#buttonApiPost")
  if (buttonApiPost)
    buttonApiPost.addEventListener("click", async (e) => {
      Loading.show()
      console.log("Sending data...")
      const response = await fetch("/api?col=contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Charset: "UTF-8",
        },
        body: JSON.stringify({
          name: "Karim Roy Tampubolon",
          address: "Sukabumi",
        }),
      })
      const result = await response.json()
      Loading.hide()
      Notif(instance).show(result)
      console.log("Result : ", result)
    })

  // Api Update
  const buttonApiUpdate = document.querySelector("#buttonApiUpdate")
  if (buttonApiUpdate)
    buttonApiUpdate.addEventListener("click", async (e) => {
      Loading.show()
      console.log("Sending data...")
      const inputApiUpdate = document.querySelector("#inputApiUpdate")
      const response = await fetch(`/api?col=contacts&id=${inputApiUpdate.value}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Charset: "UTF-8",
        },
        body: JSON.stringify({
          name: "Karim Roy Tampubolon",
          address: "Sukabumi",
        }),
      })
      const result = await response.json()
      Loading.hide()
      Notif(instance).show(result)
      console.log("Result : ", result)
    })

  // Api Delete
  const buttonApiDelete = document.querySelector("#buttonApiDelete")
  if (buttonApiDelete)
    buttonApiDelete.addEventListener("click", async (e) => {
      Loading.show()
      console.log("Sending data...")
      const inputApiDelete = document.querySelector("#inputApiDelete")
      const response = await fetch(`/api?col=contacts&id=${inputApiDelete.value}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Charset: "UTF-8",
        },
      })
      const result = await response.json()
      Loading.hide()
      Notif(instance).show(result)
      console.log("Result : ", result)
    })
})([this.Loading, this.Notif])
