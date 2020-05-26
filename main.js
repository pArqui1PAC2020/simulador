//Ángel 22/05/2020-14:57

/**************************************************************************************/
//DEFINIENDO CLASES
const comandos = ["ldr", "str", "mov", "add", "sub", "mul", "and", "mvn", "eor", "orr", "Neg"];
const errores = {
	comando: {
		1: "El comando que ingresó es desconocido"
	},
	espacio: {
		1: "Está tratando un espacio de memoria innaccesible",
		2: "Error de almacenamiento",
		3: "Error de carga",
		4: "El dato inmediato es inválido",
		5: "Valor de dato inmediato fuera de rango",
		6: "Se ha producido un desbordamiento"
	},
	registro: {
		1: "Muchos registros para esa instrucción",
		2: "Dicha instrucción requiere de más registros",
		3: "No se puede acceder al registro"
	},
	sintaxis: {
		1: "Mala sintaxis al momento de usar la instrucción"
	},
	desconocido: {
		1: "Error desconocido"
	},
	ejecucion: {
		1: "Tiene que detener la ejecución del programa con el comando 'stop:wfi' al final del código",
		2: "Muchos elementos para una instrucción"
	}
};

class Registro {
	constructor(nombre, contenido) {
		this.nombre = nombre;
		this.contenido = contenido;
	}
}


class Byte {
	constructor(dir_memoria, contenido) {
		this.dir_memoria = dir_memoria;
		this.contenido = contenido;
	}
}

//declarando variables y arreglos
var registros = [];
var RAM = [];


function inicializar_registros() {
	//declarar un arreglo con los registros inicializandolos en 0

	var inicio = 0000000;
	var inicioHexa = inicio.toString(16); // A la base 16
	//console.log("El número decimal %s en hexadecimal es %s", decimal, decimalEnHexadecimal);

	for (let i = 0; i < 16; i++) {
		if (i >= 13) {
			switch (i) {
				case 13:
					registros.push(new Registro(`r${i} (SP)`, "0x" + "00000000"))
					break;
				case 14:
					registros.push(new Registro(`r${i} (LR)`, "0x" + "00000000"))
					break;
				case 15:
					registros.push(new Registro(`r${i} (PC)`, "0x" + "00180000"))
					break;
			}
		} else {
			let nombre = `r${i}`
			registros.push(new Registro(nombre, "0x" + "00000000"))
		}

	}

	console.log(registros);



} inicializar_registros();


//inicializando la memoria RAM
function inicializar_RAM() {
	var inicio = 0000000;
	var inicioHexa = inicio.toString(16); // A la base 16
	//console.log("El número decimal %s en hexadecimal es %s", decimal, decimalEnHexadecimal);
	for (let i = 0; i < 40; i++) {
		if (i <= 9) {
			RAM.push(new Byte(`0x2007000${i}`, "00"))
		}
		else {
			RAM.push(new Byte(`0x200700${i}`, "00"))
		}

	}

} inicializar_RAM();
console.log(RAM)

//a = ["mov r0, r1", "mov r1, r2", "stop: wfi"]
//a = [["mov", "r0", "r1"], ]

// arregloROM = [
// 	{
// 		direccion: "dirección de memoria ROM 00",
// 		instruccion: "instruccion"
// 	},
// 	{
// 		direccion: "dirección de memoria ROM 02",
// 		instruccion: "instruccion"
// 	}
// ]

ROM = [];

