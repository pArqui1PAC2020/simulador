//Ángel 22/05/2020-14:57

/**************************************************************************************/
//DEFINIENDO CLASES
const comandos = ["ldr", "mov", "str", "add", "sub", "mul", "and", "not", "xor", "Neg"];
const errores = {
	comando: {
		1: "El comando que ingresó es desconocido"
	},
	espacio: {
		1: "Está tratando un espacio de memoria innaccesible",
		2: "Error de almacenamiento",
		3: "Error de carga",
		4: "El dato inmediato es inválido"
	},
	registro: {
		1: "Muchos registros para esa instrucción",
		2: "Dicha instrucción requiere de más registros"
	},
	sintaxis: {
		1: "Mala sintaxis al momento de usar los registros"
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

//Es la primera función que se ejecuta al momento de dar clic el botón Ejecutar de index.html
function ejecutar(){
	let j = 0;
	var contadorLineas = 0;
	var textoArr = [];
	var texto = document.getElementById('area-de-codigo');
	console.log(texto.value);
	textoArr = texto.value.split('\n'); //guarda en el arreglo textoArr todas las palabras separadas por un salto de línea
	for(let i = 0; i < textoArr.length; i++){		/** recorre el arreglo para encontrar espacios en blanco y borrarlos*/
		if(textoArr[i] == ""){
			borrarElemento(textoArr, textoArr[i]); //Borra todos los espacios en blanco del arreglo
		}
	}

	while(j < textoArr.length){ //con los espacios en blanco borrados, va recorriendo línea por línea para analizar el código
		if(analizar(textoArr[j]) == true){ //función que analizar cada elemento del arreglo
			j ++; //Si todo está bien, se pasa a la siguiente línea
		}else{
			//Instrucciones que van a analizar el tipo de error
		}
	}
	console.log(textoArr);
}

function analizar(instruccion){
	let i = 0;
	var bien = false;
	let arrParaAnalizarLaInstruccion = [];
	let arrParaAnalizarLosRegistros = [];
	var nuevoStr = [];
	arrParaAnalizarLaInstruccion = instruccion.split(' '); //Separo cada instrucción en espacios y guardo cada elemento en un arreglo
	while(i < comandos.length){
		if(arrParaAnalizarLaInstruccion[0] == comandos[i]){ //comparo ese primer elemento con las instrucciones que ya están guardadas en comandos
			bien = true;
			for(let j = 4; j < instruccion.length; j++){
				nuevoStr.push(instruccion.charAt(j));
			}
			break;
		}else{
			i++;
		}
	}
	if(bien == true){
		if(contarCaracter(nuevoStr, ',') == 1){
			console.log("bien");
		}else{
			console.log(errores["sintaxis"][1]);
		}
	}else{
		console.log(errores["comando"][1]);
	}
	console.log(nuevoStr);
	return bien;

}

function instruccionDeUnRegistro(ins, reg){

}

function instruccionDeDosRegistros(ins, reg1, reg2){

}

function instruccionDeTresRegistros(ins, reg1, reg2, reg3){

}


function borrarElemento(arr, elemento){ //función que borra un elemento de un arreglo, 
	var j = arr.indexOf(elemento);		//recibe el arrelgo y el elemento que se quiere borrar, respectivamente
	arr.splice(j, 1);

	return arr;								
}

function contarCaracter(arr, char){ //cuenta cuantas veces se repite un caracter en un arreglo,
	let caracter = 0;						//recibe el arreglo y el caracter a contar
	for(let i = 0; i < arr.length; i++){
		if(arr[i] == char){
			caracter++;
		}
	}

	console.log(`El caracter ${char} en la cadena se repite ${caracter} veces`);
	return caracter;
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
	document.getElementById('registros').innerHTML = "";
	for (let j = 0; j < registros.length; j++) {
		document.getElementById('registros').innerHTML += `<tr>
		 <td>${registros[j].nombre}</td>
		 <td>${registros[j].contenido}</td></tr>`
	}
} generarRegistros();
