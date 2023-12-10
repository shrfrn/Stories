'use strict'

var gInterval = 0
var gElCurrUser = null

function init() {
    const elUsers = document.querySelectorAll('.user')

    gElCurrUser = elUsers[0]

    elUsers.forEach((elUser, userIdx) => {
        addPageIndicators(elUser)
        
        const elStories = elUser.querySelectorAll('.story')
        elUser.dataset.userIdx = userIdx
        elUser.dataset.currStoryIdx = 0
        elUser.dataset.storyCount = elStories.length

        elStories.forEach((elStory, storyIdx, elStories) => {
            elStory.dataset.storyIdx = elStories.length - storyIdx - 1
            elStory.addEventListener('click', onStoryClick)
        })
    })
    const elFirstPageIndicator = elUsers[0].querySelector('.page-indicator')
    elFirstPageIndicator.classList.add('.selected')

    const options = {
        root: document.querySelector('.stories'),
        threshold: 1,
    }
    const storyObserver = new IntersectionObserver(resetStory, options)
    elUsers.forEach(user => storyObserver.observe(user))

    elUsers.forEach(addPageIndicators)
    elStories.forEach(elStory => elStory.addEventListener('click', onStoryClick))

    gInterval = setInterval(showNextStory, 3000)
}

function resetStory(entries, observer) {
    const entry = entries.find(entry => entry.isIntersecting && entry.isVisible)
    if(!entry) return

    const elUser = entry.target
    const elUserStories = elUser.querySelectorAll('.story')
    const elCurrStory = elUserStories[+elUser.dataset.currStoryIdx]
    
    // const dir = gElCurrUser.dataset.userIdx < elUser.dataset.userIdx ? 'next' : 'prev'
    gElCurrUser = elUser
    updatePageIndicators(elCurrStory)
}

function showNextStory() {
    const currStoryIdx = +gElCurrUser.dataset.currStoryIdx
    const storyCount = +gElCurrUser.dataset.storyCount
    const isLastUserStory = currStoryIdx === storyCount - 1

    const elCurrStory = gElCurrUser.querySelector(`[data-story-idx="${currStoryIdx}"]`)

    if(!isLastUserStory){
        elCurrStory.classList.add('hidden')
        gElCurrUser.dataset.currStoryIdx = currStoryIdx + 1
    } else {
        gElCurrUser = gElCurrUser.nextElementSibling
        if(!gElCurrUser) return clearInterval(gInterval)

        gElCurrUser.scrollIntoView({ behavior: 'smooth' })
        // resetPageIndicators(gElCurrUser, 'next')
    }
    updatePageIndicators(elCurrStory, 'next')
}

function onStoryClick({ offsetX }) {
    clearInterval(gInterval)

    const elStory = this
    const elCurrUser = elStory.parentElement
    const currStoryIdx = +elStory.dataset.storyIdx
    
    const elPrevStory = elCurrUser.querySelector(`[data-story-idx="${currStoryIdx - 1}"]`)
    const elNextStory = elCurrUser.querySelector(`[data-story-idx="${currStoryIdx + 1}"]`)
    
    const dir = offsetX < elStory.clientWidth / 2 ? 'prev' : 'next'
    
    if(dir === 'next') {
        if(elNextStory) {
            elStory.classList.add('hidden')
            elCurrUser.dataset.currStoryIdx = currStoryIdx + 1
            updatePageIndicators(elStory, dir)
        } else {
            const elNextUser = elCurrUser.nextElementSibling
            if(!elNextUser) return
            
            elNextUser.scrollIntoView({ behavior: 'smooth' })
            gElCurrUser = elNextUser
            // resetPageIndicators(elNextUser, dir)
        }
    } else {
        if(elPrevStory) {
            elPrevStory.classList.remove('hidden')
            elCurrUser.dataset.currStoryIdx = currStoryIdx - 1
        } else {
            const elPrevUser = elCurrUser.previousElementSibling
            if(!elPrevUser) return
            
            elPrevUser.scrollIntoView({ behavior: 'smooth' })
            gElCurrUser = elPrevUser
            
            // resetPageIndicators(elPrevUser, dir)
        }
    }
    updatePageIndicators(elStory, dir)
    gInterval = setInterval(showNextStory, 3000)
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
        setTimeout(() => elIndicators[0].classList.add('selected'), 12)
    } else {
        const elLastIndicator = elUser.querySelector('.page-indicators :nth-last-child(1 of .page-indicator)')
        console.log(elLastIndicator)
        elLastIndicator.classList.remove('selected')
        setTimeout(() => elLastIndicator.classList.add('selected'), 12)
    }
}

function updatePageIndicators(elStory, dir) {
    const elUser = elStory.parentElement
    const elNextStory = elStory.previousElementSibling

    const elPageIndicators = elStory.parentElement.querySelector('.page-indicators')
    
    // TODO: change next line to - const elCurrPageIndicator = elPageIndicators[+elUser.dataset.currStoryIdx]
    const elCurrPageIndicator = elPageIndicators.querySelector(':nth-last-child(1 of .selected)')
    const elNextPageIndicator = elCurrPageIndicator.nextElementSibling
    const elPrevPageIndicator = elCurrPageIndicator.previousElementSibling

    if(!dir) {
        elCurrPageIndicator.classList.remove('selected')
        setTimeout(() => elCurrPageIndicator.classList.add('selected'), 12)                
    } else if(dir === 'next') {
        if(elNextStory) {
            elNextPageIndicator.classList.add('selected')
            console.log('Hi')
        }
        // TODO: Solve canceling in-progress transtion
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