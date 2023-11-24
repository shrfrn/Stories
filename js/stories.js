'use strict'

function init() {
    const elStories = document.querySelectorAll('.story')

    elStories.forEach(elStory => {
        const elPrevUserStory = elStory.nextElementSibling
        const elNextUserStory = elStory.previousElementSibling

        elStory.addEventListener('click', ev => {
            const dir = ev.clientX > elStory.clientWidth / 2 ? 'next' : 'prev'
            
            if(dir === 'next') {
                if(elNextUserStory) {
                    elStory.classList.add('hidden')
                } else {
                    const elNextUser = elStory.parentElement.nextElementSibling
                    if(!elNextUser) return
                    elNextUser.scrollIntoView({ behavior: 'smooth' })
                }
            } else {
                if(elPrevUserStory) {
                    elPrevUserStory.classList.remove('hidden')
                } else {
                    const elPrevUser = elStory.parentElement.previousElementSibling
                    if(!elPrevUser) return
                    elPrevUser.scrollIntoView({ behavior: 'smooth' })
                }
            }
        })
    })
}