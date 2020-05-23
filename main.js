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
		4: "El dato inmediato es inválido"
	},
	registro: {
		1: "Muchos registros para esa instrucción",
		2: "Dicha instrucción requiere de más registros"
	},
	sintaxis: {
		1: "Mala sintaxis al momento de usar los registros"
	},
	desconocido: {
		1: "Error desconocido"
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

//Es la primera función que se ejecuta al momento de dar clic el botón Ejecutar de index.html
function ejecutar(){
	// document.getElementById('area-de-codigo').value = null;
	inicializar_registros();
	inicializar_RAM();
	let estado;
	let j = 0; //Línea actual
	var textoArr = [];
	var texto = document.getElementById('area-de-codigo');
	console.log(texto.value);
	if(contarCaracterCadena(texto.value, '\n') == 0){
		textoArr.push(texto.value);
	}else{
		textoArr = texto.value.split('\n'); 
	}											//guarda en el arreglo textoArr todas las palabras separadas por un salto de línea
	console.log(textoArr);
	for(let i = 0; i < textoArr.length; i++){		/** recorre el arreglo para encontrar espacios en blanco y borrarlos*/
		if(textoArr[i] == ""){
			textoArr = borrarElemento(textoArr, textoArr[i]); //Borra todos los espacios en blanco del arreglo
		}
	}
	console.log(textoArr);
	while(contadorLineas < textoArr.length){
		estado = existenciaDeInstruccion(textoArr[contadorLineas]); //con los espacios en blanco borrados, va recorriendo línea por línea para analizar el código
		if(estado == true){ //función que analiza cada elemento del arreglo
			contadorLineas++; //Si todo está bien, se pasa a la siguiente línea
		}else if(estado == "s1"){
			imprimirError(errores["sintaxis"][1]);
			contadorLineas = textoArr.length;    
		}else if(estado == "c1"){
			imprimirError(errores["comando"][1]);
			contadorLineas = textoArr.length;
		}else{
			imprimirError(errores["desconocido"][1]);
			contadorLineas = textoArr.length;
		}
	}
}

function existenciaDeInstruccion(instruccion){ //instrucción = "mov r0, r1"
	let i = 0;
	var bien = false;
	let arrParaAnalizarLaInstruccion = [];
	let arrParaAnalizarLosRegistros = [];
	var nuevoStr = []; //["r", "0", ",", "", "r", "1"]
	arrParaAnalizarLaInstruccion = instruccion.split(' '); //["mov", "r0,", "r1"] Separo cada instrucción en espacios y guardo cada elemento en un arreglo
	while(i < comandos.length){
		if(arrParaAnalizarLaInstruccion[0] == comandos[i]){ //comparo ese primer elemento con las instrucciones que ya están guardadas en comandos
			bien = true;
			for(let j = 4; j < instruccion.length; j++){
				nuevoStr.push(instruccion.charAt(j));
				nuevoStr = borrarElemento(nuevoStr, " ");
			}
			break;
		}else{
			i++;
		}
	}

	if(bien == true){
		if(contarCaracter(nuevoStr, ',') == 1){
			console.log("bien"); 
			existeUnaComa(nuevoStr, arrParaAnalizarLaInstruccion[0]);//Agregar filtro para localizar posición de la coma
		}else if(contarCaracter(nuevoStr, ',') == 2){
			console.log("bien"); 
			existenDosComas(nuevoStr, arrParaAnalizarLaInstruccion[0]);//Agregar filtro para localizar posición de la coma
		}else{
			bien = "s1"; //errores["sintaxis"][1];
		}
	}else{
		bien = "c1";//errores["comando"][1]
	}
	console.log(nuevoStr);
	console.log(bien);
	return bien;

}

function existeUnaComa(arregloDeUnaComa, ins){
	let arregloFinal = [];
	if(arregloDeUnaComa[2] == ','){
		arregloFinal = borrarElemento(arregloDeUnaComa, ',');
		instruccionCorrespondiente(ins, arregloFinal);
	}else{
		imprimirError(errores["sintaxis"][1]);
	}
	// console.log(arregloDeUnaComa);
	console.log(arregloFinal);
	return arregloFinal;
}

function existenDosComas(arregloDeDosComas, ins){
	let arregloFinal = [];
	if(arregloDeDosComas[2] == ',' && arregloDeDosComas[5] == ','){
		arregloFinal = borrarElemento(arregloDeDosComas, ',');
		instruccionCorrespondiente(ins, arregloFinal);
	}else{
		imprimirError(errores["sintaxis"][1]);
	}
	// console.log(arregloDeDosComas);
	console.log(arregloFinal);
	return arregloFinal;
}

function borrarElementoCadena(cadena, elemento){
	return cadena.split(elemento).join('');
}

function imprimirError(error){
	console.log("Error: " + error + " en la línea " + (contadorLineas + 1));
}

function instruccionCorrespondiente(instruccion, arreglo){
	let nuevoArregloFinal = [];
	let variable = unirRegistros(arreglo);
	if(variable.length == 2){
		nuevoArregloFinal.push(instruccion, variable[0], variable[1]);
		instruccionDeDosElementos(instruccion, variable[0], variable[1], nuevoArregloFinal);
	}else if(variable.length == 3){
		nuevoArregloFinal.push(instruccion, variable[0], variable[1], variable[2]);
		instruccionDeTresElementos(instruccion, variable[0], variable[1], variable[2], nuevoArregloFinal);
	}else{
		imprimirError(errores["desconocido"][1]);
	}
}

function unirRegistros(arregloDesordenado){
	console.log(arregloDesordenado);
	let a = arregloDesordenado.join('-');
	// console.log(a);
	var cad1, cad2, cad3;
	let arr = [];
	if(a.length == 7){ //r-X-r-Y
		cad1 = borrarElementoCadena(a.slice(0, 3), '-');
		cad2 = borrarElementoCadena(a.slice(4), '-');
		arr.push(cad1);
		arr.push(cad2);
	}else if(a.length == 11){ //r-X-r-Y-r-Z
		cad1 = borrarElementoCadena(a.slice(0, 3), '-');
		cad2 = 	borrarElementoCadena(a.slice(4, 7), '-');
		cad3 = 	borrarElementoCadena(a.slice(8), '-');
		arr.push(cad1);
		arr.push(cad2);
		arr.push(cad3);
	}else{
		imprimirError(errores["desconocido"][1]);
	}
	console.log(arr);
	return arr;
}

function instruccionDeDosElementos(ins, operando1, operando2, arr){
	//ANA arreglo = ["com", "rX", "rY"], ["com", "rX", "#Y"]
	console.log(`Ha llegado hasta aquí con la instruccion: ${ins}, los operandos: ${operando1} y ${operando2}; el arreglo actual es ${arr}`);

}

function instruccionDeTresElementos(ins, operando1, operando2, operando3, arr){
	//GERARDO ["com", "rX", "rY", "rZ"]
	console.log(`Ha llegado hasta aquí con la instruccion: ${ins}, los operandos: ${operando1}, ${operando2} y ${operando3}; el arreglo actual es ${arr}`);
}


//INICIO DE FUNCIONAMIENTO DE COMANDOS


//FIN DE FUNCIONAMIENTO DE COMANDOS

function evaluarComando(arrComando){
	switch(arrComando[0]){ //"ldr", "str", "mov", "add", "sub", "mul", "and", "not", "xor", "Neg"
		case "ldr":
			break;
		case "str":
			break;
		case "mov":
			if(arrComando.length == 3){
				if(arrComando[2].charAt(0) == 'r'){
					movCon2Registros(arrComando[1], arrComando[2]); //["mov", "rX", "rY"] //ANA
				}else{
					movCon1RegistroY1DatoInmediato(arrComando[1], arrComando[2]); //ANA
				}
			}
			break;
		case "add":
			if(arrComando.length == 3){ //Si es una instrucción y 2 operandos 
				if(arrComando[2].charAt(0) == 'r'){
					addCon2Registros(arrComando[1], arrComando[2]); //add rX, rY //ANA
				}else{
					addCon1RegistroY1DatoInmediato(arrComando[1], arrComando[2]); //add rX, #Y //ÁNGEL copia
				}
			}else{ //Una instrucción, 2 registros y 1 dato inmediato
				if(arrComando[3].charAt(0) == 'r'){ //add rX, rY, rZ (o add rX, rX, rY -- o add rX, rY, rY) //ÁNGEL copia
					addCon3Registros(arrComando[1], arrComando[2], arrComando[3]);
				}else{ //add rX, rY, #Z
					addCon2RegistrosY1DatoInmediato(arrComando[1], arrComando[2], arrComando[3]); //ÁNGEL copia
				}
			}
			break;
		case "sub":
			if(arrComando.length == 3){ //Si es una instrucción y 2 operandos 
				if(arrComando[2].charAt(0) == 'r'){ //sub rX, rY
					subCon2Registros(arrComando[1], arrComando[2]); //GABRIELA
				}else{
					subCon1RegistroY1DatoInmediato(arrComando[1], arrComando[2]); //sub rX, #Y //GABRIELA
				}
			}else{ //Una instrucción, 2 registros y 1 dato inmediato
				if(arrComando[3].charAt(0) == 'r'){  //sub rX, rY, rZ (o sub rX, rX, rY) se evaluará en esta función       
					subCon3Registros(arrComando[1], arrComando[2], arrComando[3]); //GABRIELA
				}else{ //sub rX, rY, #Z (o sub rX, rX, #Y)
					subCon2RegistrosY1DatoInmediato(arrComando[1], arrComando[2], arrComando[3]); //GERARDO
				}
			}
			break;
		case "mul": //mul rX, rY -- mul rX, rY, rX -- mul rX, rX, rY
			if(arrComandos.length == 3){ //mul rX, rY
				mulCon2Registros(arrComando[1], arrComando[2]); //GERARDO //En esta función (OJO)-->*TAMBIÉN*<--(OJO) se evaluarán errores	
			}else{
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

function borrarElemento(arr, elemento){//función que borra un elemento de un arreglo, 
	return arr.filter( function( e ) {
		return e !== elemento;
		 });						
}

function aBinario(num){
	return num.toString(2);
}

function aHexadecimal(num){
	return num.toString(16);
}

function aDecimal(num){
	return num.toString(10);
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

function contarCaracterCadena(cad, char){
	let caracter = 0;
	for(let i = 0; i < cad.length; i++){
		if(cad.charAt(i) == char){
			caracter++;
		}
	}

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
