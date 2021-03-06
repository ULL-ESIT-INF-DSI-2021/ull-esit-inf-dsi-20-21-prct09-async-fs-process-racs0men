"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const chalk = require("chalk");
const yargs = require("yargs");
const child_process_1 = require("child_process");
/**
 * @description Comando de Yargs para la opción analyze, el cual muestra
 * por consola e número de líneas, palabras y/o caracteres que posee un
 * fichero que se le pasa como parámetro.
 */
yargs.command({
    command: 'analyze',
    describe: 'Muestra por consola el número de líneas, palabras y caracteres que posee un fichero que se le pase como parámetro.',
    builder: {
        pipe: {
            describe: 'Opción para activar o desactivar el método pipe.',
            demandOption: true,
            type: 'string',
        },
        fichero: {
            describe: 'Fichero que se quiere analizar.',
            demandOption: true,
            type: 'string',
        },
        lineas: {
            describe: 'Opción para contar el número de líneas que posee el fichero.',
            demandOption: false,
            type: 'boolean',
        },
        palabras: {
            describe: 'Opción para contar el número de palabras que posee el fichero.',
            demandOption: false,
            type: 'boolean',
        },
        caracteres: {
            describe: 'Opción para contar el número de caracteres que posee el fichero.',
            demandOption: false,
            type: 'boolean',
        },
    },
    handler(argv) {
        if ((typeof argv.pipe === "string") && (typeof argv.fichero === "string")) {
            let comando = [];
            if ((argv.pipe == "si") || (argv.pipe == "Si"))
                conPipe(comando, argv.fichero);
            else if ((argv.pipe == "no") || (argv.pipe == "No"))
                sinPipe(comando, argv.fichero);
            else
                console.log(chalk.rgb(255, 0, 0).inverse("\nERROR: Ha introducido mal el parámetro pipe, por favor, introduzca Si o No.\n"));
            if (argv.lineas == true)
                comando.push("lineas");
            if (argv.palabras == true)
                comando.push("palabras");
            if (argv.caracteres == true)
                comando.push("caracteres");
            if (comando.length == 0)
                console.log(chalk.rgb(255, 0, 0).inverse("\nERROR: No ha introducido ninguna opción a analizar.\n"));
        }
    },
}).parse();
/**
 * @description Método que hace uso de pipe de un Stream para poder redirigir la salida de un comando hacia otro.
 * @param entrada Datos de entrada que recibe el comando (si quiere contar lineas...).
 * @param nombreFichero Nombre del fichero que se quiere analizar.
 */
function conPipe(entrada, nombreFichero) {
    fs.access(nombreFichero, (err) => {
        if (err)
            console.log(chalk.rgb(255, 0, 0).inverse("\nERROR: El fichero que ha introducido no existe.\n"));
        else {
            let echo = child_process_1.spawn('echo', [`\nAbriendo el fichero: ${nombreFichero}\n`]);
            let wc = child_process_1.spawn('wc', [`${nombreFichero}`]);
            echo.stdout.pipe(process.stdout);
            let wcOutput = '';
            wc.stdout.on('data', (piece) => wcOutput += piece);
            wc.on('close', () => {
                let outputArray = wcOutput.split(/\s+/);
                entrada.forEach((element) => {
                    if (element == "lineas") {
                        const echo = child_process_1.spawn('echo', [`El fichero contiene ${parseInt(outputArray[1]) + 1} líneas.\n`]);
                        echo.stdout.pipe(process.stdout);
                    }
                    if (element == "palabras") {
                        const echo = child_process_1.spawn('echo', [`El fichero contiene ${outputArray[2]} palabras.\n`]);
                        echo.stdout.pipe(process.stdout);
                    }
                    if (element == "caracteres") {
                        const echo = child_process_1.spawn('echo', [`El fichero contiene ${outputArray[3]} caracteres.\n`]);
                        echo.stdout.pipe(process.stdout);
                    }
                });
            });
        }
    });
}
/**
 * Método igual que conPipe pero sin hacer uso de pipe.
 * @param entrada Datos de entrada que recibe el comando (si quiere contar lineas...).
 * @param nombreFichero Nombre del fichero que se quiere analizar.
 */
function sinPipe(entrada, nombreFichero) {
    fs.access(nombreFichero, (err) => {
        if (err)
            console.log(chalk.rgb(255, 0, 0).inverse("\nERROR: El fichero que ha introducido no existe.\n"));
        else {
            let wc = child_process_1.spawn('wc', [`${nombreFichero}`]);
            console.log(`\n${nombreFichero}\n`);
            let wcOutput = '';
            wc.stdout.on('data', (piece) => wcOutput += piece);
            wc.on('close', () => {
                const outputArray = wcOutput.split(/\s+/);
                entrada.forEach((element) => {
                    if (element == "lineas")
                        console.log(`El fichero contiene ${parseInt(outputArray[1]) + 1} líneas.\n`);
                    if (element == "palabras")
                        console.log(`El fichero contiene ${outputArray[2]} palabras.\n`);
                    if (element == "caracteres")
                        console.log(`El fichero contiene ${outputArray[3]} caracteres.\n`);
                });
            });
        }
    });
}
