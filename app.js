$(document).ready(function(){
    $(window).scroll(function(){
        // sticky navbar on scroll script
        if(this.scrollY > 20){
            $('.navmenu').addClass("sticky");
        }else{
            $('.navmenu').removeClass("sticky");
        }
        
    });
// typing text animation script
    var typed = new Typed(".typing", {
        strings: ["Designer WEB"],
        typeSpeed: 100,
        backSpeed: 60,
        loop: true
    });

    var typed = new Typed(".typing-2", {
        strings: ["Designer WEB"],
        typeSpeed: 100,
        backSpeed: 60,
        loop: true
    });

    document.addEventListener('mousemove', (e) =>{
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        const anchor = document.getElementById('anchor')
        const rekt = anchor.getBoundingClientRect();
        const anchorX = rekt.left + rekt.width /2;
        const anchorY = rekt.top + rekt.height /2;

        const angleDeg = angle(mouseX, mouseY, anchorX, anchorY);

        const eyes = document.querySelectorAll('.eye')
        eyes.forEach(eye => {
            eye.style.transform = `rotate(${90+ angleDeg}deg)`;
        })
    })

    function angle(cx,cy,ex,ey){
        const dy = ey - cy;
        const dx = ex - cx;
        const rad = Math.atan2(dy, dx)
        const deg = rad * 180 / Math.PI;
        return deg;
    }
});

//Navmenu
const menu = document.querySelector('.menu');
const menuBtn = document.querySelector('.menu-btn');

//Add click event
menuBtn.addEventListener('click', () =>{
    //toggle menu open
    menu.classList.toggle('menu-open');
});

//stats Counter service section
const stats = document.querySelector('.box');
const counters = document.querySelectorAll(".counter")
let bol = false;

const sectionOffset = stats.offsetTop + stats.offsetHeight;

window.addEventListener("scroll", () => {
    const pageOffset = window.innerHeight + pageYOffset;
    if(pageOffset > sectionOffset && bol === false){
        counters.forEach((counter) => {
            function updateCount(){
                const target = +counter.getAttribute('data-target');
                const speed = +counter.getAttribute('data-speed');
                const count = +counter.innerText;
                if(count < target){
                    counter.innerText = count + 1;
                    setTimeout(updateCount, speed);
                }else{
                    counter.innerText = target;
                }
            }
            updateCount();
            bol = true;
        });
    }
});


/*******************/
/* Particle Effect */
/*******************/

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

//get mouse position
let mouse = {
    x: null,
    y: null,
    radius: (canvas.height/80) * (canvas.width/80)
}

window.addEventListener('mousemove',
    function(event){
        mouse.x = event.x;
        mouse.y = event.y;
    }
);

//create particle
class Particle{
    constructor(x, y, directionX, directionY, size, color){
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    //draw individual particle
    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = 'rgba(200,225,225,1)';
        ctx.fill();
    }
    //check particle position, mouse, move the particle and draw it
    update(){
        if(this.x > canvas.width || this.x < 0){
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y <0){
            this.directionY = -this.directionY;
        }

        //check collision
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy)
        if(distance < mouse.radius + this.size){
            if(mouse.x < this.x && this.x < canvas.width - this.size *10){
                this.x += 10;
            }
            if(mouse.x > this.x && this.x > this.size * 10){
                this.x -= 10;
            }
            if(mouse.y < this.y && this.y < canvas.height - this.size * 10){
                this.y += 10;
            }
            if(mouse.y > this.y && this.y > this.size * 10){
                this.y -= 10;
            }
        }
        //move particle
        this.x += this.directionX;
        this.y += this.directionY;
        //draw particle
        this.draw();
    }
}

//create particle array
function init(){
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 15000;
    for(let i = 0; i < numberOfParticles; i++){
        let size = (Math.random() * 5) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 5) - 2.5;
        let directionY = (Math.random() * 5) - 2.5;
        let color = 'rgba(200,225,225,1)';

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// check if particles are clsoe enough to draw line beetween
function connect(){
    let opacityValue = 1;
    for(let a = 0; a < particlesArray.length; a++){
        for(let b = a; b < particlesArray.length; b++){
            let distance = ((particlesArray[a].x - particlesArray[b].x)
            * (particlesArray[a].x - particlesArray[b].x))
            + ((particlesArray[a].y - particlesArray[b].y) * 
            (particlesArray[a].y - particlesArray[b].y));
            if (distance < (canvas.width/7) * (canvas.height/7)){
                opacityValue = 1 - (distance/20000);
                ctx.strokeStyle = 'rgba(200,225,225' + opacityValue + ')';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x,particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

//animation loop
function animate(){
    requestAnimationFrame(animate);
    ctx.clearRect(0,0,innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++){
        particlesArray[i].update();
    }
    connect();
}

//resize event
window.addEventListener('resize',
    function () {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        mouse.radius = ((canvas.height/80) * (canvas.height/80));
        init();
    }
);

//mouse out event
window.addEventListener('mouseout',
    function(){
        mouse.x = undefined;
        mouse.x = undefined;
    }
)


init();
animate();

$(".carousel").owlCarousel({
    margin: 10,
    loop : true,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    responsive:{
      0:{
        items:1,
        nav:false
      },
      600:{
        items:2,
        nav:false
      },
      1000:{
        items:3,
        nav:false
      }
    }
  
  });


  document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn');
    const projects = document.querySelectorAll('.projets-list');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // Retire la classe 'active' de tous les boutons
            buttons.forEach(btn => btn.classList.remove('active'));
            // Ajoute la classe 'active' au bouton cliqué
            button.classList.add('active');

            // Affiche la bonne catégorie de projets
            const category = button.getAttribute('data-category');
            projects.forEach(project => {
                if (project.id === category) {
                    project.classList.add('active');
                } else {
                    project.classList.remove('active');
                }
            });
        });
    });
});