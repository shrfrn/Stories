'use strict'

function init() {
    const elStories = document.querySelectorAll('.story')
    const elUsers = document.querySelectorAll('.user')

    elUsers.forEach(addPageIndicators)

    elStories.forEach(elStory => {
        addEventListener(elStory)
    })
}

function addEventListener(elStory) {
    const elPageIndicators = elStory.parentElement.querySelector('.page-indicators')
    const isFirstStory = elStory.nextElementSibling === elPageIndicators
    const elPrevStory = isFirstStory ? null : elStory.nextElementSibling
    const elNextStory = elStory.previousElementSibling
    
    elStory.addEventListener('click', ev => {
        const dir = ev.clientX > elStory.clientWidth / 2 ? 'next' : 'prev'
        
        if(dir === 'next') {
            if(elNextStory) {
                elStory.classList.add('hidden')
                
                const elCurrPageIndicator = elPageIndicators.querySelector('.selected')
                elCurrPageIndicator.classList.remove('selected')

                const elNextPageIndicator = elCurrPageIndicator.nextElementSibling
                elNextPageIndicator.classList.add('selected')
            } else {
                const elNextUser = elStory.parentElement.nextElementSibling
                if(!elNextUser) return
                elNextUser.scrollIntoView({ behavior: 'smooth' })
            }
        } else {
            if(elPrevStory) {
                elPrevStory.classList.remove('hidden')
                
                const elCurrPageIndicator = elPageIndicators.querySelector('.selected')
                elCurrPageIndicator.classList.remove('selected')

                const elPrevPageIndicator = elCurrPageIndicator.previousElementSibling
                elPrevPageIndicator.classList.add('selected')
            } else {
                const elPrevUser = elStory.parentElement.previousElementSibling
                if(!elPrevUser) return
                elPrevUser.scrollIntoView({ behavior: 'smooth' })
            }
        }
    })
}

function addPageIndicators(elUser) {
    const elPageIndicators = elUser.querySelector('.page-indicators')
    const elStories = elUser.querySelectorAll('.story')

    const stories = Array.from(elStories)
    const strHtmls = stories.map((story, idx) => {
        const className = idx === 0 ? 'selected' : ''
        return `<div class="page-indicator ${className}"></div>`
    })
    elPageIndicators.innerHTML = strHtmls.join('')
}