var contadorLineas = 0;
var contadorErrores = 0;
var textoArr = [];
//Es la primera función que se ejecuta al momento de dar clic el botón Ejecutar de index.html
function ejecutar() {
	// document.getElementById('area-de-codigo').value = null;
	inicializar_registros();
	inicializar_RAM();
	document.getElementById('errores').innerHTML = '';
	contadorErrores = 0;
	contadorLineas = 0;
	textoArr.length = 0;
	vaciarArreglos();
	let estado;
	let j = 0; //Línea actual
	var texto = document.getElementById('area-de-codigo');
	console.log(texto.value);
	if (contarCaracterCadena(texto.value, '\n') == 0) {
		textoArr.push(texto.value);
	} else {
		textoArr = texto.value.split('\n');
	}											//guarda en el arreglo textoArr todas las palabras separadas por un salto de línea
	console.log(textoArr);
	for (let i = 0; i < textoArr.length; i++) {		/** recorre el arreglo para encontrar espacios en blanco y borrarlos*/
		if (textoArr[i] == "") {
			textoArr = borrarElemento(textoArr, textoArr[i]); //Borra todos los espacios en blanco del arreglo
		}
	}
	console.log(textoArr);
	// while(contadorLineas < textoArr.length){
	// estado = existenciaDeInstruccion(textoArr[contadorLineas]); //con los espacios en blanco borrados, va recorriendo línea por línea para analizar el código
	if (borrarElementoCadena(textoArr[textoArr.length - 1], ' ') == 'stop:wfi') { //función que analiza cada elemento del arreglo
		existenciaDeInstruccion(textoArr[contadorLineas]); //console.log("bien"); //Si todo está bien, se pasa a la siguiente línea
	} else {
		imprimirError(errores["ejecucion"][1]);
		// contadorLineas = textoArr.length;
	}
}

function ejecutarSiguienteInstruccion(numLinea) {
	existenciaDeInstruccion(textoArr[numLinea]);
}

var arrParaAnalizarLaInstruccion = [];
var nuevoStr = []; //["r", "0", ",", "", "r", "1"]
function existenciaDeInstruccion(instruccion) { //instrucción = "mov r0, r1"
	let i = 0;
	let bien = false;
	let bien2 = false;
	let arrParaAnalizarLosRegistros = [];
	arrParaAnalizarLaInstruccion = instruccion.split(' '); //["mov", "r0,", "r1"] Separo cada instrucción en espacios y guardo cada elemento en un arreglo
	while (i < comandos.length) {
		if (arrParaAnalizarLaInstruccion[0] == comandos[i]) { //comparo ese primer elemento con las instrucciones que ya están guardadas en comandos
			bien = true;
			if (arrParaAnalizarLaInstruccion.length == 3 && contarCaracterCadena(arrParaAnalizarLaInstruccion[1], ',') == 1 && contarCaracterCadena(arrParaAnalizarLaInstruccion[1], 'r') == 1 && contarCaracterCadena(arrParaAnalizarLaInstruccion[1], '#') < 1 && contarCaracterCadena(arrParaAnalizarLaInstruccion[2], ',') < 1) { //["ins", "r0,", "r1"] || ["ins", "r0,", "#A..."]
				arrParaAnalizarLaInstruccion[1] = borrarElementoCadena(arrParaAnalizarLaInstruccion[1], ',');
				bien2 = true;
			} else if (arrParaAnalizarLaInstruccion.length == 4 && contarCaracterCadena(arrParaAnalizarLaInstruccion[1], ',') == 1 && contarCaracterCadena(arrParaAnalizarLaInstruccion[1], 'r') == 1 && contarCaracterCadena(arrParaAnalizarLaInstruccion[1], '#') < 1 && contarCaracterCadena(arrParaAnalizarLaInstruccion[2], ',') == 1 && contarCaracterCadena(arrParaAnalizarLaInstruccion[3], ',') < 1) { //["ins", "r...,", "r...,", "r..."]
				arrParaAnalizarLaInstruccion[1] = borrarElementoCadena(arrParaAnalizarLaInstruccion[1], ',');
				arrParaAnalizarLaInstruccion[2] = borrarElementoCadena(arrParaAnalizarLaInstruccion[2], ',');
				bien2 = true;
			} else if (arrParaAnalizarLaInstruccion.length > 4) {
				imprimirError(errores["ejecucion"][2]);
			} else {
				imprimirError(errores["sintaxis"][1]);
			}
			break;
		} else {
			i++;
		}
	}

	analisisFinal(bien, bien2);

	// console.log(arrParaAnalizarLaInstruccion); //["ins", "op1", "op2"] || ["ins", "op1", "op2", "op3"]


}

