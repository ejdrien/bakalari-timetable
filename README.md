## Bakaláři Timetable

JS script that scrapes html timetable and returns json-formatted timetable.

### How to use it?

First of all, you need to update the website in `index.js` to point to your desired Bakaláři instance.
Then get all `id` value values so you can use it and just send an HTTP `GET` request with all required parameters as query parameters:
```
example.com/path/to/api?time=TIME_VALUE&type=TYPE_VALUE&id=ID_VALUE
```

### Parameters

#### `time`
either `permanent`, `actual` (as in current week), `next` (as in next week)

It's a good practice to scrape and save permanent timetables beforehand because they don't really change


#### `type`
either `class`, `teacher`, or `room`

#### `id`
is a uniquely generated identifier for given timetable

These need to be manually retrieved from given institution.

### Output

The return type is `JSON` with this structure:
```
Timetable: Array
  └ Day: Array
      └ TimeSlot: Array
          └ Lesson: Object
              - subject (String, Required): The subject being taught.
              - teacher (String, Optional): The teacher responsible for the lesson.
              - group (String, Optional): The group assigned to the lesson.
              - classroom (String, Optional): The classroom where the lesson takes place.
```

### Example

Try visiting this [link](https://node-api-vercel.vercel.app/api/timetable?time=permanent&type=room&id=ZW):
```
https://node-api-vercel.vercel.app/api/timetable?time=permanent&type=room&id=ZW
```
to preview the `JSON` output.

These data can also be viewed in an [app](https://gukoly.adrianzamecnik.cz/rozvrh) I made a few years ago.

##

Written in 2020.
