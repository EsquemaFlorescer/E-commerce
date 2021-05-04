const getComponent = async componentName => {
  const response = await fetch(`./components/${componentName}.html`)
  const data = await response.text()
  createComponent(componentName, data)
}

const createComponent = async (component, data) => {
  const newComponent = document.createElement(component)
  newComponent.innerHTML = data

  document.querySelector(".homeContainer").appendChild(newComponent)

  const links = document.querySelectorAll("a")
  
  links.forEach(link => {
    link.addEventListener("click", event => {
      document.querySelector(".active-link").classList.remove("active-link")
      event.target.classList.add("active-link")
    })
  })
}

export { getComponent }