function analisisFinal(bien, bien2) {
	if (bien == true && bien2 == true) {
		if (arrParaAnalizarLaInstruccion.length == 3) {
			for (let i = 1; i < arrParaAnalizarLaInstruccion.length; i++) {
				if (arrParaAnalizarLaInstruccion[i].length > 2 && contarCaracterCadena(arrParaAnalizarLaInstruccion[i], 'r') > 0) {
					imprimirError(errores["registro"][3]);
					break;
				}
			}
			instruccionDeDosElementos(arrParaAnalizarLaInstruccion[0], arrParaAnalizarLaInstruccion[1], arrParaAnalizarLaInstruccion[2], arrParaAnalizarLaInstruccion);
		} else if (arrParaAnalizarLaInstruccion.length == 4) {
			for (let j = 1; j < arrParaAnalizarLaInstruccion.length; j++) {
				if (arrParaAnalizarLaInstruccion[j].length > 2 && contarCaracterCadena(arrParaAnalizarLaInstruccion[j], 'r') > 0) {
					imprimirError(errores["registro"][3]);
					break;
				}
			}
			instruccionDeTresElementos(arrParaAnalizarLaInstruccion[0], arrParaAnalizarLaInstruccion[1], arrParaAnalizarLaInstruccion[2], arrParaAnalizarLaInstruccion[3], arrParaAnalizarLaInstruccion);
		} else {
			imprimirError(errores["desconocido"][1]);
		}
	}

}

var arregloFinal = [];
function existeUnaComa(arregloDeUnaComa, ins) { //rX,rY -- rXY,rZ -- rZ,rXY -- rXY,rZZ -- rX,#A -- rX,#AB.. -- rXY,#AB...
	if (arregloDeUnaComa[2] == ',') { //rX,rY -- rz,rXY -- rX,#A -- rX,#AB
		arregloFinal = borrarElemento(arregloDeUnaComa, ',');
		console.log(arregloDeUnaComa);
		console.log(arregloFinal);
		// instruccionCorrespondiente(ins, arregloFinal);
	} else if (arregloDeUnaComa[3] == ',') { //rXY,rZ -- rXY,rZZ
		arregloFinal = borrarElemento(arregloDeUnaComa, ',');
		console.log(arregloDeUnaComa);
		console.log(arregloFinal);
		// instruccionCorrespondiente(ins, arregloDeUnaComa);
	} else {
		imprimirError(errores["sintaxis"][1]);
	}
	// console.log(arregloDeUnaComa);
	console.log(arregloFinal);
	return arregloFinal;
}

var arregloFinalDosComas = [];
function existenDosComas(arregloDeDosComas, ins) {
	if (arregloDeDosComas[2] == ',' && arregloDeDosComas[5] == ',') {
		arregloFinalDosComas = borrarElemento(arregloDeDosComas, ',');
		instruccionCorrespondiente(ins, arregloFinalDosComas);
	} else {
		imprimirError(errores["sintaxis"][1]);
	}
	// console.log(arregloDeDosComas);
	console.log(arregloFinalDosComas);
	return arregloFinalDosComas;
}

function borrarElementoCadena(cadena, elemento) {
	return cadena.split(elemento).join('');
}

function imprimirError(error) {
	contadorErrores++;
	if (error == errores["ejecucion"][1]) {
		// console.log("Error: " + error);
		// alert("Error: " + error);
		mostrarError("Error: " + error);
		mostrarEnMensajesErrorE1();
		// return false;
	} else {
		// alert("Error: " + error + " en la línea " + (contadorLineas + 1));
		mostrarError("Error: " + error + " en la línea " + (contadorLineas + 1));
		mostrarEnMensajesError();
		// return false;
	}
}

