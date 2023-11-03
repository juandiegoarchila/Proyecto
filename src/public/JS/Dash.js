let MenuTogle = document.querySelector('.MenuTogle');
let sidebar = document.querySelector('.sidebar');
let main = document.querySelector('.main');



MenuTogle.onclick = function(){
MenuTogle.classList.toggle('active');
sidebar.classList.toggle('active')
main.classList.toggle('active')

}

let Menulist = document.querySelectorAll('.Menulist li');
function activeLink(){
Menulist.forEach((item)=>
item.classList.remove('active'));
this.classList.add('active');
}
Menulist.forEach((item)=>
item.addEventListener('click',activeLink))