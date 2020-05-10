// Creamos el objeto global ws para acceder al websocket desde diferentes funciones
let ws

const Router = {
  routes: [],
  mode: null,
  root: '/',
  config: function (options) {
    this.mode = options && options.mode && options.mode == 'history'
      && !!(history.pushState) ? 'history' : 'hash';
    this.root = options && options.root ? '/' + this.clearSlashes(options.root) + '/' : '/';
    return this;
  },
  getFragment: function () {
    var fragment = '';
    if (this.mode === 'history') {
      fragment = this.clearSlashes(decodeURI(location.pathname + location.search));
      fragment = fragment.replace(/\?(.*)$/, '');
      fragment = this.root != '/' ? fragment.replace(this.root, '') : fragment;
    } else {
      var match = window.location.href.match(/#(.*)$/);
      fragment = match ? match[1] : '';
    }
    return this.clearSlashes(fragment);
  },
  clearSlashes: function (path) {
    return path.toString().replace(/\/$/, '').replace(/^\//, '');
  },
  add: function (re, handler) {
    if (typeof re == 'function') {
      handler = re;
      re = '';
    }
    this.routes.push({ re: re, handler: handler });
    return this;
  },
  remove: function (param) {
    for (var i = 0, r; i < this.routes.length, r = this.routes[i]; i++) {
      if (r.handler === param || r.re.toString() === param.toString()) {
        this.routes.splice(i, 1);
        return this;
      }
    }
    return this;
  },
  flush: function () {
    this.routes = [];
    this.mode = null;
    this.root = '/';
    return this;
  },
  check: function (f) {
    var fragment = f || this.getFragment();
    for (var i = 0; i < this.routes.length; i++) {
      var match = fragment.match(this.routes[i].re);
      if (match) {
        match.shift();
        this.routes[i].handler.apply({}, match);
        return this;
      }
    }
    return this;
  },
  listen: function () {
    var self = this;
    var current = self.getFragment();
    var fn = function () {
      if (current !== self.getFragment()) {
        current = self.getFragment();
        self.check(current);
      }
    }
    clearInterval(this.interval);
    this.interval = setInterval(fn, 50);
    return this;
  },
  navigate: function (path) {
    path = path ? path : '';
    if (this.mode === 'history') {
      history.pushState(null, null, this.root + this.clearSlashes(path));
    } else {
      window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + path;
    }
    return this;
  }
}

// configuration
Router.config({ mode: 'history' });

// returning the user to the initial state
Router.navigate();


//Agregando rutas

Router.add(/login/, function () {
  document.body.classList.add('login-page')
  document.body.classList.remove('container')
  document.body.innerHTML = `
  <body>
  <header class="header"> </header>
    <div class="container-login" id="container-login">
    <h3 class="title-login"> Iniciar sesión </h3>
    <h3 class="subtitle-login"> Iniciar sesión con </h3>
    <div class="container-sociales grid grid-tc-3 gg1">
      <a href="#" class="text-login sm"> Google </a>
      <a href="#" class="text-login sm"> Facebook </a>
      <a href="#" class="text-login sm"> Twitter </a>
    </div>
    <form class="login grid grid-tc-6" id="formulario-login">
      <div class="grid-c-6">
        <input class="inpt" type="email" name="email" placeholder="Ingresa tu correo electrónico">
      </div>
      <div class="grid-c-6">
        <input class="inpt" type="password" name="password" placeholder="Ingresa tu contraseña">
      </div>
      <div class="grid-c-6">
        <input class="btn-submit inpt" type="submit" value="Ingresar">
      </div>
    </form>
    <a href="#" class="btn-a" id="btnRedirectionRegister"> ¿No tienes cuenta? Registrate gratis. </a>
  </div>
  <footer class="footer"> </footer>
  <div class="modal" id="modal-login"> 
    <h2 class="text-modal"> ¡ Lo sentimos ! </h2>
    <h2 class="text-modal"> Contraseña incorrecta o usuario no registrado </h2>
    </div>
    </body>
  `
  listenerLogin()
  btnRedirectionRegister.addEventListener('click', e => {
    e.preventDefault()
    Router.navigate('/register/')
  })

}).add(/register/, () => {
  document.body.classList.add('login-page')
  document.body.classList.remove('container')
  document.body.innerHTML = `
  <body>
  <header class="header"> </header>
  <div class="container-register" id="container-register">
    <h3 class="title-register"> Registrarme </h3>
    <h3 class="subtitle-register"> Registarme con </h3>
    <div class="container-sociales grid grid-tc-3 gg1">
      <a href="#" class="text-login sm"> Google </a>
      <a href="#" class="text-login sm"> Facebook </a>
      <a href="#" class="text-login sm"> Twitter </a>
    </div>
    <form class="register grid grid-tc-6" id="formulario-register">
      <div class="grid-c-6">
        <input class="inpt" type="text" name="name" placeholder="Ingresa tu nombre" required />
      </div>
      <div class="grid-c-6">
        <input class="inpt" type="text" name="lastname" placeholder="Ingresa tus apellidos" required />
      </div>
      <div class="grid-c-6">
        <input class="inpt" type="email" name="email" placeholder="Ingresa tu correo electrónico" required />
      </div>
      <div class="grid-c-6">
        <input class="inpt" type="password" name="password" placeholder="Ingresa tu contraseña" required />
      </div>
      <div class="grid-c-6">
        <input class="inpt" type="password" name="spassword" placeholder="Repite tu contraseña" required />
      </div>
      <div class="grid-c-6">
        <input class="btn-submit inpt" id="btn-submit" type="submit" value="Registrarse">
      </div>
    </form>
    <a href="#" class="btn-a" id="btnRedirectionLogin"> Ya tengo cuenta. Iniciar sesión. </a>
    </div>
    <footer class="footer"> </footer>
     <div class="modal" id="modal-register"> 
    <h2 class="text-modal"> Registro exitoso </h2>
    </div>
    </body>
  `
  listenerRegistro()
  btnRedirectionLogin.addEventListener('click', e => {
    e.preventDefault()
    Router.navigate('/login/')
  })
}).add(/chat/, () => {
  document.body.classList.add('container')
  document.body.classList.remove('login-page')
  document.body.innerHTML = `
  <body>
  <main class="container-chat">
    <div class="container-messages-space">
    <div class="message-title"> Chat </div>
      <div class="message-send" id="message-send">

      </div>
      <div class="container-form">
        <form class="form-chat" id="form-chat">
          <input type="text" class="inpt-text" name="message" placeholder="Ingresa tu mensaje" autocomplete="off">
          <input type="submit" class="inpt-submit" value="Enviar">
        </form>
      </div>
    </div>
    <aside class="container-barside">
      <div class="c-users" id="c-users">
        <h2 class="text-users"> Usuarios Conectados </h2>
      </div>
      <div class="users">
        <span class="user-name"> </span>
        <span class="user-status"> En línea</span>
      </div>
      <div class="account-off">
        <a href="#" class="sing-off" id="sign-off"> Cerrar sesión</a>
      </div>
    </aside>
  </main>
  </body>
  `
  formMesssage()

  singOff = document.getElementById('sign-off')
  singOff.addEventListener('click', e => {
    e.preventDefault()
    ws.close()
    localStorage.clear()
    Router.navigate('/login/')
  })

}).listen()

// if (localStorage.setItem('token')) {
//   Router.navigate('/chat/')
// } else {
//   Router.navigate('/login/')
// }
Router.navigate('/login/')


const wsInicialization = (user) => {
  if (user) {
    const token = localStorage.getItem('token')
    const wsUrl = `ws://localhost:9393/ws?nick=${user}&token=${token}`
    ws = new WebSocket(wsUrl);

    ws.onopen = () => { console.log("Conectado") }

    ws.onerror = e => { console.log(e) }

    ws.onmessage = e => {
      console.log(e.data)
      messageToPrint(JSON.parse(e.data))

    }
  }
}




