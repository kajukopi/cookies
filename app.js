require("dotenv").config()
const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const {doc, drive} = require("./google/google")
const {sessions} = require("./middleware/middleWareSession")
const app = express()

app.use(cors("*"))

app.use(express.json())

app.use(express.urlencoded({extended: true}))

app.use(cookieParser())

const options = {
  dotfiles: "ignore",
  etag: false,
  extensions: ["htm", "html", "css", "js", "ico", "jpg", "jpeg", "png", "svg"],
  index: ["index.html"],
  maxAge: "1m",
  redirect: false,
}

app.use(express.static("public", options))

doc.loadInfo().then(() => {
  app.set("doc", doc)

  app.set("drive", drive)

  app.use(sessions)

  app.use("/api", require("./router/api"))

  app.use("/auth", require("./router/auth"))

  app.listen(3000, () => {
    console.log("Server online!")
  })
})
