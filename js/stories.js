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
    elFirstPageIndicator.classList.add('selected')

    const options = {
        root: document.querySelector('.stories'),
        threshold: 1,
    }
    const storyObserver = new IntersectionObserver(resetStory, options)
    elUsers.forEach(user => storyObserver.observe(user))

    gInterval = setInterval(showNextStory, 3000)
}

function resetStory(entries, observer) {
    const entry = entries.find(entry => entry.isIntersecting)
    if(!entry) return

    const elUser = entry.target
    const elUserStories = elUser.querySelectorAll('.story')
    const elCurrStory = elUserStories[+elUser.dataset.currStoryIdx]
    
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
    }
    updatePageIndicators(elCurrStory)
}

function onStoryClick({ offsetX }) {
    clearInterval(gInterval)

    const elCurrStory = this
    const elCurrUser = elCurrStory.parentElement
    const currStoryIdx = +elCurrStory.dataset.storyIdx
    
    const elPrevStory = elCurrUser.querySelector(`[data-story-idx="${currStoryIdx - 1}"]`)
    const elNextStory = elCurrUser.querySelector(`[data-story-idx="${currStoryIdx + 1}"]`)
    
    const dir = offsetX < elCurrStory.clientWidth / 2 ? -1 : 1

    if(dir === 1 && elNextStory || dir === -1 && elPrevStory) {
        const elStory = dir === 1 ? elCurrStory : elPrevStory
        elStory.classList.toggle('hidden')

        updatePageIndicators(elCurrStory, dir)
        elCurrUser.dataset.currStoryIdx = currStoryIdx + dir
    } else {
        const elUser = dir === 1 ? elCurrUser.nextElementSibling : elCurrUser.previousElementSibling
        if(!elUser) return

        gElCurrUser = elUser
        elUser.scrollIntoView({ behavior: 'smooth' })
    }
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
}

function updatePageIndicators(elStory, dir) {
    const elUser = elStory.parentElement
    const elNextStory = elStory.previousElementSibling

    const elPageIndicators = elStory.parentElement.querySelectorAll('.page-indicator')

    const elCurrPageIndicator = elPageIndicators[+elUser.dataset.currStoryIdx]
    const elNextPageIndicator = elCurrPageIndicator.nextElementSibling
    const elPrevPageIndicator = elCurrPageIndicator.previousElementSibling

    if(!dir) {
        elCurrPageIndicator.classList.remove('selected')
        setTimeout(() => elCurrPageIndicator.classList.add('selected'), 12)                
    } else if(dir === 1) {
        if(elNextStory) {
            elNextPageIndicator.classList.add('selected')
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