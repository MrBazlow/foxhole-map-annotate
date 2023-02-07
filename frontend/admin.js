const { Sortable } = require('sortablejs');
const { Tabs } = require('flowbite');

addListeners(document)

// Admin tabs
const tabElements = [
  {
    id: 'general',
    triggerEl: document.querySelector('#general-tab'),
    targetEl: document.querySelector('#general')
  },
  {
    id: 'discord',
    triggerEl: document.querySelector('#discord-tab'),
    targetEl: document.querySelector('#discord')
  },
  {
    id: 'text',
    triggerEl: document.querySelector('#text-tab'),
    targetEl: document.querySelector('#text')
  }
]

const tabOptions = {
  defaultTabId: 'general',
  activeClasses: 'bg-warden-600 active-tab',
  inactiveClasses: 'inactive-tab'
}

const adminTabs = new Tabs(tabElements, tabOptions)

// Sortable.js Link list drag and drop.
const linkList = document.getElementById('linkList')
const sortableLinkList = Sortable.create(linkList, {
  handle: ".link-handle",
  animation: 200,
  easing: "cubic-bezier(0.25, 1, 0.5, 1)",
  onMove: (event) => (event.related.classList.contains('sortable'))
})


function addListeners(target) {
  const deleteRowButtons = target.getElementsByClassName('deleteRow')
  for (const button of deleteRowButtons) {
    if (button.dataset.clickAdded) {
      continue
    }
    button.dataset.clickAdded = 'true'
    button.addEventListener('click', (event) => {
      event.preventDefault()
      button.parentElement.remove()
    })
  }

  const addRowButtons = target.getElementsByClassName('addRow')
  for (const button of addRowButtons) {
    if (button.dataset.clickAdded) {
      continue
    }
    button.dataset.clickAdded = 'true'
    button.addEventListener('click', (event) => {
      event.preventDefault()
      const templateId = button.dataset.templateId
      const newRow = document.getElementById(templateId).content.cloneNode(true)
      button.parentElement.before(newRow)
      addListeners(button.parentElement.previousElementSibling)
      if (templateId.startsWith('discord-role-add')) {
        changeInputNames(button.parentElement.parentElement.getElementsByClassName('discordId')[0])
      }
    })
  }

  const discordIds = target.getElementsByClassName('discordId')
  for (const discordIdInput of discordIds) {
    if (discordIdInput.dataset.changeadded) {
      continue
    }
    discordIdInput.dataset.changeadded = 'true'
    discordIdInput.addEventListener('change', (event) => {
      changeInputNames(discordIdInput)
    })
  }
}

function changeInputNames(discordIdInput)
{
  const changeNeeded = discordIdInput.parentElement.parentElement.getElementsByClassName('discordIdChange')
  for (const input of changeNeeded) {
    input.name = input.name.replace(/\[discords\]\[\d*\]/, `[discords][${discordIdInput.value}]`)
  }
}