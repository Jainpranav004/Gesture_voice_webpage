const hamburger=document.getElementsByTagName('header')[0].lastElementChild.lastElementChild.previousElementSibling
console.log(hamburger)
const nav=document.getElementsByTagName('header')[0].firstElementChild.nextElementSibling.firstElementChild
console.log(nav)
hamburger.addEventListener('click',()=>{
    nav.classList.toggle('hidden')
})