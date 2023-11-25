'use strict'

var gInterval = 0
var gElCurrUser = null

function init() {
    const elStories = document.querySelectorAll('.story')
    const elUsers = document.querySelectorAll('.user')

    gElCurrUser = elUsers[0]

    elUsers.forEach(addPageIndicators)
    elStories.forEach(elStory => elStory.addEventListener('click', onStoryClick))

    // gInterval = setInterval(showNextStory, 3000)
}

function showNextStory() {
    const elCurrStory = gElCurrUser.querySelector('.hidden')?.previousElementSibling || gElCurrUser.querySelector(':nth-last-child(1 of .story:not(.hidden))')
    const isLastUserStory = gElCurrUser.firstElementChild === elCurrStory

    if(!isLastUserStory){
        elCurrStory.classList.add('hidden')
        console.log(elCurrStory)
    } else {
        gElCurrUser = gElCurrUser.nextElementSibling
        if(!gElCurrUser) return
        gElCurrUser.scrollIntoView({ behavior: 'smooth' })
    }
    updatePageIndicators(gElCurrUser, 'next')
}

function onStoryClick(ev) {
    const elStory = this
    
    const elPageIndicators = elStory.parentElement.querySelector('.page-indicators')
    const isFirstStory = elStory.nextElementSibling === elPageIndicators
    
    const elPrevStory = isFirstStory ? null : elStory.nextElementSibling
    const elNextStory = elStory.previousElementSibling
    
    const dir = ev.offsetX > elStory.clientWidth / 2 ? 'next' : 'prev'
    
    if(dir === 'next') {
        if(elNextStory) {
            elStory.classList.add('hidden')
            updatePageIndicators(elStory, dir)
        } else {
            const elNextUser = elStory.parentElement.nextElementSibling
            if(!elNextUser) return
            elNextUser.scrollIntoView({ behavior: 'smooth' })
            gElCurrUser = elNextUser
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
            gElCurrUser = elPrevUser

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