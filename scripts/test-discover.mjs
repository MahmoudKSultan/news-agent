import pkg from "duckduckgo-search"
const { search } = pkg

const results = await search("react javascript RSS feed")
console.log("Count:", results.length)
console.log(JSON.stringify(results.slice(0, 3), null, 2))