var nuevoArregloFinal = [];
function instruccionCorrespondiente(instruccion, arreglo) {
	let variable = unirRegistros(arreglo);
	if (variable.length == 2) {
		nuevoArregloFinal.push(instruccion, variable[0], variable[1]);
		instruccionDeDosElementos(instruccion, variable[0], variable[1], nuevoArregloFinal);
	} else if (variable.length == 3) {
		nuevoArregloFinal.push(instruccion, variable[0], variable[1], variable[2]);
		instruccionDeTresElementos(instruccion, variable[0], variable[1], variable[2], nuevoArregloFinal);
	} else {
		imprimirError(errores["desconocido"][1]);
	}
}

var arregloUnirRegistros = [];
function unirRegistros(arregloDesordenado) { //r-X-Y-r-Z-Z || r-X-r-Y-Z || r-A-B-r-C-D-r-E-F
	console.log(arregloDesordenado);
	let a = arregloDesordenado.join('-');
	// console.log(a);
	var cad1, cad2, cad3;
	if (a.length == 7) { //r-X-r-Y
		cad1 = borrarElementoCadena(a.slice(0, 3), '-');
		cad2 = borrarElementoCadena(a.slice(4), '-');
		arregloUnirRegistros.push(cad1);
		arregloUnirRegistros.push(cad2);
	} else if (a.length == 11) { //r-X-r-Y-r-Z || r-X-Y-r-Z-Z
		if (contarCaracter(a, 'r') == 3) {
			cad1 = borrarElementoCadena(a.slice(0, 3), '-');
			cad2 = borrarElementoCadena(a.slice(4, 7), '-');
			cad3 = borrarElementoCadena(a.slice(8), '-');
			arregloUnirRegistros.push(cad1);
			arregloUnirRegistros.push(cad2);
			arregloUnirRegistros.push(cad3);
		} else if (contarCaracter(a, 'r') == 2) {

		}
	} else if (a.length == 9) { //r-X-r-Y-Z || r-X-#-A-B || r-X-Y-r-Z

	} else {
		imprimirError(errores["desconocido"][1]);
	}
	console.log(arregloUnirRegistros);
	return arregloUnirRegistros;
}

function instruccionDeDosElementos(ins, operando1, operando2, arr) {
	//ANA arreglo = ["com", "rX", "rY"], ["com", "rX", "#Y"]
	let exe = false;
	console.log(`Ha llegado hasta aquí con la instruccion: ${ins}, los operandos: ${operando1} y ${operando2}; el arreglo actual es ${arr}`);
	// evaluarComando(arr);
	contadorLineas++;
	if (contadorLineas == textoArr.length || contadorLineas < textoArr.length) {
		console.log(contadorLineas);
		if (borrarElementoCadena(textoArr[contadorLineas], ' ') == 'stop:wfi') {
			evaluarComando(arr);
			console.log("Final de la ejecución");
		} else {
			evaluarComando(arr);
			vaciarArreglos();
			console.log("Siguiente línea");
			ejecutarSiguienteInstruccion(contadorLineas);
		}
	}

}

function instruccionDeTresElementos(ins, operando1, operando2, operando3, arr) {
	//GERARDO ["com", "rX", "rY", "rZ"]
	console.log(arr);
	console.log(`Ha llegado hasta aquí con la instruccion: ${ins}, los operandos: ${operando1}, ${operando2} y ${operando3}; el arreglo actual es ${arr}`);
	contadorLineas++;
	if (contadorLineas == textoArr.length || contadorLineas < textoArr.length) {
		console.log(contadorLineas);
		if (borrarElementoCadena(textoArr[contadorLineas], ' ') == 'stop:wfi') {
			evaluarComando(arr);
			console.log("Final de la ejecución");
		} else {
			evaluarComando(arr);
			vaciarArreglos();
			console.log("Siguiente línea");
			ejecutarSiguienteInstruccion(contadorLineas);
		}
	}
}


//INICIO DE FUNCIONAMIENTO DE COMANDOS


