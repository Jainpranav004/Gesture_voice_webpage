const hamburger=document.getElementsByTagName('header')[0].lastElementChild.lastElementChild.previousElementSibling
console.log(hamburger)
const nav=document.getElementsByTagName('nav')[0]
console.log(nav)
hamburger.addEventListener('click',()=>{
    nav.classList.toggle('hidden')
})