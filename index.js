// loads permanent timetables that have been scraped in advance
// const permanent_timetables = require("./timetables")

const axios = require("axios")
const cheerio = require("cheerio")
const moment = require("moment")

module.exports = async (req, res) => {
  let { time, type, id } = req.query
  if (!time || !type || !id) return res.json({
    type: "error",
    message: "Missing required parameters."
  })

  let data
  try {
    let response = await axios
      .get(`https://bakalari.gymstr.cz/timetable/public/${time}/${type}/${id}`)

    if (response.headers["content-length"] < 10000) return res.json({
      type: "error",
      message: "Invalid required paramaters."
    })

    data = response["data"]
  }
  catch (error) {
    return res.json({
      type: "error",
      message: "Failed to download the timetable."
    })
  }

  let timetable = []
  const $ = cheerio.load(data)

  $(".bk-timetable-row").each((i, el) => {
    let row = []

    row.push([
      {
        subject: days[i],
        teacher: $(el).find(".bk-day-date").text().trim().replace(/\./, ". ")
      }
    ])

    $(el).find(".bk-timetable-cell").each((i, el) => {
      let cell = []
      
      $(el).find(".day-flex").each((i, el) => {
        let piece = $(el)
        
        let group = piece.find(".left").text().trim()
        let classroom = piece.find(".right").text().trim()
        let subject = piece.find(".middle").text().trim()
        let teacher = piece.find(".bottom").text().trim()

        cell.push({
          group,
          classroom,
          subject,
          teacher,
        })
        
      })

      row.push(cell)
    })
    
    timetable.push(row)
  })

  // Uncommenting the following code transforms the timetable so that
  // it only shows updated timetable for the next day.
  // If you wish to enable this feature, please create file `timetables.json`
  // which contains permanent timetables for all types of timetable.
  // -------
  // At this point, timetable is properly formatted and reflects the reality
  // but I'm supposed to limit it only to the next day (per request from school administration), so here's the filtration process

  // -- it only applies for time = actual || next, not permanent - in that case we skip this process
  // if (time.toLowerCase() == "permanent") return res.json(timetable)
  //else we need to work it


  // let allowed_days = []

  // for (let day of timetable) {
  //   let date = day[0][0]["teacher"].split(" ")
    
  //   let school_day = moment(`${date[0].slice(0, -1).padStart(2, 0)}-${date[1].slice(0, -1).padStart(2, 0)}`, "DD-MM")
  //   let tomorrow = moment().add(1, "day")
    
  //   if (tomorrow >= school_day) allowed_days.push(1)
  //   else if ([6, 0].includes(tomorrow.day()) && school_day.day() == 1) allowed_days.push(1)
  //   else allowed_days.push(0)
  // }

  // // console.log(allowed_days)

  // for (let [i, val] of allowed_days.entries()) {
  //   if (val == 1) continue
    
  //   timetable[i] = permanent_timetables[id][i]
  // }

  return res.json(timetable)
}

const days = {
  0: "Po",
  1: "Út",
  2: "St",
  3: "Čt",
  4: "Pá",
}