//FIN DE FUNCIONAMIENTO DE COMANDOS

function evaluarComando(arrComando) {
	switch (arrComando[0]) { //"ldr", "str", "mov", "add", "sub", "mul", "and", "not", "xor", "Neg"
		case "ldr":
			break;
		case "str":
			break;
		case "mov":
			if (arrComando.length == 3) {
				if (arrComando[2].charAt(0) == 'r') {
					movCon2Registros(arrComando[1], arrComando[2]); //["mov", "rX", "rY"] //ANA
				} else {
					movCon1RegistroY1DatoInmediato(arrComando[1], arrComando[2]); //ANA
				}
			}
			break;
		case "add":
			if (arrComando.length == 3) { //Si es una instrucción y 2 operandos 
				if (arrComando[2].charAt(0) == 'r') {
					addCon2Registros(arrComando[1], arrComando[2]); //add rX, rY //ANA
				} else {
					addCon1RegistroY1DatoInmediato(arrComando[1], arrComando[2]); //add rX, #Y //ÁNGEL copia
				}
			} else { //Una instrucción, 2 registros y 1 dato inmediato
				if (arrComando[3].charAt(0) == 'r') { //add rX, rY, rZ (o add rX, rX, rY -- o add rX, rY, rY) //ÁNGEL copia
					addCon3Registros(arrComando[1], arrComando[2], arrComando[3]);
				} else { //add rX, rY, #Z
					addCon2RegistrosY1DatoInmediato(arrComando[1], arrComando[2], arrComando[3]); //ÁNGEL copia
				}
			}
			break;
		case "sub":
			if (arrComando.length == 3) { //Si es una instrucción y 2 operandos 
				if (arrComando[2].charAt(0) == 'r') { //sub rX, rY
					subCon2Registros(arrComando[1], arrComando[2]); //GABRIELA
				} else {
					subCon1RegistroY1DatoInmediato(arrComando[1], arrComando[2]); //sub rX, #Y //GABRIELA
				}
			} else { //Una instrucción, 2 registros y 1 dato inmediato
				if (arrComando[3].charAt(0) == 'r') {  //sub rX, rY, rZ (o sub rX, rX, rY) se evaluará en esta función       
					subCon3Registros(arrComando[1], arrComando[2], arrComando[3]); //GABRIELA
				} else { //sub rX, rY, #Z (o sub rX, rX, #Y)
					subCon2RegistrosY1DatoInmediato(arrComando[1], arrComando[2], arrComando[3]); //GERARDO
				}
			}
			break;
		case "mul": //mul rX, rY -- mul rX, rY, rX -- mul rX, rX, rY
			if (arrComandos.length == 3) { //mul rX, rY
				mulCon2Registros(arrComando[1], arrComando[2]); //GERARDO //En esta función (OJO)-->*TAMBIÉN*<--(OJO) se evaluarán errores	
			} else {
				mulCon3Registros(arrComando[1], arrComando[2], arrComando[3]); //GERARDO
			}
			break;
		case "and":
			and(arrComando[1], arrComando[2]); //JONATHAN
			break;
		case "mvn": //not
			not(arrComando[1], arrComando[2]); //JONATHAN
			break;
		case "eor": //xor
			eor(arrComando[1], arrComando[2]); //JONATHAN
			break;
		case "orr":
			orr(arrComando[1], arrComando[2]); //WALTER
			break;
		case "Neg":
			neg(arrComando[1], arrComando[2]); //WALTER
			break;
	}
}

function borrarElemento(arr, elemento) {//función que borra un elemento de un arreglo, 
	return arr.filter(function (e) {
		return e !== elemento;
	});
}

function aBinario(num) {
	return num.toString(2);
}

function aHexadecimal(num) {
	return num.toString(16);
}

function aDecimal(num) {
	return num.toString(10);
}

