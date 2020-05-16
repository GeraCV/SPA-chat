const api = 'http://localhost:9393/api'
const apiRegister = api + '/v1/register'
const apiLogin = api + '/v1/login'

const prepareRegister = async user => {
  const resultRegister = await sharedInformation(apiRegister, 'POST', user)
  return resultRegister

}

const prepareLogin = async user => {
  const resultLogin = await sharedInformation(apiLogin, 'POST', user)
  if (resultLogin.type === "ok") {
    console.log("Usuario correcto")
    localStorage.setItem('token', resultLogin.data)
    return resultLogin
  } else {
    console.log("Usuario incorrecto")
  }

}

const sharedInformation = async (url, method, user) => {
  const header = new Headers()
  header.append('Content-Type', 'application/json')

  const Inicialization = {
    method: method,
    headers: header,
    body: JSON.stringify(user)
  }

  const dataForSend = await fetch(url, Inicialization)
  const response = await dataForSend.json()
  console.log(response)
  return response
}

//prepareRegister()
//prepareLogin()

const listenerRegistro = () => {

  const modalRegister = document.getElementById('modal-register')
  const formRegister = document.getElementById('formulario-register')
  if (formRegister) {
    formRegister.addEventListener('submit', e => {
      e.preventDefault()
      let user = {
        name: e.target.name.value,
        lastname: e.target.lastname.value,
        email: e.target.email.value,
        password: e.target.password.value
      }
      prepareRegister(user)
        .then((resultRegister) => {
          // console.log(resultRegister)
          if (resultRegister.type === "ok") {
            modalRegister.classList.add('show')
            setTimeout(() => {
              Router.navigate('/login/')
            }, 1000);
          }
        })
    })
  }
}

const listenerLogin = () => {
  const modalLogin = document.getElementById('modal-login')
  const formLogin = document.getElementById('formulario-login')
  if (formLogin) {
    formLogin.addEventListener('submit', e => {
      e.preventDefault()
      let user = {
        email: e.target.email.value,
        password: e.target.password.value
      }
      prepareLogin(user)
        .then((resultLogin) => {
          if (resultLogin.type === "ok") {
            Router.navigate('/chat/')
            wsInicialization(user.email)
          }
        }).catch(() => {
          modalLogin.classList.add('show')
          setTimeout(() => {
            modalLogin.classList.remove('show')
          }, 1500);

        })
    })
  }
}


const messageToPrint = data => {
  const now = new Date()
  switch (data.type) {
    case "connect":
      //console.log("Estás conectado correctamente")
      const cUsers = document.getElementById('c-users')
      const userConnected =
        `
    <div class="users">
        <span class="user-name"> ${data.from} </span>
        <span class="user-status"> En línea</span>
      </div>
    `
      if (cUsers) {
        cUsers.insertAdjacentHTML('beforeend', userConnected)
      }
      break
    case "message":
      const contentMessage =
        ` 
      <div class="message">
        <div class="m-avatar">
          <img src="user.png" alt="img-user" width="60px">
        </div>
        <div class="m-info">
          <div class="m-user">
            <span class="m-user-name">${data.from} </span>
            <span class="mesage-user-time"> ${now.getHours()}:${now.getMinutes()}</span>
          </div>
          <div class="m-content">
            ${data.data}
          </div>
        </div>
      </div>
      `
      if (data.data) {
        const cm = document.getElementById('message-send')
        cm.insertAdjacentHTML('beforeend', contentMessage)
      }
      break
    case "giphy":

      const contentGiphy =
        ` 
      <div class="message">
        <div class="m-avatar">
          <img src="user.png" alt="img-user" width="60px">
        </div>
        <div class="m-info">
          <div class="m-user">
            <span class="m-user-name">${data.from} </span>
            <span class="mesage-user-time"> ${now.getHours()}:${now.getMinutes()}</span>
          </div>
          <div class="m-content">
            <img src = ${data.data}>
          </div>
        </div>
      </div>
      `
      if (data.data) {
        const cm = document.getElementById('message-send')
        cm.insertAdjacentHTML('beforeend', contentGiphy)
      }

      break
    case "disconnect":
      console.log('Desconectado.')
      break
    default:
      console.log('No se encontró información.')
      break;
  }
}


const formMesssage = () => {
  const formChat = document.getElementById('form-chat')
  if (formChat) {
    formChat.addEventListener('submit', async e => {
      e.preventDefault()
      const messageForSend = {}
      const capturingMessage = e.target.message.value
      if (capturingMessage.startsWith('/giphy')) {
        const header = new Headers()
        header.append('Content-type', 'application/json')

        const uri = `api.giphy.com/v1/gifs/search`
        const api = `A94CYWTwTUpJUNe0wc9SyIikc2CyQaWK`
        const q = encodeURI(capturingMessage.substring(7))
        const url = `https://${uri}?api_key=${api}&q=${q}`
        console.log(apiKey)

        const InitializationGiphy = {
          method: 'GET',
          headers: header,
          mode: 'cors',
          cache: 'default'
        }

        const response = await fetch(url, InitializationGiphy)
        const result = await response.json()

        messageForSend.type = 'giphy'
        messageForSend.data = result.data[0].images.fixed_height.url

      } else {
        messageForSend.type = 'message'
        messageForSend.data = capturingMessage
      }
      //console.log(JSON.stringify(messageForSend))
      console.log(messageForSend)
      ws.send(JSON.stringify(messageForSend))
      e.target.message.value = ''
    })
  }
}






