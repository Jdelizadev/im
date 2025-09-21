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
const historyText = $('.history__text')
const searchBtn = $('#search__btn')
const searchInput = $('#data')
const resulText = $('.search__text')

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

    const parseCoeff = (str) => {
        const cleanStr = str.replace(/\s/g, '');
        if (cleanStr === '' || cleanStr === '+') return 1;
        if (cleanStr === '-') return -1;
        return parseFloat(cleanStr);
    };
    const parseSingleExpression = (exprStr) => {
        const coeffs = { x: 0, y: 0 };
        const termsRegex = /([+-]?\s*\d*\.?\d*)\s*([xy])/g;
        let match;
        
        while ((match = termsRegex.exec(exprStr)) !== null) {
            const coeffValue = parseCoeff(match[1]); 
            const variable = match[2]; 
            coeffs[variable] = coeffValue;
        }
        return coeffs;
    };

    const mainRegex = /^\s*\((.*?)\)\s*\((.*?)\)\s*$/;
    const matches = expression.match(mainRegex);

    if (matches) {
        const firstExprCoeffs = parseSingleExpression(matches[1]); 
        const secondExprCoeffs = parseSingleExpression(matches[2]);

        const a = firstExprCoeffs.x;
        const b = firstExprCoeffs.y; 
        const c = secondExprCoeffs.x;
        const d = secondExprCoeffs.y;
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
});

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

    savebtn.classList.toggle('hidden')

    if(extras.style.display === 'none') {
        extras.style.display = 'grid'
    }  else {
        extras.style.display = 'none'
    }
    
    
})

btnHistory.addEventListener('click', async () => {
    try {
        const response = await fetch('/api/history')
        
        if(!response.ok) {
            throw new Error('No se pudo obtener la respuesta del servidor')
        }

        const data = await response.json()
        historyText.innerHTML = ''

        if (data.length === 0) {
            historyText.textContent = 'No hay historial para mostrar.';
        } else {
            data.forEach(operation => {
                const operationElement = document.createElement('p');
                operationElement.textContent = `${operation.expression} = ${operation.result}`;                
                historyText.appendChild(operationElement);
            });
        }

    } catch (error) {
        console.error('Error al obtener el historial:', error);
        historyText.textContent = 'Error al cargar el historial.';
    }
})

searchBtn.addEventListener('click', async () => {
    const searchTerm = searchInput.value.trim();

    if (!searchTerm) {
        alert('Por favor, ingresa un resultado para buscar.');
        return;
    }

    try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
        
        if (!response.ok) {
            throw new Error('La respuesta del servidor no fue exitosa.');
        }

        const results = await response.json();
        
        resulText.innerHTML = '';

        if (results.length === 0) {
            resulText.textContent = 'No se encontraron operaciones con ese resultado.';
        } else {
            results.forEach(op => {
                const p = document.createElement('p');
                p.textContent = `${op.expression} = ${op.result}`;
                resulText.appendChild(p);
            });
        }
    } catch (error) {
        console.error('Error al realizar la búsqueda:', error);
        resulText.textContent = 'Ocurrió un error al buscar.';
    }
});