function contarCaracter(arr, char) { //cuenta cuantas veces se repite un caracter en un arreglo,
	let caracter = 0;						//recibe el arreglo y el caracter a contar
	for (let i = 0; i < arr.length; i++) {
		if (arr[i] == char) {
			caracter++;
		}
	}

	console.log(`El caracter ${char} en la cadena se repite ${caracter} veces`);
	return caracter;
}

function contarCaracterCadena(cad, char) {
	let caracter = 0;
	for (let i = 0; i < cad.length; i++) {
		if (cad.charAt(i) == char) {
			caracter++;
		}
	}

	return caracter;
}

function vaciarArreglos() {
	arrParaAnalizarLaInstruccion.length = 0;
	nuevoStr.length = 0;
	arregloFinal.length = 0;
	arregloFinalDosComas.length = 0;
	nuevoArregloFinal.length = 0;
	arregloUnirRegistros.length = 0;
}

var cont = 0;
function generarRAM() {

	for (let i = 0; i < RAM.length; i++) {
		if (i <= 16) {
			if (cont == 0) {
				document.getElementById('espacio1').innerHTML = `<td>0x20070000</td>`
				cont = 1;
			} else {
				document.getElementById('espacio1').innerHTML += `<td style="padding:10px">${RAM[i].contenido}</td>`
			}
		} else {
			if (i > 15 && i <= 33) {
				if (cont == 1) {
					document.getElementById('espacio2').innerHTML = `<td>0x20070010</td>`
					cont = 2;
				} else {
					document.getElementById('espacio2').innerHTML += `<td style="padding:10px">${RAM[i].contenido}</td>`
				}

			} else {
				if (cont == 2) {
					document.getElementById('espacio3').innerHTML = `<td>0x20070020</td>`
					cont = 3;
				} else {
					document.getElementById('espacio3').innerHTML += `<td style="padding:10px">${RAM[i].contenido}</td>`
				}
			}
		}
	}
	for (let j = 0; j < 11; j++) {
		document.getElementById('espacio3').innerHTML += `<td style="padding:10px; color:#878787">00</td>`
	}


} generarRAM();

function generarRegistros() {
	document.getElementById('registros').innerHTML = '';
	for (let j = 0; j < registros.length; j++) {
		document.getElementById('registros').innerHTML += `<tr>
		 <td>${registros[j].nombre}</td>
		 <td>${registros[j].contenido}</td></tr>`
	}
} generarRegistros();

function mostrarEnMensajesErrorE1() {
	var errorE1;
	for (errorE1 = 0; errorE1 < textoArr.length; errorE1++) {
		document.getElementById('errores').innerHTML += `
			<p>${errorE1 + 1} ->  ${textoArr[errorE1]}</p>
		`;
	}
	document.getElementById('errores').innerHTML += `
		<p style="color: red">${errorE1 + 1} ->  stop: wfi</p>
	`;
}

function mostrarEnMensajesError() {
	var errorNormal;
	for (errorNormal = 0; errorNormal < textoArr.length; errorNormal++) {
		if (errorNormal != contadorLineas) {
			document.getElementById('errores').innerHTML += `
				<p>${errorNormal + 1} ->  ${textoArr[errorNormal]}</p>
			`;
		} else {
			document.getElementById('errores').innerHTML += `
				<p style="color: red">${errorNormal + 1} ->  ${textoArr[errorNormal]}</p>
			`;
		}
	}
}

