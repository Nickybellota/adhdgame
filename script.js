// Holt den äußeren Batterie-Container aus dem DOM
const batterie = document.getElementById("batterie");
// Holt den versteckten Überraschungs-Bereich
const ueberraschung = document.getElementById("ueberraschung");

const resetButton = document.getElementById("reset-button");
const startText = document.getElementById("start-text");
const ueberraschungText = document.getElementById("ueberraschung-text");
const ueberraschungLink = document.getElementById("ueberraschung-link");

// Wie viele Segmente die Batterie insgesamt haben soll
const anzahlSegmente = 10;

// Zählt, wie viele Segmente aktuell gefüllt sind (startet bei 0)
let gefuellteSegmente = 0;

// Erstellt die Segmente einmalig beim Laden der Seite
function erstelleSegmente() {
    // Wiederholt den Code einmal für jedes gewünschte Segment
    for (let i = 0; i < anzahlSegmente; i++) {
        // Erstellt ein neues <div> für ein einzelnes Segment
        const segment = document.createElement("div");
        // Gibt ihm die CSS-Klasse "segment" (für die Grund-Optik)
        segment.classList.add("segment");

        // Reagiert auf Klick auf DIESES Segment
        segment.addEventListener("click", function() {
            segmentAnklicken(i);
        });

        // Hängt das neue Segment in die Batterie-Hülle ein
        batterie.appendChild(segment);
    }
}

// Schreibt einen Text Buchstabe für Buchstabe in ein Element
// "element" = wo der Text erscheinen soll
// "text" = der komplette Text, der geschrieben werden soll
// "fertig" = eine optionale Funktion, die läuft, sobald alles geschrieben ist
function schreibeText(element, text, fertig) {
        // Zählt, beim wievielten Buchstaben wir gerade sind
    let position = 0

    function naechsterBuchstabe() {
        if (position < text.length) {
            element.textContent = text.substring(0, position + 1);
            position = position + 1

            setTimeout(naechsterBuchstabe, 40);
        }
        else if (fertig) {
            fertig();
        }
    }
    naechsterBuchstabe();
}
 
// Wird aufgerufen, wenn ein Segment mit Index "index" angeklickt wird
function segmentAnklicken(index) {
    // Nur reagieren, falls GENAU das nächste, dran-fällige Segment geklickt wurde
    // (verhindert, dass man spätere, noch leere Segmente überspringen kann)
    if (index !== gefuellteSegmente) {
        return; // falsches Segment geklickt -> nichts tun
    }

    // Bricht ab, falls schon alle Segmente voll sind
    if (gefuellteSegmente >= anzahlSegmente) {
        return;
    }

    // Holt sich ALLE Segmente als Liste
    const alleSegmente = document.querySelectorAll(".segment");
    // Wählt das gerade geklickte Segment aus
    const geklicktesSegment = alleSegmente[gefuellteSegmente - 1];

    // Füllt es optisch (dunkle Farbe)
    geklicktesSegment.classList.add("gefuellt");
    // Entfernt das Blinken, da es jetzt fertig ist
    geklicktesSegment.classList.remove("naechstes");

    // Erhöht den Fortschritts-Zähler um 1
    gefuellteSegmente = gefuellteSegmente + 1;

    // Speichert den neuen Fortschritt dauerhaft
    speichereFortschritt();

    // Prüft, ob jetzt ALLE Segmente gefüllt sind
    if (gefuellteSegmente >= anzahlSegmente) {
        zeigeUeberraschung();
    } else {
        // Sonst: lässt das NÄCHSTE Segment blinken
        aktualisiereBlinken();
    }
}

// Sorgt dafür, dass genau das aktuell nächste leere Segment blinkt
function aktualisiereBlinken() {
    // Holt sich alle Segmente
    const alleSegmente = document.querySelectorAll(".segment");

    // Entfernt das Blinken erstmal von ALLEN (sauberer Reset)
    alleSegmente.forEach(function(segment) {
        segment.classList.remove("naechstes");
    });

    // Fügt das Blinken nur beim aktuell nächsten, leeren Segment hinzu
    // (nur falls noch nicht alles voll ist)
    if (gefuellteSegmente < anzahlSegmente) {
        alleSegmente[gefuellteSegmente].classList.add("naechstes");
    }
}

// Blendet die Überraschung ein
function zeigeUeberraschung() {
    // Entfernt die Klasse "versteckt", dadurch wird der Bereich sichtbar
    ueberraschung.classList.remove("versteckt");
    resetButton.classList.remove("versteckt");
    schreibeText(ueberraschungText, "So fleißig! Du hast eine Überraschung freigeschaltet.", function(){
        ueberraschungLink.classList.remove("versteckt");
    });
}

// Speichert den aktuellen Fortschritt in localStorage
function speichereFortschritt() {
    localStorage.setItem("akkuFortschritt", gefuellteSegmente);
}

// Lädt einen zuvor gespeicherten Fortschritt beim Start der Seite
function ladeFortschritt() {
    const gespeichert = localStorage.getItem("akkuFortschritt");

    if (gespeichert !== null) {
        gefuellteSegmente = parseInt(gespeichert);

        const alleSegmente = document.querySelectorAll(".segment");

        // Färbt rückwirkend so viele Segmente ein, wie schon gespeichert waren
        for (let i = 0; i < gefuellteSegmente; i++) {
            alleSegmente[i].classList.add("gefuellt");
        }

        if (gefuellteSegmente >= anzahlSegmente) {
            zeigeUeberraschung();
        } else {
            // Lässt das nächste, noch offene Segment blinken
            aktualisiereBlinken();
        }
    } else {
        // Beim allerersten Besuch: das erste Segment soll direkt blinken
        aktualisiereBlinken();
    }
}

// Läuft sofort beim Laden der Seite: baut die leeren Segmente auf
erstelleSegmente();
// Läuft sofort danach: stellt ggf. gespeicherten Fortschritt wieder her
ladeFortschritt();
schreibeText(startText, "Diese Batterie ist dein ADHD Helper. Gehe zum Sport und klicke das Element an, um das Geheimnis zu lüften!");

function zuruecksetzen() {
    
    localStorage.removeItem("akkuFortschritt");
    gefuellteSegmente = 0;
    const alleSegmente = document.querySelectorAll(".segment");
    alleSegmente.forEach(function(segment) {
                       segment.classList.remove("gefuellt");
                       segment.classList.remove("naechstes");
                   });
    ueberraschung.classList.add("versteckt");
    resetButton.classList.add("versteckt");
    aktualisiereBlinken();
}

resetButton.addEventListener("click", zuruecksetzen);

                          
                    
