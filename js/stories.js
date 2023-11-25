'use strict'

function init() {
    const elStories = document.querySelectorAll('.story')
    const elUsers = document.querySelectorAll('.user')

    elUsers.forEach(addPageIndicators)

    elStories.forEach(elStory => addEventListener(elStory))
}

function addEventListener(elStory) {
    elStory.addEventListener('click', onStoryClick)
}

function onStoryClick(ev) {
    const elStory = this
    const elPageIndicators = elStory.parentElement.querySelector('.page-indicators')
    const isFirstStory = elStory.nextElementSibling === elPageIndicators
    
    const elPrevStory = isFirstStory ? null : elStory.nextElementSibling
    const elNextStory = elStory.previousElementSibling
    
    const dir = ev.clientX > elStory.clientWidth / 2 ? 'next' : 'prev'
    console.log(dir)
    if(dir === 'next') {
        if(elNextStory) {
            elStory.classList.add('hidden')
            updatePageIndicators(elStory, dir)
        } else {
            const elNextUser = elStory.parentElement.nextElementSibling
            if(!elNextUser) return
            elNextUser.scrollIntoView({ behavior: 'smooth' })
            // elNextUser.childred[0].classList.add('selected')
            resetPageIndicators(elNextUser, dir)
        }
    } else {
        updatePageIndicators(elStory, dir)
        if(elPrevStory) {
            elPrevStory.classList.remove('hidden')
        } else {
            const elPrevUser = elStory.parentElement.previousElementSibling
            if(!elPrevUser) return
            
            elPrevUser.scrollIntoView({ behavior: 'smooth' })
            resetPageIndicators(elPrevUser, dir)
        }
    }
}

function addPageIndicators(elUser) {
    const elPageIndicators = elUser.querySelector('.page-indicators')
    const elStories = elUser.querySelectorAll('.story')

    const stories = Array.from(elStories)
    const strHtmls = stories.map((story, idx, stories) => {
        const width = 100 / stories.length
        return `<div class="page-indicator" style="width: ${width}%;"></div>`
    })
    elPageIndicators.innerHTML = strHtmls.join('')
    resetPageIndicators(elUser, 'next')
}

function resetPageIndicators(elUser, dir) {
    if(dir === 'next') {
        const elIndicators = elUser.querySelectorAll('.page-indicators .page-indicator')
        
        elIndicators.forEach(elIndicator => elIndicator.classList.remove('selected'))
        setTimeout(() => elIndicators[0].classList.add('selected'), 2)
    } else {
        const elLastIndicator = elUser.querySelector('.page-indicators :nth-last-child(1 of .page-indicator)')
        console.log(elLastIndicator)
        elLastIndicator.classList.remove('selected')
        setTimeout(() => elLastIndicator.classList.add('selected'), 2)
    }
}

function updatePageIndicators(elStory, dir) {
    const elNextStory = elStory.previousElementSibling

    const elPageIndicators = elStory.parentElement.querySelector('.page-indicators')
    const elCurrPageIndicator = elPageIndicators.querySelector(':nth-last-child(1 of .selected)')
    const elNextPageIndicator = elCurrPageIndicator.nextElementSibling
    const elPrevPageIndicator = elCurrPageIndicator.previousElementSibling

    if(dir === 'next') {
        if(elNextStory) elNextPageIndicator.classList.add('selected')
        // Solve canceling in-progress transtion
    } else {
        elCurrPageIndicator.classList.remove('selected')
        if(elPrevPageIndicator) {
            elPrevPageIndicator.classList.remove('selected')
            setTimeout(() => elPrevPageIndicator.classList.add('selected'), 2)                
        } else {
            setTimeout(() => elCurrPageIndicator.classList.add('selected'), 2)                
        }
    }
}