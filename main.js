/**************************************************************************************/
//DEFINIENDO CLASES
const comandos = ["ldr", "mov", "str", "add", "sub", "mul", "and", "not", "xor", "Neg"];
const errores = {
	comandoDesconocido: {
		1: "El comando que ingresó es desconocido"
	},
	espacioDenegado: {
		1: "Está tratando un espacio de memoria innaccesible",
		2: "Error de almacenamiento",
		3: "Error de carga",
		4: "El dato inmediato es inválido"
	},
	muchosRegistros: {
		1: "Muchos registros para esa instrucción",
		2: "Dicha instrucción requiere de más registros"
	}
};

class Registro {
	constructor(nombre, contenido) {
		this.nombre = nombre;
		this.contenido = contenido;
	}

	getRegistro(){
		return this.nombre;
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
	document.getElementById('registros').innerHTML = "";
	for (let j = 0; j < registros.length; j++) {
		document.getElementById('registros').innerHTML += `<tr>
		 <td>${registros[j].nombre}</td>
		 <td>${registros[j].contenido}</td></tr>`
	}
} generarRegistros();