(function () {
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const POSTER_URL = BASE_URL + '/posters/'
  const data = []

  axios.get(INDEX_URL).then((response) => {
    data.push(...response.data.results)
    console.log(data)
  }).catch((err) => console.log(err))
})()
