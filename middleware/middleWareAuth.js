const short = require("short-uuid")
const bcrypt = require("bcrypt")
const saltRounds = 11
exports.middleWareAuth = async (req, res, next) => {
  try {
    let match = undefined,
      hash = undefined,
      verify = undefined
    const collection = req.query["col"] ? req.query["col"] : undefined
    if (collection !== "users") throw {text: "sign-in first!!", path: "auth/collection"}
    const status = req.query["signin"] ? "signin" : req.query["signup"] ? "signup" : req.query["profile"] ? "profile" : req.query["signout"] ? "signout" : undefined
    const doc = req.app.get("doc")
    const sheet = doc.sheetsByTitle[collection]
    const rows = await sheet.getRows()
    const {username, password, email} = req.body ? req.body : {username: "", password: "", email: ""}
    // Find if exist
    const find = username ? rows.find((item) => item.get("username") === username || item.get("email") === email) : undefined
    switch (req.method) {
      case "GET":
        if (!find) throw {text: "username or email not found!", path: "auth/get"}
        res.json({status: true, context: [find.toObject()], message: {text: "username or email found!", path: "auth/get"}}).end()
        break
      case "POST":
        switch (status) {
          case "signin":
            if (!find) throw {text: "auth/post/signin", path: "username or email not found!"}
            if (req.cookies["session.auth"]) throw {path: "auth/post/signin", text: "already sign-in!!"}
            match = await bcrypt.compare(password, find.toObject().password)
            if (!match) throw "auth/post/signin: invalid!"
            if (req.cookies["session.auth"] === find.toObject().id) throw {text: "already login!", path: "auth/post/signin"}
            res.cookie("session.auth", await bcrypt.hash(req.cookies["session.sid"], saltRounds), {
              maxAge: /* 24 * 60 *  */60 * 1000,
              path: "/",
              // httpOnly: false,
              secure: true,
            })
            res.json({status: true, context: [deleteCrutial(find.toObject())], message: {text: "successfully sign-in!", path: "auth/post/signin"}}).end()
            break

          case "signup":
            if (find) throw {text: "username or email already registered!", path: "auth/post/signup"}
            hash = await bcrypt.hash(password, saltRounds)
            const uuid = short.generate()
            const signup = {id: uuid, date: new Date().getTime(), update: new Date().getTime(), ...req.body, password: hash}
            const add = await sheet.addRow(signup, {raw: true})
            res.json({status: true, context: [deleteCrutial(add.toObject())], message: {text: "sign-up successfully", path: "auth/post/signup"}}).end()
            break

          case "signout":
            if (!req.cookies["session.auth"]) throw {text: "already sign-out!!", path: "auth/post/signout"}
            verify = await verifyRequest(req, "auth/post/signout")
            if (verify !== true) throw verify
            match = await bcrypt.compare(req.cookies["session.sid"], req.cookies["session.auth"])
            res.clearCookie("session.auth")
            res.json({status: true, context: [], message: {text: "sign-out successfully", path: "auth/post/signout"}}).end()
            break

          case "profile":
            if (!find) throw {text: "username or email not found!", path: "auth/post/profile"}
            verify = await verifyRequest(req, "auth/post/profile")
            if (verify !== true) throw verify
            match = await bcrypt.compare(password, find.toObject().password)
            if (!match) throw {text: "invalid!", path: "auth/post/profile"}
            hash = await bcrypt.hash(password, saltRounds)
            const profile = Object.assign({}, {...deleteCrutial(req), update: new Date().getTime(), password: hash})
            find.assign(profile)
            await find.save({raw: true})
            res.json({status: true, context: [find.toObject()], message: {text: "profile successfully updated!", path: "auth/post/profile"}}).end()
            break

          default:
            throw {text: "username or email not found!", path: "auth/post/default"}
        }
        break
      case "DELETE":
        if (!id || !find) throw {text: "username or email not found!", path: "auth/delete"}
        const body = find.toObject()
        await find.delete()
        res.json({status: true, context: [body], message: {text: `${id} deleted successfully!`, path: "auth/delete"}}).end()
        break
      default:
        throw {text: "not exist!", path: "auth/default"}
    }
  } catch (error) {
    console.log(error)
    return res.json({status: false, context: [], message: error}).end()
  }
}

function deleteCrutial(req) {
  if (req.body) {
    delete req?.body?.username
    delete req?.body?.email
    return req.body
  } else {
    delete req?.username
    delete req?.email
    delete req?.password
    return req
  }
}

async function verifyRequest(req, path) {
  if (!req.cookies["session.auth"] || !req.cookies["session.sid"]) return {text: "sign-in first!!", path}
  const match = await bcrypt.compare(req.cookies["session.sid"], req.cookies["session.auth"])
  if (!match) return {text: "sign-in first!!", path}
  return true
}
