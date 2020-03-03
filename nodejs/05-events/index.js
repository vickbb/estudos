const EventEmitter = require('events');
class MeuEmissor extends EventEmitter {

}
const meuEmissor = new MeuEmissor()
const nomeEvento = 'usuarioClick'

meuEmissor.on(nomeEvento, function(click) {
  console.log('um usuario clicou', click)
})

// meuEmissor.emit(nomeEvento, 'na barra de rolagem');
// meuEmissor.emit(nomeEvento, 'no ok');

// let cont = 0;
// setInterval(function() {
//   meuEmissor.emit(nomeEvento, 'no ok ' + (cont++) )
// }, 1000)

const stdin = process.openStdin();
stdin.addListener('data', function(value) {
  console.log(`Você digitou: ${value.toString().trim()}`)
})