/**************************************************************************************/
			//DEFINIENDO CLASES
class Registro {
  constructor(nombre, contenido) {
    this.nombre = nombre;
    this.contenido = contenido;
  }
}


class Byte{
  constructor(dir_memoria, contenido) {
    this.dir_memoria= dir_memoria;
    this.contenido = contenido;
  }
}

//declarando variables y arreglos
var registros=[];
var RAM=[];


function inicializar_registros() {
	//declarar un arreglo con los registros inicializandolos en 0

	var inicio = 0000000; 
	var inicioHexa = inicio.toString(16); // A la base 16
	//console.log("El número decimal %s en hexadecimal es %s", decimal, decimalEnHexadecimal);

	for(let i=0; i<16; i++){
		if(i>=13){
			switch(i){
				case 13:
				registros.push(new Registro(`r${i} (SP)`,"0x"+"00000000"))
				break;
				case 14:
				registros.push(new Registro(`r${i} (LR)`,"0x"+"00000000"))
				break;
				case 15:
				registros.push(new Registro(`r${i} (PC)`,"0x"+"00180000"))
				break;}
		}else{
				let nombre=`r${i}`
				registros.push(new Registro(nombre,"0x"+inicioHexa))
		}
		
		}
		
		console.log(registros);

}inicializar_registros();


//inicializando la memoria RAM
function inicializar_RAM() {
	var inicio = 0000000; 
	var inicioHexa = inicio.toString(16); // A la base 16
	//console.log("El número decimal %s en hexadecimal es %s", decimal, decimalEnHexadecimal);
	for(let i=0; i<40; i++){
		if(i<=9){
			RAM.push(new Byte(`0x2007000${i}`,"0x"+"00000000"))}
		else{
			RAM.push(new Byte(`0x200700${i}`,"0x"+"00000000"))
		}
		
	}

}inicializar_RAM();
console.log(RAM);