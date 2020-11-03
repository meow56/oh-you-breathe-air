'use strict';

const airComposition = {
	nitrogen: 0.78084*0.996,
	oxygen: 0.20946*0.996,
	argon: 0.00934*0.996,
	carbonDioxide: 0.00041361*0.996,
	neon: 0.00001818*0.996,
	helium: 0.00000524*0.996,
	methane: 0.00000187*0.996,
	krypton: 0.00000114*0.996,
	waterVapor: 0.004
}; // dictionary of what air is made of. Taken from Wikipedia: https://en.wikipedia.org/wiki/Atmosphere_of_Earth#Composition
   // note that this table shows the composition of dry air by volume.
   // thus I assumed water vapor took up 0.4% of wet air and scaled all other values accordingly.

let airCount = {
	nitrogen: 0n,
	oxygen: 0n,
	argon: 0n,
	carbonDioxide: 0n,
	neon: 0n,
	helium: 0n,
	methane: 0n,
	krypton: 0n,
	waterVapor: 0n
}; // dictionary of how many of each molecule has been displayed.
   // this is done so i can say "nitrogen molecule #1", "nitrogen molecule #2", etc.

const volumeToMole = 22.4; // 22.4 L = 1 mol.
const atmosphericVolume = BigInt(108) * BigInt(10^22) // 108*10^10 km^3, taken from https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html.
													  // 1 km^3 = 1e12 L, so multiply by 1e12 to get final value in liters.
const atmosphericMole = BigInt(volumeToMole * 10) * atmosphericVolume / 10n; // returns the number of moles in the atomsphere.
let moleComposition = {}; // much like airComposition, but gives moles instead of percent.
Object.keys(airComposition).forEach(function(element) {
	moleComposition[element] = atmosphericMole * BigInt(1000000000000000000000 * airComposition[element]) / 1000000000000000000000n;
}); // sets moleComposition.
	// since BigInt only represents, well, ints, i had to hack together something to ensure everything works. hence why x / (1 / y).
const avogadro = BigInt(602214076000000000000000); // avogadro's constant. aka the number of atoms in a mole of stuff.
												   // once again since BigInt only handles ints, and because i wasn't confident that
												   // regular ints would handle 6.02 * 10^23 precisely, i just wrote it out
												   // without scientific notation. it's actually precisely defined to be this number,
												   // so that's a plus. (ref: https://physics.nist.gov/cgi-bin/cuu/Value?na)
let moleculeComposition = {}; // much like moleComposition, but gives molecules instead of moles.
Object.keys(moleComposition).forEach(function(element) {
	moleculeComposition[element] = avogadro * moleComposition[element];
}); // sets moleculeComposition.

const readableNames = {
	nitrogen: "Nitrogen",
	oxygen: "Oxygen",
	argon: "Argon",
	carbonDioxide: "Carbon Dioxide",
	neon: "Neon",
	helium: "Helium",
	methane: "Methane",
	krypton: "Krypton",
	waterVapor: "Water Vapor"
}; // the names of molecules, but human-readable.

function weightedRandom(weights) {
	// Picks one of the keys at random, with each key being weighted by their value.
	// Arguments:
	//   weights: dictionary of keys and values. Values should be of type BigInt.
	// Returns:
	//   the key chosen.

	let keys = Object.keys(weights);
	let totalWeight = 0n; // the sum of the weights of each key.
	keys.forEach(element => totalWeight += weights[element]);
	let randomPick = Math.random();
	let convertedNumber = totalWeight * BigInt(Math.floor(10000000000000000000 * randomPick)) / 10000000000000000000n; // that's what i call cheese!
	for(let i = 0; i < keys.length; i++) {
		if(convertedNumber < weights[keys[i]]) {
			return keys[i];
		}
		convertedNumber -= weights[keys[i]];
	}
	throw "No random number found.";
}

let outputDiv = document.getElementById("output");
function displayMolecule() {
	if(outputDiv === null) {
		outputDiv = document.getElementById("output");
		setTimeout(displayMolecule, 0);
	} else {
		let molecule = weightedRandom(moleculeComposition);
		let limitReached = (airCount[molecule] === moleculeComposition[molecule]);
		while(limitReached) {
			molecule = weightedRandom(moleculeComposition);
			limitReached = (airCount[molecule] === moleculeComposition[molecule]);
		}
		airCount[molecule]++;
		let textDiv = document.createElement("DIV");
		textDiv.textContent = readableNames[molecule] + " molecule #" + airCount[molecule];
		outputDiv.appendChild(textDiv);
		setTimeout(displayMolecule, 0);
	}
}
displayMolecule();