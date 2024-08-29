const hambg=document.getElementsByTagName('section')[0].previousElementSibling;
        // const hambg=document.getElementById('#hambg');
console.log(hambg)
const nav=document.getElementsByTagName('div')[0];
console.log(nav)
hambg.addEventListener('click',()=>{
    if(nav.classList.contains('hidden')){
        nav.classList.replace('hidden','block')
    }else{
        nav.classList.replace('block','hidden')
    }
})