const apiUrl = 'https://api.unsplash.com/'
const apiKey = ''
const uri = 'photos/random'
const count = 5
const params = {
  client: `?client_id=${apiKey}`,
  count: `&count=${count}`
}

const imageContainer = document.querySelector('.image-container')
const loader = document.querySelector('.loader')

let ready = false
let imagesLoaded = 0
let totalImages = 0
let photos = []
let initialLoad = true

function showLoader(shouldShow) {
  if (shouldShow) {
    loader.classList.remove('hidden')
  } else {
    loader.classList.add('hidden')
  }
}

function imageLoaded() {
  imagesLoaded++
  if (imagesLoaded === totalImages) {
    ready = true
    showLoader(false)
  }
}

function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key])
  }
}

function displayPhotos() {
  imagesLoaded = 0
  totalImages = photos.length

  console.log(photos)

  photos.forEach(photo => {
    const item = document.createElement('a')
    setAttributes(item, {
      href: photo.links.html,
      target: '_blank',
    })

    const img = document.createElement('img')
    setAttributes(img, {
      src: photo.urls.regular,
      alt: photo.description || photo.alt_description || photo.id,
      title: photo.description || photo.alt_description || photo.id,
    })
    img.addEventListener('load', imageLoaded)


    item.appendChild(img)
    imageContainer.appendChild(item)
  })

}

async function getPhotos() {
  try {
    showLoader(true)
    const response = await fetch(`${apiUrl}${uri}${params.client}${params.count}`)

    if (response.ok) {
      photos = await response.json()
    } else {
      throw new Error('Something went wrong ...')
    }
  } catch (error) {
    console.error(error)
  } finally {
    displayPhotos()
    initialLoad = false
  }
}

function loadMore() {
  const { innerHeight, scrollY } = window
  const { scrollHeight } = document.body

  if (scrollY + innerHeight >= scrollHeight - 1000 && ready) {
    ready = false
    getPhotos()
  }
}


function init() {
  window.addEventListener('load', getPhotos)
  window.addEventListener('scroll', loadMore)
}

init()