/**
 * http://usejsdoc.org/
 */
const UploadPodcast = document.querySelector('.UploadPodcast')
UploadPodcast.addEventListener('submit', (e) => {
  e.preventDefault()
  const episodeName = UploadPodcast.querySelector('.episodeName').value
  const episodeDescription = UploadPodcast.querySelector('.episodeDescription').value
  const podcastEpisode = UploadPodcast.querySelector('.podcastEpisode').value
  post('/uploadPodcast', { episodeName, episodeDescription, podcastEpisode }).then(function(res){
	  if(res.status == 200) window.location.href = "http://localhost:3000/dashboard"
	  else alert(res.status)
  })
})

function post (path, data) {
  return window.fetch(path, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}