 

var hola = ['mov r0, r1', 'mov r0, r1, r2'];

document.write(borrarElemento(hola[0], ','));

function borrarElemento(arr, elemento){
	var j = arr.indexOf(elemento);
	if(j != -1){  						
		arr.splice(j, 1);
	}else{
		arr = null;
	}

	return arr;								
}