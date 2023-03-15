// With ES6,TypeScript etc
import Artyom from './artyom.js';

// Create a variable that stores your instance
const artyom = new Artyom();

// Or if you are using it in the browser
// var artyom = new Artyom();// or `new window.Artyom()`

// Add command (Short code artisan way)
artyom.on(['Good morning','Good afternoon']).then((i) => {
    switch (i) {
        case 0:
            artyom.say("Good morning, how are you?");
        break;
        case 1:
            artyom.say("Good afternoon, how are you?");
        break;            
    }
});

// Smart command (Short code artisan way), set the second parameter of .on to true
artyom.on(['Repeat after me *'] , true).then((i,wildcard) => {
    artyom.say("You've said : " + wildcard);
});

// or add some commandsDemostrations in the normal way
artyom.addCommands([
    {
        indexes: ['Hello','Hi','is someone there'],
        action: (i) => {
            artyom.say("Hello, it's me");
        }
    },
    {
        indexes: ['Repeat after me *'],
        smart:true,
        action: (i,wildcard) => {
            artyom.say("You've said : "+ wildcard);
        }
    },
    // The smart commands support regular expressions
    {
        indexes: [/Good Morning/i],
        smart:true,
        action: (i,wildcard) => {
            artyom.say("You've said : "+ wildcard);
        }
    },
    {
        indexes: ['shut down yourself'],
        action: (i,wildcard) => {
            artyom.fatality().then(() => {
                console.log("Artyom succesfully stopped");
            });
        }
    },
]);

// Start the commands !
artyom.initialize({
    lang: "en-GB", // GreatBritain english
    continuous: true, // Listen forever
    soundex: true,// Use the soundex algorithm to increase accuracy
    debug: true, // Show messages in the console
    executionKeyword: "and do it now",
    listen: true, // Start to listen commands !

    // If providen, you can only trigger a command if you say its name
    // e.g to trigger Good Morning, you need to say "Jarvis Good Morning"
    name: "Jarvis" 
}).then(() => {
    console.log("Artyom has been succesfully initialized");
}).catch((err) => {
    console.error("Artyom couldn't be initialized: ", err);
});

/**
 * To speech text
 */
artyom.say("Hello, this is a demo text. The next text will be spoken in Spanish",{
    onStart: () => {
        console.log("Reading ...");
    },
    onEnd: () => {
        console.log("No more text to talk");

        // Force the language of a single speechSynthesis
        artyom.say("Hola, esto está en Español", {
            lang:"es-ES"
        });
    }
});