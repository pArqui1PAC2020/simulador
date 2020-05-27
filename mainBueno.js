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
        2: "Muchos elementos para una instrucción",
        3: "La operación lógica solo acepta trabajar con registros"
    },
    reserva: {
        1: "No existe el comando para iniciar la reserva de memoria (.data)",
        2: "Etiqueta ya existente",
        3: "No es un valor válido"
    }
};

//declarando variables y arreglos
var registros = [];
var RAM = [];

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
var inicio;
var fin;
var ejecucionn = 0;
var contadorLineas = 0;
var contadorErrores = 0;
var textoArr = [];
//Es la primera función que se ejecuta al momento de dar clic el botón Ejecutar de index.html
function ejecutar() {
    inicio = iniciando();
    ejecucionn++;
    document.getElementById('errores').innerHTML = '';
    borrarRegistros();
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
    console.log(contarCaracterCadena(texto.value, '\n'));
    for (let i = 0; i < textoArr.length; i++) {		/** recorre el arreglo para encontrar espacios en blanco y borrarlos*/
        if (textoArr[i] == "") {
            textoArr = borrarElemento(textoArr, textoArr[i]); //Borra todos los espacios en blanco del arreglo
        }
    }
    console.log(textoArr);
    if (borrarElementoCadena(textoArr[textoArr.length - 1], ' ') == 'stop:wfi') { //función que analiza cada elemento del arreglo
        existenciaDeInstruccion(textoArr[contadorLineas]); //console.log("bien"); //Si todo está bien, se pasa a la siguiente línea
    }
    else {
        imprimirError(errores["ejecucion"][1]);
    }
}

function borrarRegistros() {
    for (let i = 0; i < registros.length; i++) {
        registros[i].vaciarContenido();
    }
}

function ejecutarSiguienteInstruccion(numLinea) {
    existenciaDeInstruccion(textoArr[numLinea]);
}