/**************************************************************funciones Gabriela*******************************/
//suponiendo que se recibe [sub, rx,ry] 0 [sub,rx,rx]
function subCon2Registros(registro1, registro2) {  //error
	/*identificar el registro para extraer el operando
	  MODO DE DIRECCIONAMIENTO DE rx y ry : directo a registro*/
	//buscando el registro
	let reg1 = parseInt(registro1.charAt(1));
	let reg2 = parseInt(registro2.charAt(1));
	//realizar que sean registros a los que el usuario pueda acceder
	if (reg1 >= 8) {
		imprimirError(errores["registro"][3] + registro1);
	} else {
		if (reg2 >= 8) {
			imprimirError(errores["registro"][3] + registro2);
		} else {
			//necesitamos extraer el operando
			let operando1 = "";
			let operando2 = ""
			let resultado;
			//extraer el contenido
			for (let i = 2; i <= 9; i++) {
				operando1 += registros[reg1].contenido.charAt(i);
				operando2 += registros[reg2].contenido.charAt(i);
			}
			//realizar la operacion
			operando1 = parseInt(operando1);
			operando2 = parseInt(operando2);
			resultado = operando1 - operando2;
			resultado = resultado.toString(16); //convirtiendo a hexadecimal

			//preparando resultado
			let cantidadBytesResult = resultado.length;
			let bytesAdd = (8 - cantidadBytesResult);
			let ceros = ""
			for (let i = 0; i < bytesAdd; i++) {
				ceros += "0"
			}
			console.log("0x" + ceros + resultado)
			//almacenar el resultado en los registros
			registros[reg1].contenido = resultado;
			console.log(registros)


		}
	}

}


function subCon1RegistroY1DatoInmediato(rx, offet) {
	//el dato inmedito debe ser de 8 bits
	let reg = parseInt(rx.charAt(1));
	let offet8 = parseInt(offet.charAt(1));
	//realizar que sean registros a los que el usuario pueda acceder
	if (reg >= 8) {
		imprimirError(errores["registro"][3] + reg);
	} else {
		if (offet8 > 255) {
			imprimirError(errores["espacio"][5]);
		} else {
			let operando1 = ""; //registro
			let resultado;
			//extraer el contenido
			for (let i = 2; i <= 9; i++) {
				operando1 += registros[reg].contenido.charAt(i);
			}
			operando1 = parseInt(operando1);
			resultado = operando1 - offet8;
			if (resultado < 0) { //aplicar complemento a2 con k=32 bits
				resultado = Ca2(resultado);
				registros[reg].contenido = resultado;
			} else {
				resultado = resultado.toString(32); //convirtiendo a hexadecimal
				//preparando resultado
				let cantidadBytesResult2 = resultado.length;
				let bytesAdd = (8 - cantidadBytesResult2);
				let ceros = ""
				for (let i = 0; i < bytesAdd; i++) {
					ceros += "0"
				}
				console.log("0x" + ceros + resultado)
				resultado = "0x" + ceros + resultado
				console.log(registros[registros[reg].contenido])
				//almacenar el resultado en los registros
				registros[reg].contenido = resultado;

			}

		}
		generarRegistros()
	}

}

//Esta funcion es para invertir el orden de una cadena
String.prototype.reverse = function () {
	var x = this.length;
	var cadena = "";
	while (x >= 0) {
		cadena = cadena + this.charAt(x);
		x--;
	}
	return cadena;

};

