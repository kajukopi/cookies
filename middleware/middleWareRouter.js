const short = require("short-uuid")
const bcrypt = require("bcrypt")
exports.middleWareRouter = async (req, res, next) => {
  try {
    let match = undefined
    const collection = req.query["col"] ? req.query["col"] : undefined
    if (!collection) throw {text: "collection does not exist!", path: "api/col"}
    if (collection === "users") throw {text: "sign-in first!!", path: "api/col"}
    const id = req.query["id"] ? req.query["id"] : undefined
    const doc = req.app.get("doc")
    const sheet = doc.sheetsByTitle[collection]
    const rows = await sheet.getRows()
    if (!req.cookies["session.auth"] || !req.cookies["session.sid"]) throw {text: "sign-in first!!", path: "api/session/cookies"}
    match = await bcrypt.compare(req.cookies["session.sid"], req.cookies["session.auth"])
    if (!match) throw {text: "sign-in first!!", path: "api/sesion/match"}
    // Find if exist
    const find = id ? rows.find((item) => item.get("id") === id) : undefined
    switch (req.method) {
      case "GET":
        if (id) {
          if (!find) throw {text: "id not found!", path: "api/get/id"}
          res.json({status: true, context: [find.toObject()], message: {text: "data found!", path: "api/get"}}).end()
        } else {
          res
            .json({
              status: true,
              ...pagination(
                req,
                rows.map((element) => element.toObject())
              ),
              message: {text: "get all!", path: "api/get"},
            })
            .end()
        }
        break
      case "POST":
        if (id) {
          if (find) {
            const body = Object.assign(find.toObject(), {...req.body, update: new Date().getTime()})
            find.assign(body)
            await find.save({raw: true})
            res.json({status: true, context: [find.toObject()], message: {text: "successfully updated!", path: "api/post/update"}}).end()
          } else {
            res.json({status: false, context: [], message: "id not found!"}).end()
          }
        } else {
          const uuid = short.generate()
          const body = {id: uuid, date: new Date().getTime(), update: new Date().getTime(), ...req.body}
          const add = await sheet.addRow(body, {raw: true})
          res.json({status: true, context: [add.toObject()], message: {text: "created successfully", path: "api/post/create"}}).end()
        }
        break
      // case "PUT":
      //   if (!id) throw {text:"",path:""}  {status: false, context: [], message: "id not found!"}
      //   res.json({status: true, context: [], message: "Successfully updated!"})
      //   break
      case "DELETE":
        if (!id || !find) throw {text: "id not found!", path: "api/delete/id"}
        const body = find.toObject()
        await find.delete()
        res.json({status: true, context: [body], message: {text: `${id} deleted successfully!`, path: "api/delete/id"}}).end()
        break
      default:
        throw {text: "not exist!", path: "api/default"}
    }
  } catch (error) {
    console.log(error)
    return res.json({status: false, context: [], message: error}).end()
  }
}

function pagination(req, content) {
  try {
    const pages = parseInt(req.query.page) || 1
    const totalPages = Math.ceil(content.length / 5)
    if (pages < 1 || pages > totalPages) throw {text: "page not found", path: "api/pagination"}
    const startIndex = (pages - 1) * 5
    const endIndex = startIndex + 5
    const next_pages = pages + 1 > totalPages ? totalPages : pages + 1
    const prev_pages = pages - 1 < 0 ? 1 : pages - 1
    return {
      pages,
      first_pages: 1,
      next_pages,
      prev_pages,
      last_pages: totalPages,
      total_pages: totalPages,
      total_items: content.length,
      context: content.slice(startIndex, endIndex),
    }
  } catch (error) {
    return {message: {text: "page not found", path: "api/pagination"}, context: []}
  }
}

// {text:"",path:""}