var arrParaAnalizarLaInstruccion = [];
var nuevoStr = []; //["r", "0", ",", "", "r", "1"]
function existenciaDeInstruccion(instruccion) { //instrucción = "mov r0, r1" || "mov r0,     r1" || "mov r0,r1"
    let i = 0;
    let bien = false;
    let bien2 = false;
    let arrParaAnalizarLosRegistros = [];
    // if(contarCaracterCadena(instruccion, ' ') > 0)
    // 	arrParaAnalizarLaInstruccion = instruccion.split(' '); //["mov", "r0,", "r1"] Separo cada instrucción en espacios y guardo cada elemento en un arreglo
    // else
    // 	arrParaAnalizarLaInstruccion = instruccion;

    if (contarCaracterCadena(instruccion, ' ') == 1) { //mov r0,r1
        instruccion.replace(',', ' ');
        arrParaAnalizarLaInstruccion = instruccion.split(' ');
        console.log(arrParaAnalizarLaInstruccion);
    } else if (contarCaracterCadena(instruccion, ' ') == 2) { //ins r0, r1
        arrParaAnalizarLaInstruccion = instruccion.split(' ');
        console.log(arrParaAnalizarLaInstruccion);
    } else if (contarCaracterCadena(instruccion, ' ') > 2) {
        arrParaAnalizarLaInstruccion = borrarElemento(instruccion.split(' '), '');
        console.log(arrParaAnalizarLaInstruccion);
    } else {
        imprimirError(errores["desconocido"][1]);
    }


    while (i < comandos.length) {
        if (arrParaAnalizarLaInstruccion[0] == comandos[i]) { //comparo ese primer elemento con las instrucciones que ya están guardadas en comandos
            bien = true;
            if (arrParaAnalizarLaInstruccion.length == 3 && contarCaracterCadena(arrParaAnalizarLaInstruccion[1], ',') == 1 && contarCaracterCadena(arrParaAnalizarLaInstruccion[1], 'r') == 1 && contarCaracterCadena(arrParaAnalizarLaInstruccion[1], '#') < 1 && contarCaracterCadena(arrParaAnalizarLaInstruccion[2], ',') < 1 && contarCaracterCadena(arrParaAnalizarLaInstruccion[2], '*') == 0) { //["ins", "r0,", "r1"] || ["ins", "r0,", "#A..."]
                arrParaAnalizarLaInstruccion[1] = borrarElementoCadena(arrParaAnalizarLaInstruccion[1], ',');
                bien2 = true;
            } else if (arrParaAnalizarLaInstruccion.length == 4 && contarCaracterCadena(arrParaAnalizarLaInstruccion[1], ',') == 1 && contarCaracterCadena(arrParaAnalizarLaInstruccion[1], 'r') == 1 && contarCaracterCadena(arrParaAnalizarLaInstruccion[1], '#') < 1 && contarCaracterCadena(arrParaAnalizarLaInstruccion[2], ',') == 1 && contarCaracterCadena(arrParaAnalizarLaInstruccion[3], ',') < 1) { //["ins", "r...,", "r...,", "r..."]
                arrParaAnalizarLaInstruccion[1] = borrarElementoCadena(arrParaAnalizarLaInstruccion[1], ',');
                arrParaAnalizarLaInstruccion[2] = borrarElementoCadena(arrParaAnalizarLaInstruccion[2], ',');
                bien2 = true;
            } else if (arrParaAnalizarLaInstruccion.length > 4) {
                imprimirError(errores["ejecucion"][2]);
            } else if (arrParaAnalizarLaInstruccion.length == 2 && arrParaAnalizarLaInstruccion[1].charAt(2) == ',' && arrParaAnalizarLaInstruccion[1].charAt(5) != ',' && contarCaracterCadena(arrParaAnalizarLaInstruccion[1], '*') == 0) {
                let temp1 = ''; //temp1 = "r0,r1"
                let temp2 = '';
                temp1 = arrParaAnalizarLaInstruccion[1];
                arrParaAnalizarLaInstruccion.splice(1, 1);
                temp2 = temp1.slice(3);
                temp1 = temp1.slice(0, 3);
                arrParaAnalizarLaInstruccion.push(temp1);
                arrParaAnalizarLaInstruccion.push(temp2);
                arrParaAnalizarLaInstruccion[1] = borrarElementoCadena(arrParaAnalizarLaInstruccion[1], ',');
                console.log(arrParaAnalizarLaInstruccion);
                bien2 = true;
            } else if (arrParaAnalizarLaInstruccion.length == 2 && arrParaAnalizarLaInstruccion[1].charAt(2) == ',' && arrParaAnalizarLaInstruccion[1].charAt(5) == ',') {
                let t1, t2, t3 = '';
                t1 = arrParaAnalizarLaInstruccion[1];
                arrParaAnalizarLaInstruccion.splice(1, 1);
                t3 = t1.slice(6);
                t2 = t1.slice(3, 6);
                t1 = t1.slice(0, 3);
                arrParaAnalizarLaInstruccion.push(t1, t2, t3);
                arrParaAnalizarLaInstruccion[1] = borrarElementoCadena(arrParaAnalizarLaInstruccion[1], ',');
                arrParaAnalizarLaInstruccion[2] = borrarElementoCadena(arrParaAnalizarLaInstruccion[2], ',');
                bien2 = true;
            } else if (contarCaracterCadena(arrParaAnalizarLaInstruccion[1], '*') == 1 || contarCaracterCadena(arrParaAnalizarLaInstruccion[2], '*') == 1) { //"ldr rX, *rY"
                if (arrParaAnalizarLaInstruccion.length == 2 && contarCaracterCadena(arrParaAnalizarLaInstruccion[1], '*') == 1 && arrParaAnalizarLaInstruccion[1].charAt(2) == ',') { //ldr rX,*rY --> [ldr, rX, rY]
                    let tt, ttt = '';
                    tt = arrParaAnalizarLaInstruccion[1]; //rX,*rY
                    arrParaAnalizarLaInstruccion.splice(1, 1);
                    ttt = tt.slice(4);
                    tt = tt.slice(0, 3);
                    arrParaAnalizarLaInstruccion.push(tt, ttt);
                    arrParaAnalizarLaInstruccion[1] = borrarElementoCadena(arrParaAnalizarLaInstruccion[1], ',');
                    console.log(arrParaAnalizarLaInstruccion); //["ldr", "rX", "rY"]
                    bien2 = true;
                } else if (arrParaAnalizarLaInstruccion.length == 3 && arrParaAnalizarLaInstruccion[1].charAt(2) == ',' && contarCaracterCadena(arrParaAnalizarLaInstruccion[2], '*') == 1 && arrParaAnalizarLaInstruccion[2].charAt(0) == '*') { //["ldr", "rX,", "*rY"]
                    let hola, holaa = '';
                    arrParaAnalizarLaInstruccion[1] = borrarElementoCadena(arrParaAnalizarLaInstruccion[1], ',');
                    arrParaAnalizarLaInstruccion[2] = borrarElementoCadena(arrParaAnalizarLaInstruccion[2], '*');
                    bien2 = true;
                    // console.log(arrParaAnalizarLaInstruccion); //["ldr", "rX", "rY"]
                } else {
                    imprimirError(errores["sintaxis"][1]);
                }
                // console.log(arrParaAnalizarLaInstruccion);
            } else {
                imprimirError(errores["sintaxis"][1]);
            }
            break;
        } else {
            i++;
        }
    }

    if (bien == true && bien2 == true) {
        analisisFinal(bien, bien2);
    } else if ((i == comandos - 1) && bien == false && bien2 == false) {
        imprimirError(errores["comando"][1]);
    } else {
        imprimirError(errores["desconocido"][1]);
    }

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

function quitarComa(array) {
    let askdj = [];

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
            if (arrComando[1].charAt(0) == 'r' && arrComando[2].charAt(0) == 'r') {
                ldrGuardarDesdeRAM(arrComando[1], arrComando[2]);
            }
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
            if (arrComando.length == 3) { //mul rX, rY
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

function mostrarEnMensajesErrorE1() {
    // if (contadorLineas == textoArr.length - 1) {
        var errorE1;
        for (errorE1 = 0; errorE1 < textoArr.length; errorE1++) {
            document.getElementById('errores').innerHTML += `
				<p>${errorE1 + 1} ->  ${textoArr[errorE1]}</p>
			`;
        }
        document.getElementById('errores').innerHTML += `
			<p style="color: red">${errorE1 + 1} ->  stop: wfi</p>
		`;
    // }
}

function mostrarEnMensajesError() {
    // if (contadorLineas == textoArr.length - 1) {
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
    // }
}

function mostrarEnMensajesExito(inicio, fin) {
    if (contadorLineas == textoArr.length - 1) {
        for (let i = 0; i < textoArr.length; i++) {
            document.getElementById('errores').innerHTML += `
					<p>${i + 1} ->  ${textoArr[i]}</p>
				`;

        }
        if ((fin - inicio) < 10) {
            document.getElementById('errores').innerHTML += `
					<p>Codigo ejecutado con exito en 0.00${fin - inicio} segundos</p>
				`;
        } else if ((fin - inicio) > 9 && (fin - inicio) < 100) {
            document.getElementById('errores').innerHTML += `
					<p>Codigo ejecutado con exito en 0.0${fin - inicio} segundos</p>
				`;
        } else if ((fin - inicio) > 99 && (fin - inicio) < 1000) {
            document.getElementById('errores').innerHTML += `
					<p>Codigo ejecutado con exito en 0.${fin - inicio} segundos</p>
				`;
        } else {
            document.getElementById('errores').innerHTML += `
					<p>Codigo ejecutado con exito en ${fin - inicio} segundos</p>
				`;
        }
    }
}



/********************************************FUNCIONES GABRIELA CON CORRECCIONES**********************************************/

class Registro {
    constructor(nombre, contenido, contenidoCa2) {
        this.nombre = nombre;
        this.contenido = contenido;
        this.contenidoCa2 = contenidoCa2;
    }
    getNombre() {
        return this.nombre;
    }
    getContenido() {
        return this.contenido;
    }
    getContenidoCa2() {
        return this.contenido;
    }
    getContDecimal() {
        let decimal = '';
        let binario = String(this.contenido);
        binario = binario.substr(2);
        decimal = parseInt(binario, 2);
        return decimal;
    }

    vaciarContenido() {
        return this.contenido = '0x00000000';
    }

    getContenidoCa2() {
        return this.contenidoCa2;
    }

    setContenidoCa2(xca2) {
        this.contenidoCa2 = '';
        this.contenidoCa2 = xca2;
    }

    setContenido(newCont) {
        this.contenido = '';
        this.contenido = newCont;
    }
}


class Byte {
    constructor(dir_memoria, contenido) {
        this.dir_memoria = dir_memoria;
        this.contenido = contenido;
    }
}

function inicializar_registros() {
    //declarar un arreglo con los registros inicializandolos en 0

    var inicio = 0000000;
    var inicioHexa = inicio.toString(16); // A la base 16
    //console.log("El número decimal %s en hexadecimal es %s", decimal, decimalEnHexadecimal);

    for (let i = 0; i < 16; i++) {
        if (i >= 13) {
            switch (i) {
                case 13:
                    registros.push(new Registro(`r${i} (SP)`, "0x" + "00000000", 0))
                    break;
                case 14:
                    registros.push(new Registro(`r${i} (LR)`, "0x" + "00000000", 0))
                    break;
                case 15:
                    registros.push(new Registro(`r${i} (PC)`, "0x" + "00180000", 0))
                    break;
            }
        } else {
            let nombre = `r${i}`
            registros.push(new Registro(nombre, "0x" + "00000000", 0))
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
function generarRAM() { //correccion
    cont = 0;
    document.getElementById('espacio1').innerHTML = "";
    document.getElementById('espacio2').innerHTML = "";
    document.getElementById('espacio3').innerHTML = "";
    for (let i = 0; i < RAM.length; i++) {
        if (i < 16) {
            if (cont == 0) {
                document.getElementById('espacio1').innerHTML += `<td>0x20070000</td>`
                document.getElementById('espacio1').innerHTML += `<td style="padding:10px">${RAM[i].contenido}</td>`
                cont = 1;
            } else {
                document.getElementById('espacio1').innerHTML += `<td style="padding:10px">${RAM[i].contenido}</td>`
            }
        } else {
            if (i >= 15 && i < 32) {
                if (cont == 1) {
                    document.getElementById('espacio2').innerHTML += `<td>0x20070010</td>`
                    document.getElementById('espacio2').innerHTML += `<td style="padding:10px">${RAM[i].contenido}</td>`
                    cont = 2;
                } else {
                    document.getElementById('espacio2').innerHTML += `<td style="padding:10px">${RAM[i].contenido}</td>`
                }

            } else {
                if (cont == 2) {
                    document.getElementById('espacio3').innerHTML += `<td>0x20070020</td>`
                    document.getElementById('espacio3').innerHTML += `<td style="padding:10px">${RAM[i].contenido}</td>`
                    cont = 3;
                } else {
                    document.getElementById('espacio3').innerHTML += `<td style="padding:10px">${RAM[i].contenido}</td>`
                }
            }
        }
    }
    for (let j = 0; j < 8; j++) {
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

//suponiendo que se recibe [sub, rx,ry] 0 [sub,rx,rx]
function subCon2Registros(registro1, registro2) {  //error
	/*identificar el registro para extraer el operando
	  MODO DE DIRECCIONAMIENTO DE rx y ry : directo a registro*/
    //buscando el registro
    let reg1 = parseInt(registro1.charAt(1));
    let reg2 = parseInt(registro2.charAt(1));
    // let reg1 = parseInt(borrarElementoCadena(registro1, ''));
    //realizar que sean registros a los que el usuario pueda acceder
    if (reg1 >= 8) {
        imprimirError(errores["registro"][3] + registro1);
    } else {
        if (reg2 >= 8) {
            imprimirError(errores["registro"][3] + registro2);
        } else {
            //necesitamos extraer el operando
            let operando1;
            let operando2;
            let resultado;
            //extraer el contenido
			/*for (let i = 2; i <= 9; i++) {
				operando1 += registros[reg1].contenido.charAt(i);
				operando2 += registros[reg2].contenido.charAt(i);
			}*/
            operando1 = registros[reg1].contenido
            operando2 = registros[reg2].contenido
            console.log(operando1.charAt(2), operando2.charAt(2))
            if (operando1.charAt(2) == 'F') {
                operando1 = registros[reg1].contenidoCa2;
            } else {
                if (operando2.charAt(2) == 'F') {
                    operando2 = registros[reg2].contenidoCa2;
                    console.log(operando2)
                }
            }
            //realizar la operacion
            operando1 = parseInt(operando1);
            operando2 = parseInt(operando2);
            console.log("restar", operando1, operando2)
            resultado = operando1 - operando2;
            let tempCa2 = resultado;
            if (resultado < 0) {
                resultado = Ca2(resultado + 1);
                registros[reg1].contenido = resultado;
                registros[reg1].contenidoCa2 = tempCa2;
                console.log(registros)
            } else {
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
                registros[reg1].contenido = "0x" + ceros + resultado;
            }
            console.log(registros)
            generarRegistros();
            fin = finalizando();
            mostrarEnMensajesExito(inicio, fin);
        }
    }

}



function subCon1RegistroY1DatoInmediato(rx, offet) {
    //el dato inmedito debe ser de 8 bits
    // let reg = parseInt(rx.charAt(1));
    // let offet8 = parseInt(offet.charAt(1));
    let reg = parseInt(borrarElementoCadena(rx, 'r'));
    let offet8 = parseInt(borrarElementoCadena(offet, '#'));
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
			/*for (let i = 2; i <= 9; i++) {
				operando1 += registros[reg].contenido.charAt(i);
			}*/
            operando1 = registros[reg].contenido;
            if (operando1.charAt(2) == 'F') {
                operando1 = registros[reg].contenidoCa2;
            }
            operando1 = parseInt(operando1);
            resultado = operando1 - offet8;
            let tempResultNeg = resultado; //CORRECCION: guardo el resultado en esta variable por si es negativa
            if (resultado < 0) { //aplicar complemento a2 con k=32 bits
                //resultado = ((0xFFFFFFFF+(resultado)-1)+2).toString(16) //ignoren eso
                resultado = parseInt(resultado, 10)
                resultado = Ca2(resultado + 1)
                registros[reg].contenido = resultado; //CORRECCION: guardo el resultado en Ca2
                registros[reg].contenidoCa2 = tempResultNeg;//CORRECCION: guardo el resultado en decimal ejemplo -2
                console.log(registros)//CORRECCION: al imprimir el registro pueden ver que ya se modifico el campo
            } else {
                resultado = resultado.toString(32); //convirtiendo a hexadecimal
                //preparando resultado
                let cantidadBytesResult2 = resultado.length;
                let bytesAdd = (8 - cantidadBytesResult2);
                let ceros = ""
                for (let i = 0; i < bytesAdd; i++) {
                    ceros += "0"
                }
                console.log("0x" + ceros + resultado);
                resultado = "0x" + ceros + resultado;
                console.log(registros[registros[reg].contenido]);
                //almacenar el resultado en los registros
                registros[reg].contenido = resultado;
            }
        }
        generarRegistros();
        fin = finalizando();
        mostrarEnMensajesExito(inicio, fin);
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


function subCon3Registros(registro1, registro2, registro3) {
	/*identificar el registro para extraer el operando
	  MODO DE DIRECCIONAMIENTO DE rx y ry : directo a registro*/
    //buscando el registro
    let reg1 = parseInt(registro1.charAt(1));
    let reg2 = parseInt(registro2.charAt(1));
    let reg3 = parseInt(registro3.charAt(1));
    // let reg1 = parseInt(borrarElementoCadena(registro1, ''));
    //realizar que sean registros a los que el usuario pueda acceder
    if (reg1 >= 8) {
        imprimirError(errores["registro"][3] + registro1)
    } else {
        if (reg2 >= 8) {
            imprimirError(errores["registro"][3] + registro2);
        } else {
            if (reg3 >= 8) {
                imprimirError(errores["registro"][3] + registro3);
            } else {

                //necesitamos extraer el operando
                let operando1;
                let operando2;
                let operando3;
                let resultado;
                //extraer el contenido
				/*for (let i = 2; i <= 9; i++) {
					operando1 += registros[reg1].contenido.charAt(i);
					operando2 += registros[reg2].contenido.charAt(i);
				}*/
                operando1 = registros[reg1].contenido
                operando2 = registros[reg2].contenido
                operando3 = registros[reg3].contenido
                if (operando1.charAt(2) == 'F') {
                    operando1 = registros[reg1].contenidoCa2;
                } else {
                    if (operando2.charAt(2) == 'F') {
                        operando2 = registros[reg2].contenidoCa2;
                    } else {
                        if (operando3.charAt(2) == 'F') {
                            operando3 = registros[reg3].contenidoCa2;
                        }
                    }
                }
                //realizar la operacion
                operando1 = parseInt(operando1);
                operando2 = parseInt(operando2);
                operando3 = parseInt(operando3);
                resultado = operando2 - operando3;
                let tempCa2 = resultado;
                if (resultado < 0) {
                    resultado = Ca2(resultado + 1);
                    registros[reg1].contenido = resultado;
                    registros[reg1].contenidoCa2 = tempCa2;
                    console.log(registros)
                } else {
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
                    registros[reg1].contenido = "0x" + ceros + resultado;

                }
                console.log(registros)
                generarRegistros();
                fin = finalizando();
                mostrarEnMensajesExito(inicio, fin);
            }
        }
    }





}

//////////////////////////////////////////FUNCIONES PARA LAS OPERACIONES LDR Y STR///////////////////////////////////////////////////////////////
/*PRIMERO:
-al escribir .data empezarian las intrucciones de carga en la RAM
-identificar el comando etiqueta: word x (Se guardaria un dato menor o igual a k=32)
-Esto caeria a la funcion addEtiqueta() como ["etiqueta","puntero","contenido"]

*/
class Etiqueta {
    constructor(nombre, puntero, contenido) {
        this.nombre = nombre;
        this.puntero = puntero;
        this.contenido = contenido;
    }
}


var Etiquetas = []; ///este arreglo tendra las etiquetas que se reserven

//esta funcion se ejecutaria cada vez que se encuentre una instruccion tal como etiqueta: word 0, enviandole ["etiqueta","puntero","contenido"]
//en el filtro cada vez que encuentre una instruccion diferente le va sumando 4 al puntero
//el filtro debe dejar ingresar cualquier numero despues de .word 
//el numero vendria en hexadecimal "0x20304050"
addEtiqueta("etiqueta", "0", "0x20304050")
function addEtiqueta(nombre, puntero, contenido) {
    Etiquetas.push(new Etiqueta(nombre, puntero, contenido));
}
console.log(Etiquetas);
//una vez que termine de llenar el arreglo etiquetas lo ejecuta y despues ejecuta las instrucciones que esten despues de .text
//para ejecutar el arreglo etiquetas se hara lo siguiente
//funcion para ejecutar todas las etiquetas
function ejecutarReservas() {
    if (Etiquetas.length > 0) {//comprobando que el arreglo no este vacio
        for (let i = 0; i < Etiquetas.length; i++) {//para ejecutar cada una
            guardarContenidoEnRam(Etiquetas[i].nombre, Etiquetas[i].puntero, Etiquetas[i].contenido);//esta funcion estaria guardando el contenido en RAM
        }
    }
} ejecutarReservas()



//funcion ara guardar una palabra en RAM //ejemplo etiqueta
function guardarContenidoEnRam(nombre, puntero, contenido) {
    //preparar el contenido
    //el contenido viene en una cadena hexadecimal
    let contenidoInt = parseInt(contenido);//convirtiendolo a entero
    //Filtro uno:comprobar si el numero puede almacenarce en k=32 bits
    if (contenidoInt >= -2147483647 && contenidoInt <= 2147483647) {
        //guardar el contenido en RAM en hexadecimal pero en little endian
        //tenemos 4 bytes disponibles:
        let palabra = []
        palabra[0] = "";
        palabra[1] = "";
        palabra[2] = "";
        palabra[3] = "";
        //separar cadena
        //hago esto para dividir el 0x20304060 a 0x20,0x30, 0x40, 0x50 para guardarlas en little endian
        if (contenido.charAt(2)) {
            palabra[0] += contenido.charAt(2)
        }
        if (contenido.charAt(3)) {
            palabra[0] += contenido.charAt(3)
        }
        if (contenido.charAt(4)) {
            palabra[1] += contenido.charAt(4)
        }
        if (contenido.charAt(5)) {
            palabra[1] += contenido.charAt(5)
        }
        if (contenido.charAt(6)) {
            palabra[2] += contenido.charAt(6)
        }
        if (contenido.charAt(7)) {
            palabra[2] += contenido.charAt(7)
        }
        if (contenido.charAt(8)) {
            palabra[3] += contenido.charAt(8)
        }
        if (contenido.charAt(9)) {
            palabra[3] += contenido.charAt(9)
        }

        console.log(palabra)
        //guardando el contenido en la RAM 
        let iterar = 1
        for (let i = parseInt(puntero); i < palabra.length; i++) {
            RAM[parseInt(puntero)].contenido = palabra[palabra.length - iterar]
            puntero++
            iterar++
        }
        console.log(RAM);
        generarRAM()
    } else {
        //lanzar error
    }

}

//funcion para guardar la etiqueta en en un registro
/*
Ejemplo ldr r0,=etiqueta
La funcion recibe el nombre de la etiqueta
*/
//ldrEtiqueta("r1", "etiqueta")//probando la funcion

function ldrEtiqueta(registro, etiqueta) {
    //primero comprobar si la etiqueta existe,buscarla en el arreglo ETIQUEtAS
    let existe = false;
    let index;
    let puntero;
    for (let i = 0; i < Etiquetas.length; i++) {
        if (Etiquetas[i].nombre == etiqueta) {
            puntero = Etiquetas[i].puntero
            existe = true;
        }
    }

    if (!existe) {
        //Lanzar error porque la etiqueta no existe
    } else {//si existe
        //obtener la direccion de memoria en la RAM
        let direccion = RAM[puntero].dir_memoria;
        let indexRegistro;
        //identificar el registro
        for (let i = 0; i < registros.length; i++) {
            if (registros[i].nombre == registro) {
                indexRegistro = i;
            }
        }
        //comprobar si el registro se puede usar
        if (parseInt((registros[indexRegistro].nombre).slice(-2)) >= 8) {
            console.error("el registro no se puede usar")
        } else {
            //guardarla en el registro
            registros[indexRegistro].contenido = direccion;
            registros[indexRegistro].contenidoCa2 = 0;
            generarRegistros();
            //ldrGuardarDesdeRAM("r0","r1")
            fin = finalizando();
            mostrarEnMensajesExito(inicio, fin);
        }

    }

}


//funcion de carga en registros, ejemplo ldr,r1 [r2] , ldr,r1,*r2 (podriamos usarla de esta forma)
function ldrGuardarDesdeRAM(registro_destino, registro_fuente) {
    //identificar registros
    let indexRegistro1;
    let indexRegistro2;
    for (let i = 0; i < registros.length; i++) {
        if (registros[i].nombre == registro_destino) {
            indexRegistro1 = i;
        }
        if (registros[i].nombre == registro_fuente) {
            indexRegistro2 = i;
        }
    }

    let punteroEnRAM;
    if (parseInt((registros[indexRegistro1].nombre).slice(-2)) >= 8) {
        console.error("el registro no se puede usar")
    } else {
        if (parseInt((registros[indexRegistro2].nombre).slice(-2)) >= 8) {
            console.error("el registro no se puede usar")
        } else {
            //obtener el resultado de la RAM
            for (let i = 0; i < RAM.length; i++) {
                if (RAM[i].dir_memoria == registros[indexRegistro2].contenido) {
                    //obtener el resultado
                    punteroEnRAM = i
                }
            }

            let valor = "";
            //obtener el valor de la RAM
            for (let i = punteroEnRAM; i < 4; i++) {
                valor += RAM[3 - punteroEnRAM].contenido;
                punteroEnRAM++
            }
            valor = "0x" + valor
            //guarda el resultad en registro
            registros[indexRegistro1].contenido = valor;
            generarRegistros();
            fin = finalizando();
            mostrarEnMensajesExito(inicio, fin);
            console.log(registros)
        }
    }
    //verificar que los registros se puedan usar

}


//para mostrar un error solo llamen a esta funcion y le envian el mensaje
function mostrarError(mensaje) {
    document.getElementById('error').innerHTML = mensaje;
    $('#modal-error').modal('show');
}

/********************************************FIN DE FUNCIONES GABRIELA**************************************/

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
                    let operando2 = registros[reg2].contenido;//extraer el contenido del registro
                    let resultado;

                    if (operando2.charAt[2] == 'F') {
                        operando2 = operando3.contenidoCa2;
                    } else {
                        operando2 = parseInt(operando2)
                    }

                    resultado = operando2 - inm8;

                    if (resultado < 0) { //aplicar complemento a2 con k=32 bits
                        registros[reg1].contenidoCa2 = resultado;

                        resultado = Ca2(resultado - 1);
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
                    generarRegistros();
                    fin = finalizando();
                    mostrarEnMensajesExito(inicio, fin);
                }
            }
        }
    }
}

function mulCon2Registros(registro1, registro2) {

    let reg1 = parseInt(borrarElementoCadena(registro1, 'r'));
    let reg2 = parseInt(borrarElementoCadena(registro2, 'r'));

    if (reg1 >= 8) {
        imprimirError(errores["registro"][3] + registro1);
    } else {
        if (reg2 >= 8) {
            imprimirError(errores["registro"][3] + registro2);
        } else {
            let operando1 = registros[reg1].contenido;
            let operando2 = registros[reg2].contenido;
            let resultado;

            //Verificamos si los registros tienen numeros negativos
            if (operando1.charAt[2] == 'F') {
                operando1 = operando2.contenidoCa2;
            } else {
                operando1 = parseInt(operando1);
            }
            if (operando2.charAt[2] == 'F') {
                operando2 = operando3.contenidoCa2;
            } else {
                operando2 = parseInt(operando2)
            }

            resultado = operando1 * operando2;

            if (resultado < 0) { //aplicar complemento a2 con k=32 bits
                registros[reg1].contenidoCa2 = resultado;

                resultado = Ca2(resultado + 1);
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
            generarRegistros();
            fin = finalizando();
            mostrarEnMensajesExito(inicio, fin);
        }
    }
}

function mulCon3Registros(registro1, registro2, registro3) {

    let reg1 = parseInt(borrarElementoCadena(registro1, 'r'));
    let reg2 = parseInt(borrarElementoCadena(registro2, 'r'));
    let reg3 = parseInt(borrarElementoCadena(registro3, 'r'));

    if (reg1 >= 8) {
        imprimirError(errores["registro"][3] + registro1);
    } else {
        if (reg2 >= 8) {
            imprimirError(errores["registro"][3] + registro2);
        } else {
            if (reg3 >= 8) {
                imprimirError(errores["registro"][3] + registro3);
            } else {
                if (reg1 != reg2 && reg1 != reg3 && reg2 != reg3) {
                    imprimirError(errores["sintaxis"][1]);
                } else {
                    if (reg1 == reg2 || reg1 == reg3) {
                        let operando2 = registros[reg2].contenido;
                        let operando3 = registros[reg3].contenido;
                        let resultado;

                        //Verificamos si los registros tienen numeros negativos
                        if (operando2.charAt[2] == 'F') {
                            operando2 = operando2.contenidoCa2;
                        } else {
                            operando2 = parseInt(operando2);
                        }
                        if (operando3.charAt[2] == 'F') {
                            operando3 = operando3.contenidoCa2;
                        } else {
                            operando3 = parseInt(operando3)
                        }

                        resultado = operando2 * operando3;
                        resultado = 80;

                        if (resultado < 0) { //aplicar complemento a2 con k=32 bits
                            registros[reg1].contenidoCa2 = resultado;

                            resultado = Ca2(resultado + 1);
                            registros[reg1].contenido = resultado;
                        } else {

                            resultado = resultado.toString(16); //convirtiendo a hexadecimal
                            //preparando resultado
                            let cantidadBytesResult = resultado.length;
                            let bytesAdd = (8 - cantidadBytesResult);
                            let ceros = ""
                            for (let i = 0; i < bytesAdd; i++) {
                                ceros += "0";
                            }
                            console.log("0x" + ceros + resultado)
                            //almacenar el resultado en los registros
                            registros[reg1].contenido = "0x" + ceros + resultado;

                        }
                        generarRegistros();
                        fin = finalizando();
                        mostrarEnMensajesExito(inicio, fin);
                    } else {
                        imprimirError(errores["sintaxis"][1]);
                    }
                }
            }
        }
    }
}
/************************************FIN funciones Gerardo*****************************************/

/***************************************Funciones Angel copia************************************************/

function addCon1RegistroY1DatoInmediato(rx, inm) {
    //el dato inmedito debe ser de 8 bits
    // let reg = parseInt(rx.charAt(1));
    // let inm = parseInt(inm.substr(1));

    let reg = parseInt(borrarElementoCadena(rx, 'r'));
    let inm8 = parseInt(borrarElementoCadena(inm, '#'));
    //Hacer que sean registros a los que el usuario pueda acceder
    if (reg >= 8) {
        imprimirError(errores["registro"][3]);
    } else {
        if (inm8 > 255) {
            imprimirError(errores["espacio"][5]);
        } else {
            let operando1 = ""; //registro
            let resultado;

            //extraer el contenido
            for (let i = 2; i <= 9; i++) {
                operando1 += registros[reg].contenido.charAt(i);
            }
            operando1 = parseInt(operando1);
            resultado = operando1 + inm8;
            if (resultado < 0) { //aplicar complemento a2 con k=32 bits
                resultado = Ca2(resultado);
                registros[reg].contenido = resultado;
            } else {
                resultado = resultado.toString(16); //convirtiendo a hexadecimal
                //preparando resultado
                let cantidadBytesResult2 = resultado.length;
                let bytesAdd = (8 - cantidadBytesResult2);
                let ceros = ""
                for (let i = 0; i < bytesAdd; i++) {
                    ceros += "0"
                }
                console.log("0x" + ceros + resultado);
                resultado = "0x" + ceros + resultado;
                console.log(registros[registros[reg].contenido]);
                //almacenar el resultado en los registros
                registros[reg].contenido = resultado;

            }

        }
        generarRegistros();
        fin = finalizando();
        mostrarEnMensajesExito(inicio, fin);
    }

}




function addCon2RegistrosY1DatoInmediato(registro1, registro2, inm) {
    // let reg1 = parseInt(registro1.charAt(1));
    // let reg2 = parseInt(register2.charAt(1));
    // let inm8 = parseInt(inm.substr(1));

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
                if (registro1 == registro2) { //
                } else {
                    let operando2 = ""
                    let resultado;
                    //extraer el contenido del registro
                    for (let i = 2; i <= 9; i++) {
                        operando2 += registros[reg2].contenido.charAt(i);
                    }

                    operando2 = parseInt(operando2);
                    resultado = operando2 + inm8;

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
        generarRegistros();
        fin = finalizando();
        mostrarEnMensajesExito(inicio, fin);
    }
}

//suponiendo que se ha de recibir add [rX, rY, rZ] o add [rX, rX, rY] o add [rX, rY, rY]

function addCon3Registros(registro1, registro2, registro3) {

    // let reg1 = parseInt(registro1.charAt(1));
    // let reg2 = parseInt(registro2.charAt(1));
    // let reg3 = parseInt(registro3.charAt(1));


    let reg1 = parseInt(borrarElementoCadena(registro1, 'r'));
    let reg2 = parseInt(borrarElementoCadena(registro1, 'r'));
    let reg3 = parseInt(borrarElementoCadena(registro1, 'r'));

    if (reg1 >= 8) {
        imprimirError(errores["registro"][3] + registro1);
    } else {
        if (reg2 >= 8) {
            imprimirError(errores["registro"][3] + registro2);
        } else {
            if (reg3 >= 8) {
                imprimirError(errores["registro"][3] + registro2);
            } else {
                if (reg1 != reg2 && reg1 != reg3 && reg2 != reg3) {
                    imprimirError(errores["sintaxis"][1]);
                } else {

                    let operando2 = parseInt(registros[reg2].contenido);
                    let operando3 = parseInt(registros[reg3].contenido);
                    let resultado;


                    resultado = operando2 + operando3;

                    if (resultado < 0) {//aplicar complemento a2 con k=32 bits
                        resultado = Ca2(resultado);
                        registros[reg].contenido = resultado;
                    } else {
                        resultado = resultado.toString(16); //convirtiendo a hexadecimal


                        //preparando el resultado
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
            }
        }
        generarRegistros();
        fin = finalizando();
        mostrarEnMensajesExito(inicio, fin);

    }

}

/*********************************************************Fin Funciones Angel copia***************************************************/


/**********************************funciones Jonathan*******************************/

function and(registro1, registro2) {

    if (registro1.charAt(0) != 'r') {
        imprimirError(errores["ejecucion"][3] + registro1);
    } else {
        if (registro2.charAt(0) != 'r') {
            imprimirError(errores["ejecucion"][3] + registro2);

        }

        let reg1 = parseInt(borrarElementoCadena(registro1, 'r'));
        let reg2 = parseInt(borrarElementoCadena(registro2, 'r'));


        //como dijeron hay que ver si son registros accesibles
        if (reg1 >= 8) {
            imprimirError(errores["registro"][3] + registro1);

        } else {
            if (reg2 >= 8) {
                imprimirError(errores["registro"][3] + registro2);

            } else {

                //acordarse de que el registro es asi 0x00000000
                elemento1Binario = parseInt(registros[reg1].contenido).toString(2);
                elemento2Binario = parseInt(registros[reg2].contenido).toString(2);

                console.log(elemento1Binario);
                console.log(elemento2Binario);



                elemento1Completo = agregarCerosPara32bits(elemento1Binario);
                elemento2Completo = agregarCerosPara32bits(elemento2Binario);


                let mascara = "";

                console.log(elemento1Completo.length);
                console.log(elemento2Completo.length);

                for (let i = 0; i < 32; i++) {
                    if (elemento1Completo.charAt(i) == elemento2Completo.charAt(i)) {
                        if (elemento1Completo.charAt(i) == 0) {
                            mascara += "0";
                        } else if (elemento1Completo.charAt(i) == 1) {
                            mascara += "1";
                        }
                    } else {
                        mascara += "0";
                    }
                }


                console.log(mascara);

                indicePrimer1 = mascara.indexOf("1");
                cadenaFinal = mascara.slice(indicePrimer1);
                console.log(cadenaFinal);
                cadenaFinal = (parseInt(cadenaFinal, 2));
                console.log(cadenaFinal);

                resultado = cadenaFinal.toString(16) //convirtiendo a hexadecimal
                resultado = resultado.toUpperCase();
                //preparando resultado
                let cantidadBytesResult2 = resultado.length;
                let bytesAdd = (8 - cantidadBytesResult2);
                let ceros = ""
                for (let i = 0; i < bytesAdd; i++) {
                    ceros += "0"
                }
                console.log("0x" + ceros + resultado)
                resultado = ("0x" + ceros + resultado);
                console.log(registros[reg1].contenido);
                //almacenar el resultado en los registros
                registros[reg1].contenido = resultado;

            }
            generarRegistros();
            fin = finalizando();
            mostrarEnMensajesExito(inicio, fin);
        }


    }

}


function agregarCerosPara32bits(elemento) {

    tamanioElem = elemento.length;
    console.log('tamanio elemento en binarop: ' + tamanioElem);
    cerosFaltantes = (32 - tamanioElem);
    let cerosElem = "";

    for (let i = 0; i < cerosFaltantes; i++) {
        cerosElem += "0";
    }

    elemento = cerosElem + elemento;
    return elemento;
}


function not(elemento1, elemento2) {

}



function eor(registro1, registro2) {

    let reg1 = parseInt(borrarElementoCadena(registro1, 'r'));
    let reg2 = parseInt(borrarElementoCadena(registro2, 'r'));


    //como dijeron hay que ver si son registros accesibles
    if (reg1 >= 8) {
        imprimirError(errores["registro"][3] + registro1);

    } else {
        if (reg2 >= 8) {
            imprimirError(errores["registro"][3] + registro2);

        } else {

            //acordarse de que el registro es asi 0x00000000
            elemento1Binario = parseInt(registros[reg1].contenido).toString(2);
            elemento2Binario = parseInt(registros[reg2].contenido).toString(2);


            elemento1Completo = agregarCerosPara32bits(elemento1Binario);
            elemento2Completo = agregarCerosPara32bits(elemento2Binario);


            let mascara = "";

            console.log(elemento1Completo.length);
            console.log(elemento2Completo.length);

            for (let i = 0; i < 32; i++) {
                if (elemento1Completo.charAt(i) == elemento2Completo.charAt(i)) {
                    if (elemento1Completo.charAt(i) == 0) {
                        mascara += "0";
                    } else if (elemento1Completo.charAt(i) == 1) {
                        mascara += "0";
                    }
                } else {
                    mascara += "1";
                }
            }


            console.log(mascara);

            indicePrimer1 = mascara.indexOf("1");
            cadenaFinal = mascara.slice(indicePrimer1);
            console.log(cadenaFinal);
            cadenaFinal = (parseInt(cadenaFinal, 2));
            console.log(cadenaFinal);

            resultado = cadenaFinal.toString(16) //convirtiendo a hexadecimal
            resultado = resultado.toUpperCase();
            //preparando resultado
            let cantidadBytesResult2 = resultado.length;
            let bytesAdd = (8 - cantidadBytesResult2);
            let ceros = ""
            for (let i = 0; i < bytesAdd; i++) {
                ceros += "0"
            }
            console.log("0x" + ceros + resultado)
            resultado = ("0x" + ceros + resultado);
            console.log(registros[reg1].contenido);
            //almacenar el resultado en los registros
            registros[reg1].contenido = resultado;


        }
        generarRegistros();
        fin = finalizando();
        mostrarEnMensajesExito(inicio, fin);
    }
}


/**********************************FIN funciones Jonathan*******************************/

/**************************************************************funciones PAULA*******************************/

function movCon2Registros(arrx, arry) { 					//mov rx,ry
    let reg1 = parseInt(arrx.substr(1));
    let reg2 = parseInt(arry.substr(1));
    if (reg1 >= 8) {												//revisar que sean registros a los que el usuario pueda acceder
        imprimirError(errores["registro"][3] + arrx);
    } else if (reg2 >= 8) {
        imprimirError(errores["registro"][3] + arry);
    } else {
        let op = '';
        op = registros[reg2].getContenido();					//obtener cont de ry
        if (op.charAt(2) == 'F') {								//si es neg se obtiene valor neg y se guarda en ca2 de rx
            registros[reg1].setContenidoCa2(registros[reg2].getContenidoCa2());
        }
        registros[reg1].setContenido(op);						// obtiene ry para anadirlo a rx
    }
    generarRegistros();											//console.log(`estos son los reg de la funcion mov: ${registros[reg1].getContenido()}`);
    fin = finalizando();
    mostrarEnMensajesExito(inicio, fin);
}

function movCon1RegistroY1DatoInmediato(arrx, inm) {		//Mov rx, #n
    let reg1 = parseInt(arrx.substr(1));
    let offset = parseInt(inm.substr(1));      				//separa el numero del '#'
    if (reg1 >= 8) {											//revisar que sean registros a los que el usuario pueda acceder
        imprimirError(errores["registro"][3] + arrx);

    } else if (offset > 255 || offset < 0) {
        imprimirError(errores["espacio"][5]);

    } else {
        let resultado;
        let op = registros[reg1];
        resultado = offset.toString(16);           			//convertir #inm8 en hex
        let cantidadBytesResult = resultado.length;			//llena los 0s
        let bytesAdd = (8 - cantidadBytesResult);
        let ceros = ""
        for (let i = 0; i < bytesAdd; i++) {
            ceros += "0"
        }
        resultado = "0x" + ceros + resultado;
        op.setContenido(resultado.toUpperCase());	// anade #Inm8 a rx
    }
    generarRegistros();
    fin = finalizando();
    mostrarEnMensajesExito(inicio, fin);
}

function addCon2Registros(arrx, arry) { 					//add rX, rY
    let reg1 = parseInt(arrx.substr(1));							//numero de registro    
    let reg2 = parseInt(arry.substr(1));
    if (reg1 >= 8) {													//revisar que sean registros a los que el usuario pueda acceder
        imprimirError(errores["registro"][3] + arrx);
    } else if (reg2 >= 8) {
        imprimirError(errores["registro"][3] + arry);
    } else {
        let op1 = '';
        let op2 = '';
        let resultado;
        let strop1 = registros[reg1].getContenido();				//Obtiene la cadena de registro
        let strop2 = registros[reg2].getContenido();
        op1 = registros[reg1].getContDecimal();
        op2 = registros[reg2].getContDecimal();
        if (strop1.charAt(2) == 'F') {								//analiza si el primer caracter despues de 0x es F
            op1 = registros[reg1].getContenidoCa2();
            console.log("se hace negativo");
        } else if (strop2.charAt(2) == 'F') {
            op2 = registros[reg2].getContenidoCa2();
        }
        console.log(`r1: ${op1}, r2: ${op2}`);
        resultado = parseInt(op1) + parseInt(op2);					//Realizar operacion
        if (resultado < 0) {
            registros[reg1].setContenidoCa2(resultado);
            resultado = parseInt(resultado);
            resultado = Ca2(resultado + 1);
            registros[reg1].setContenido(resultado);
        } else {
            resultado = resultado.toString(16); 					//Convertir a hex
            console.log(`el resultado en hex: ${resultado}`);
            let cantidadBytesResult = resultado.length;				//preparando resultado
            let bytesAdd = (8 - cantidadBytesResult);
            let ceros = ""
            for (let i = 0; i < bytesAdd; i++) {
                ceros += "0"
            }
            resultado = "0x" + ceros + resultado;
            registros[reg1].setContenido(resultado.toUpperCase());		//Añade el resultado de la suma al contenido de rx
        }
        generarRegistros();
        fin = finalizando();
        mostrarEnMensajesExito(inicio - fin);
    }
}
/**************************************************************funciones PAULA*******************************/

function iniciando() {
    return new Date().getTime();
}

function finalizando() {
    return new Date().getTime();
}

var arrReservar = [];
const palabras = ['.word'];
function reservarMemoria(){
    let bien = false;
    arrReservar = [];
    let contadorReserva = 1;
    let arrReservarTemporal = [];
    arrEtiquetasTemp = [];
    jsonEtiquetas = {};
    arrReservarTemporal = document.getElementById('area-de-codigo').value.split('\n');
    if(borrarElementoCadena(arrReservarTemporal[0], ' ') == '.data'){
        bien = true;
        // while(arrReservarTemporal[contadorReserva] != '.text'){
        //     arrReservar.push(arrReservarTemporal[contadorReserva]);
        // }
        for(let i = 0; i < arrReservarTemporal.length; i++){
            if(arrReservarTemporal[i] == '.text'){
                arrReservarTemporal.splice(i, 1);
                break;
            }
        }   
        for(let j = 0; j < arrReservarTemporal.length; j++){
            arrReservar.push(borrarElementoCadena(arrReservarTemporal[j], ' '));
        }
    }else{
        imprimirError(errores["reserva"][1]);
    }
    
    arrReservar = borrarElemento(arrReservar, '');
    arrReservar.shift();
    if(bien = true){
        prepararEtiquetas(arrReservar);
    }else{
        imprimirError(errores["desconocido"][1]);
    }

    console.log(arrReservar);
}

var jsonEtiquetas = {};
var arrEtiquetasTemp = [];
function prepararEtiquetas(arrEtiquetas){ //Recibe un arreglo con las etiquetas y sus valores
    let bien = false;
    
    let contadorPuntos = 0;
    for(let i = 0; i < arrEtiquetas.length; i++){
        jsonEtiquetas[arrEtiquetas[i].slice(0, arrEtiquetas.length - 1)] = borrarElementoCadena(arrEtiquetas[i], arrEtiquetas[i].slice(0, arrEtiquetas.length));
        arrEtiquetasTemp.push(arrEtiquetas[i].slice(0, arrEtiquetas.length - 1));
    }

    console.log(arrEtiquetasTemp);
    console.log(Object.keys(jsonEtiquetas).length);
    console.log(jsonEtiquetas["e1"]);
    for(let i = 0; i < Object.keys(jsonEtiquetas).length; i++){
        console.log(jsonEtiquetas[arrEtiquetasTemp[i]]);
        if(contarCaracterCadena(jsonEtiquetas[arrEtiquetasTemp[i]], '.') == 1){
            bien = true;
        }else{
            imprimirError(errores["sintaxis"][1]);
            bien = false;
            break;
        }
    }

    console.log(contadorPuntos);

    if(bien == true){
        verificarPalabraWord();
    }else{
        imprimirError(errores["sintaxis"][1]);
    }
}

function verificarPalabraWord(){
    let bien = false;
    console.log(jsonEtiquetas);
    for(let i = 0; i < Object.keys(jsonEtiquetas).length; i++){
        console.log(jsonEtiquetas[arrEtiquetasTemp[i]]);
        if(contarCaracterCadena(jsonEtiquetas[arrEtiquetasTemp[i]], 'w') == 1 && contarCaracterCadena(jsonEtiquetas[arrEtiquetasTemp[i]], 'o') == 1 && contarCaracterCadena(jsonEtiquetas[arrEtiquetasTemp[i]], 'r') == 1 && contarCaracterCadena(jsonEtiquetas[arrEtiquetasTemp[i]], 'd') == 1){
            bien = true;
        }else{
            bien = false;
            break;
        }
    }

    if(bien == true){
        verificarNumero();
    }else{
        imprimirError(errores["sintaxis"][1]);
    }

}

function verificarNumero(){
    let bien = false;

    //.data
    // e1: .word 123
    
    for(let i = 0; i < Object.keys(jsonEtiquetas).length; i++){
        let contenido = jsonEtiquetas[arrEtiquetasTemp[i]].substr(5);
        
        console.log(jsonEtiquetas[arrEtiquetasTemp[i]]);
        x = Number(contenido);

        if(Number.isInteger(x)){
            bien = true;
            let nombre = arrEtiquetasTemp[i];
            let puntero=0;
            if(i==0){
                addEtiqueta(nombre, puntero, x);
            }else{
                for(let j=1; j<arrEtiquetasTemp.length; j++){
                    puntero += 4;
                    addEtiqueta(nombre,puntero,x);
                }
            }
        }else{
            imprimirError(errores["reserva"][3]);
            bien = false;
            break;
        }
    }
    ejecutarReservas();
}