//Si un resultado de una operacion es negativo,se lo envian a esta funcion y ella lo convertira a Ca2
//retorna el Ca2 del numero negativo expresado en hexadecimal con k=32
function Ca2(resultado) { //solo recbe datos de 8 bits
	resultado = Math.abs(resultado);
	resultado = resultado.toString(2);
	//expresar en 32bits
	let cantidadBytesResult = resultado.length;
	let cerosADD = (8 - cantidadBytesResult);
	let ceros = ""
	for (let i = 0; i < cerosADD; i++) {
		ceros += "0"
	}
	resultado = ceros + resultado;
	console.log("paso1", resultado)
	resultadoinvertido = ""
	for (let i = 0; i < resultado.length; i++) {
		if (resultado.charAt(i) == '0') {
			resultadoinvertido += '1';
		} else {
			resultadoinvertido += '0';
		}
	}
	let id = 0;
	resultado = resultadoinvertido; //el sesultado ya esta invertido
	console.log("paso2", resultado);
	//sumarle un bit
	let suma = "";
	let bitAcarreo = '0';
	let iteracion = 0;
	for (let i = 0; i < resultado.length + 1; i++) {
		id = resultado.length - iteracion;
		console.log(id)
		if (i == 0) {
			if (resultado.charAt(id) == '1') {
				bitAcarreo = '1';
				suma += '0'
			} else {
				if (resultado.charAt(id) == '0') {
					bitAcarreo = '0';
					suma += '1'
				}
			}
		} else {
			if (resultado.charAt(id) == '1' && bitAcarreo == '1') {
				bitAcarreo = '1';
				suma += '0'
			} else {
				if (resultado.charAt(id) == '1' && bitAcarreo == '0') {
					suma += '1';
					bitAcarreo = '0';
				} else {
					if (resultado.charAt(id) == '0' && bitAcarreo == '1') {
						suma += '1'
						bitAcarreo = '0';
					} else {
						if (resultado.charAt(id) == '0' && bitAcarreo == '0') {
							suma += '0'
							bitAcarreo = '0'
						}

					}
				}
			}
		}

		iteracion++

	}

	console.log("la suma es:", suma.reverse());
	if (suma.length > 8) {
		imprimirError(errores["espacio"][6]);
	}
	//expresarlo en hexadecimal
	//pasarlo a k=32
	let cantidadBit1Ca2 = suma.length;
	let bitAdd1Ca2 = (32 - cantidadBit1Ca2);
	let unos = ""
	for (let i = 0; i < bitAdd1Ca2; i++) {
		unos += "1"
	}

	let result = unos + suma.reverse()
	console.log(result)
	//suma es el resultado en Ca2
	result = parseInt(result, 2)
	hexString = result.toString(16);
	hexString = hexString.toUpperCase()
	return "0x" + hexString;
	//suma de binarios

}



//para mostrar un error solo llamen a esta funcion y le envian el mensaje
function mostrarError(mensaje) {
	document.getElementById('error').innerHTML = mensaje;
	$('#modal-error').modal('show');
}

/***************************FIN funciones Gabriela *************************************/

/************************************funciones Gerardo*****************************************/
function subCon2RegistrosY1DatoInmediato(registro1, registro2, inm) {
	// let reg1 = parseInt(registro1.charAt(1));
	// let reg2 = parseInt(registro2.charAt(1));
	// let inm8 = parseInt(inm.charAt(1));

	let reg1 = parseInt(borrarElementoCadena(registro1, 'r'));
	let reg2 = parseInt(borrarElementoCadena(registro2, 'r'));
	let inm8 = parseInt(borrarElementoCadena(inm, '#'));

	if (reg1 >= 8) {
		imprimirError(errores["registro"][3] + registro1);
	} else {
		if (reg2 >= 8) {
			imprimirError(errores["registro"][3] + registro2);
		} else {
			if (inm8 >= 255) {
				imprimirError(errores["espacio"][5]);

			} else {
				if (registro1 == registro2) { //Caso sub rX, rX, #Y
					subCon1RegistroY1DatoInmediato(registro1, inm);
				} else {
					let operando2 = ""
					let resultado;
					//extraer el contenido del registro
					for (let i = 2; i <= 9; i++) {
						operando2 += registros[reg2].contenido.charAt(i);
					}

					operando2 = parseInt(operando2);
					resultado = operando2 - inm8;

					if (resultado < 0) { //aplicar complemento a2 con k=32 bits
						resultado = Ca2(resultado);
						registros[reg1].contenido = resultado;
					} else {
						resultado = resultado.toString(16); //convirtiendo a hexadecimal
						//preparando resultado
						let cantidadBytesResult2 = resultado.length;
						let bytesAdd = (8 - cantidadBytesResult2);
						let ceros = "";
						for (let i = 0; i < bytesAdd; i++) {
							ceros += "0";
						}
						console.log("0x" + ceros + resultado);
						resultado = "0x" + ceros + resultado;
						console.log(registros[registros[reg1].contenido]);
						//almacenar el resultado en los registros
						registros[reg1].contenido = resultado;
					}
				}
			}
		}
	}
}
/************************************FIN funciones Gerardo*****************************************/
