

//https://academo.org/demos/colour-temperature-relationship/demo.js?v=1465590712
//https://academo.org/demos/colour-temperature-relationship/
function KToRGB(Temperature){

	Temperature = Temperature / 100;

	if (Temperature <= 66){
		Red = 255;
	} else {
		Red = Temperature - 60;
		Red = 329.698727466 * Math.pow(Red, -0.1332047592);
		if (Red < 0){
			Red = 0;
		}
		if (Red > 255){
			Red = 255;
		}
	}

	if (Temperature <= 66){
		Green = Temperature;
		Green = 99.4708025861 * Math.log(Green) - 161.1195681661;
		if (Green < 0 ) {
			Green = 0;
		}
		if (Green > 255) {
			Green = 255;
		}
	} else {
		Green = Temperature - 60;
		Green = 288.1221695283 * Math.pow(Green, -0.0755148492);
		if (Green < 0 ) {
			Green = 0;
		}
		if (Green > 255) {
			Green = 255;
		}
	}

	if (Temperature >= 66){
		Blue = 255;
	} else {
		if (Temperature <= 19){
			Blue = 0;
		} else {
			Blue = Temperature - 10;
			Blue = 138.5177312231 * Math.log(Blue) - 305.0447927307;
			if (Blue < 0){
				Blue = 0;
			}
			if (Blue > 255){
				Blue = 255;
			}
		}
	}

	return color(Math.round(Red),Math.round(Green),Math.round(Blue));

}

const SOLAR_RADIUS = 1000;

//https://en.wikipedia.org/wiki/Stellar_classification
const starDesc = [
  {"desc":"Type M star","T":3700,"size":4,"radius":0.5},
  {"desc":"Type M dwarf","T":2500,"size":4,"radius":0.5},
  {"desc":"Type M red dwarf","T":2500,"size":4,"radius":0.5},

  {"desc":"Type K orange star","T":4000,"size":5,"radius":0.8},
  {"desc":"Type G yellow star","T":5500,"size":6,"radius":1.0},
  {"desc":"Type F white star" ,"T":7000,"size":7,"radius":1.2},
  {"desc":"Type A blue-white star","T":9000,"size":8,"radius":1.5},
  {"desc":"Type B blue star","T":20000,"size":10,"radius":2.0},
  {"desc":"Type O blue star","T":40000,"size":11,"radius":5.0},

  // {"desc":"Red giant","T":3000,"size":12},
  // {"desc":"Blue super giant","T":50000,"size":15},

];

class Star extends MajorBody {
	constructor() {
		super();

		let template = starDesc[floor(random(starDesc.length))]; //clone the base description

    this.col = KToRGB(template.T);
		this.desc = template.desc;
		this.size = template.size;
		this.radius = 100000;
		this.mass = 100000;




	}
}
