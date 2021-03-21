const header = document.querySelector('#header-portifolio')
const btnMenu = document.querySelector('#btnMenu')
const options = document.querySelector('#options')
const linksOptions = document.querySelectorAll('.link-option')
const allProjects = document.querySelectorAll('.projeto')
const visibleProjects = document.querySelectorAll('.visivel')
const closeProject = document.querySelectorAll('.closeProject')
var controlProjects = false

window.onscroll = () => {
    header.classList.toggle('active', window.scrollY > 0)
    document.querySelector('.prev').classList.toggle('active', window.scrollY > 800)
    document.querySelector('.next').classList.toggle('active', window.scrollY < 1800)
}
btnMenu.addEventListener('click', () => {
    if (options.classList.contains('active')) {
        options.classList.remove('active')
        if(window.scrollY = 0) {
            header.classList.remove('active')
        }
    } else {
        options.classList.add('active')
        header.classList.add('active')
    }
})
linksOptions.forEach(element => {
    element.addEventListener('click', () => {
        options.classList.remove('active')
        header.classList.remove('active')
    })
});

document.querySelector('#showAll').addEventListener('click', () => {
    if (!controlProjects) {
        document.querySelector('#showAll').innerHTML = "Mostrar Menos"
        allProjects.forEach(element => {
            element.classList.add('visivel')
        });
        controlProjects = true
    } else {
        document.querySelector('#showAll').innerHTML = "Mostrar Tudo"
        allProjects.forEach(element => {
            element.classList.remove('visivel')
        });
        visibleProjects.forEach(element => {
            element.classList.add("visivel")
        })
        controlProjects = false
    }
})
allProjects.forEach(project => {
    project.addEventListener('click', () => {
        document.querySelector(`#${project.dataset.modal}`).classList.add('active')
        document.querySelector('body').classList.add('active-modal')
    })
});
closeProject.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('body').classList.remove('active-modal')
        document.querySelectorAll('.modal').forEach(element => {
            element.classList.remove('active')
        });
    })
});
