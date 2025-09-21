const $ = (id) => document.querySelector(id)

const display = $('#operation')
const buttons = document.querySelectorAll('.calc__btn')
const total = $('#btntotal')
const clear = $('#btnclear')
const result = $('#result')
const savebtn = $('#savebtn')
const dropbtn = $('#DropDownList')
const list = $('.list__container')
const extras = $('.extras')
const btnHistory = $('#btn__history')

console.log(display)
buttons.forEach(button => {
    button.addEventListener('click', () => {
        display.textContent += button.dataset.value
    })
});

clear.addEventListener('click', () => {
    display.textContent = '';
    result.textContent = ''
})

total.addEventListener('click', () => {
    
const expression = display.textContent;

const regex = /\((-?\d*\.?\d*)x\s*([+-]\s*\d*\.?\d*)y\)\s*\((-?\d*\.?\d*)x\s*([+-]\s*\d*\.?\d*)y\)/;
const matches = expression.match(regex);

if (matches) {
const parseCoeff = (str) => {
if (str === '' || str === '+') return 1;
if (str === '-') return -1;
return parseFloat(str.replace(/\s/g, '')); 
};

const a = parseCoeff(matches[1]);
const b = parseCoeff(matches[2]);
const c = parseCoeff(matches[3]);
const d = parseCoeff(matches[4]);

const x2coeff = a * c;
const xycoeff = (a * d) + (b * c);
const y2coeff = b * d;

let resultado = '';
if (x2coeff !== 0) resultado += `${x2coeff}x² `;
if (xycoeff > 0 && resultado) resultado += `+ ${xycoeff}xy `;
else if (xycoeff < 0) resultado += `- ${Math.abs(xycoeff)}xy `;
if (y2coeff > 0 && resultado) resultado += `+ ${y2coeff}y²`;
else if (y2coeff < 0) resultado += `- ${Math.abs(y2coeff)}y²`;

result.textContent = resultado.trim();

} else {
result.textContent = 'Error de formato';
}
})

savebtn.addEventListener('click', async () => {
        const expression =  display.textContent;
        const resultado = result.textContent;
        console.log(expression, resultado)

        if (!expression || resultado === 'Error de formato' || !resultado) {
            alert('No hay una operación válida para guardar.');
             return;
            }

        try {
            const response = await fetch('/api/operations', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
        },
            body: JSON.stringify({ expression, result:resultado }) 
            });

        if (response.ok) {
            alert('¡Operación guardada con éxito!');
        } else {
            alert('Error al guardar la operación.');
        }

        } catch (error) {
            console.error('Error de conexión:', error);
            alert('No se pudo conectar con el servidor.');
        }
});

dropbtn.addEventListener('click', () => {
    savebtn.classList.toggle('hidden');
    extras.classList.toggle('hidden');
    
})

btnHistory.addEventListener('click', () => {
    
})


