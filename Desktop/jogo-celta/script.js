const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let carroEscolhido = 'celta';

const imgCelta = new Image();
imgCelta.src = 'celta.png';

const imgChevette = new Image();
imgChevette.src = 'chevette.png';

let carX = 80;
let carY = 210;

let tamanhoCelta = { width: 240, height: 110 };
let tamanhoChevette = { width: 280, height: 190 };

let velocidadeEstrada = 4;
let usandoNitro = false;
let fatorVelocidade = 1;
let estradaX = 0;
let jogoAtivo = false;

function iniciarJogo(tipoCarro) {
    carroEscolhido = tipoCarro;
    document.getElementById('menuSelecao').style.display = 'none';
    document.getElementById('painelJogo').style.display = 'flex';
    jogoAtivo = true;
}

function voltarMenu() {
    jogoAtivo = false;
    document.getElementById('painelJogo').style.display = 'none';
    document.getElementById('menuSelecao').style.display = 'block';
    usandoNitro = false;
}

const btnNitro = document.getElementById('btnNitro');

if (btnNitro) {
    btnNitro.addEventListener('mousedown', () => { usandoNitro = true; });
    btnNitro.addEventListener('mouseup', () => { usandoNitro = false; });
    btnNitro.addEventListener('mouseleave', () => { usandoNitro = false; });

    btnNitro.addEventListener('touchstart', (e) => { e.preventDefault(); usandoNitro = true; });
    btnNitro.addEventListener('touchend', (e) => { e.preventDefault(); usandoNitro = false; });
}

function atualizar() {
    if (!jogoAtivo) return;

    if (usandoNitro) {
        fatorVelocidade = 2.5;
    } else {
        fatorVelocidade = 1;
    }

    estradaX -= velocidadeEstrada * fatorVelocidade;
    if (estradaX <= -70) {
        estradaX = 0;
    }
}

function desenharCenario() {
    ctx.fillStyle = '#0b0b16';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#222229';
    ctx.fillRect(0, 230, canvas.width, 150);

    ctx.strokeStyle = '#555';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 230);
    ctx.lineTo(canvas.width, 230);
    ctx.stroke();

    // Corrigido para a pista andar para a frente corretamente
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 6;
    ctx.setLineDash([40, 30]);
    ctx.lineDashOffset = -estradaX; 
    
    ctx.beginPath();
    ctx.moveTo(0, 305);
    ctx.lineTo(canvas.width, 305);
    ctx.stroke();
    ctx.setLineDash([]); 
}

function desenhar() {
    if (!jogoAtivo) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    desenharCenario();

    let imagemAtual = (carroEscolhido === 'celta') ? imgCelta : imgChevette;
    let dimensoesAtuais = (carroEscolhido === 'celta') ? tamanhoCelta : tamanhoChevette;
    
    if (imagemAtual.complete && imagemAtual.naturalWidth !== 0) {
        ctx.drawImage(imagemAtual, carX, carY, dimensoesAtuais.width, dimensoesAtuais.height);
    }

    // Se o Nitro estiver ativo, desenha a chama perfeitamente encaixada na traseira
    if (usandoNitro) {
        // Altura vertical ajustada para cada carro
        let alturaEscape = (carroEscolhido === 'celta') ? carY + 75 : carY + 115;
        // Posição horizontal corrigida para a traseira do carro (lado esquerdo da imagem)
        let pontaTraseira = carX + 15; 

        ctx.fillStyle = '#ff4500';
        ctx.beginPath();
        ctx.moveTo(pontaTraseira, alturaEscape);
        ctx.lineTo(pontaTraseira - 45, alturaEscape + 5);
        ctx.lineTo(pontaTraseira, alturaEscape + 10);
        ctx.fill();

        ctx.fillStyle = '#ffea00';
        ctx.beginPath();
        ctx.moveTo(pontaTraseira, alturaEscape + 2);
        ctx.lineTo(pontaTraseira - 22, alturaEscape + 5);
        ctx.lineTo(pontaTraseira, alturaEscape + 8);
        ctx.fill();
    }
}

function loop() {
    atualizar();
    desenhar();
    requestAnimationFrame(loop);
}

loop();