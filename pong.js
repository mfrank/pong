<html>
   <head>
      <title>Pong</title>
    <script type="text/javascript"> 
       
       var hoehe = 350;
       var breite = 700;                                  // Höhe und Breite des Feldes
  
start = function() {
    Feld = new FeldN({ hoehe: hoehe, breite: breite });
    document.body.appendChild(Feld);

    Netz = new NetzN({                                    
        x: breite / 2,                            // Wo wird das Netz erstellt
        y: 0
    }, {
        hoehe: hoehe,                        // Höhe und Breite des Netzes
        breite: 2
    }, 40);
    Feld.appendChild(Netz);

    Ball = new BallN(
      {			               
        x: 4,
        y: 3
      }, {
        x: 4,
        y: 3
         }, 10);
    Feld.appendChild(Ball);

    var size = 
      {
        hoehe: 75,
        breite: 15
      };

//Erstellen der Schläger, Aussehen
                                                           
    SchlaegerL = new NSchlaeger({
        x: 15,
        y: (hoehe / 2 - 30)
    }, { hoehe: 75, breite: 15 });
    Feld.appendChild(SchlaegerL);

    SchlaegerR = new NSchlaeger({
        x: breite - 15 - 10,
        y: (hoehe / 2 - 30)
    }, { hoehe: 75, breite: 15 });
    Feld.appendChild(SchlaegerR);

//Es werden zwei Anzeigen für die Treffer erstellt

    AnzeigeL = new AnzeigeN({ x: breite / 4, y: 5 }, { breite: 20, hoehe: 40 });
    AnzeigeL.setValue(0);
    Feld.appendChild(AnzeigeL);
    AnzeigeR = new AnzeigeN({ x: 3 * breite / 4, y: 5 }, { breite: 20, hoehe: 40 });
    AnzeigeR.setValue(0);
    Feld.appendChild(AnzeigeR);

    Timer = new TimerN(10, update);
}

window.onload = start;

//Spielfeld wird erstellt

BlockN = function(position, size, c) {
    var block = document.createElement("div");
    block.style.position = "absolute";
    block.style.width = size.breite + 'px';
    block.style.height = size.hoehe + 'px';
    block.style.top = position.y + 'px';
    block.style.left = position.x + 'px';
    block.style.backgroundColor = c;
    return block;
}

//Farbe des Spielfeldes und Koordinaten für Aufbau

FeldN = function(size) {
    var block = new BlockN({ x: 15, y: 15 }, size, "green");
    return block;
}

//Eigenschaften des Netzes, "gepunktete" Linie

NetzN = function(position, size, nodash) {                 
    block = new BlockN(position, size, "green");
    block.p = position;
    block.s = size;
    for (i = 0; i < nodash; i++) {

        Strich = new BlockN({ x: 0, y: i * 2 * block.s.hoehe / (2*nodash) }, { hoehe: size.hoehe / (2 * nodash), breite: size.breite }, "white");
        block.appendChild(Strich);
    }
    return block;
};

//Eigenschaften des Balls, Geschwindigkeit, Position

BallN = function(position, velocity, radius) {
    block = new BlockN(position, { hoehe: radius, breite: radius }, "white");
    block.p = position;
    block.v = velocity;
    block.r = radius;
 block.move = function()
      {
        this.p.x += this.v.x;                                
        this.p.y += this.v.y;
        this.style.top = this.p.y + 'px';
        this.style.left = this.p.x + 'px';

//Überprüfen, ob der Ball einen Spielfeldrand berührt

        this.play = 0;
        if (this.p.x + this.r > parseInt(this.parentNode.style.width))
            this.play = 1;
        if (this.p.x < 0)
            this.play = 2;
        if (this.p.y + this.r > parseInt(this.parentNode.style.height))
            this.v.y = -this.v.y;
        if (this.p.y < 0)
            this.v.y = -this.v.y;
        return this.play;
    };
    return block;
};

//Objekte für Schläger

NSchlaeger = function(position, size) {
    block = BlockN(position, size, "white");
    block.p = position;
    block.s = size;
    block.move = function(d) {
        this.p.y += d;
        this.style.top = this.p.y + 'px';
    };

//Methode, die überprüft, ob der Schläger den Ball trifft

    block.trifft = function(B) 
      {
        if (((B.p.x + B.r) >= this.p.x) && (B.p.x <= (this.p.x + this.s.breite))) {
            if (B.p.y >= this.p.y && B.p.y <= (this.p.y + this.s.hoehe)) {
                B.v.x = -B.v.x;
            }
        }
    }
    return block;
};

TimerN = function(tick, code) {
    this.timer = window.setInterval(code, tick);
    this.clearTimer = function() {
        window.clearInterval(this.timer)
    };
}

update = function() {                        //Ball bewegt sich, überprüfen, ob der Ball im Spiel ist und ob ein Schläger den Ball trifft
    var zustand = Ball.move();                  
    if (zustand != 0) 
     {
        Timer.clearTimer();
        if (zustand == 1) {
           AnzeigeL.setValue(AnzeigeL.value + 1);
        } else {
            AnzeigeR.setValue(AnzeigeR.value + 1);
        }
        if (AnzeigeL.value == 9 || AnzeigeR.value == 9) {            //wenn ein Spieler 9 Punkte erreicht hat, endet das Spiel
            Timer.clearTimer()
       } else {
            NeueRunde();
        }
    }

    SchlaegerL.trifft(Ball);
    SchlaegerR.trifft(Ball);
}

SchlaegerUpdate = function(e) {                                        //Bewegung der Schläger
    var e = window.event ? event : e;
    if (e.keyCode) { key = e.keyCode; }
    else if (typeof (e.which) != 'undefined') { key = e.which; }

    switch (key) {       

        case (115):                                        // taste s
            SchlaegerL.move(10);                               // schlaeger nach unten
            break;
        case (119):                                        // taste w
            SchlaegerL.move(-10);                              // schlaeger nach oben
            break; 
        case (107):                                        // taste k
            SchlaegerR.move(-10); 
            break;
        case (109):                                        // taste m
            SchlaegerR.move(10);
            break;
    }
}

document.onkeypress = SchlaegerUpdate;

//Der Punktestand soll in einer 7-Segment-Anzeige angezeigt werden, dazu werden 7 Objekte erstellt

AnzeigeN = function(position, size) {
    block = new BlockN(position, size, "green");
    block.p = position;
    block.s = size;
    block.score = 0;
    block.Strich = [];
 
//Erstellen der horizontalen Striche

   for (i = 0; i < 3; i++) {
        block.Strich[i] = new BlockN({ x: 1, y: (i * block.s.hoehe / 2) }, { hoehe: 3, breite: block.s.breite - 2 }, "white");
        block.appendChild(block.Strich[i]);
    }

//Erstellen der vertikalen Striche

    for (i = 0; i < 2; i++) {

        block.Strich[i + 3] = new BlockN({ x: 0, y: i * block.s.hoehe / 2 + 4 }, { hoehe: block.s.hoehe / 2 - 5, breite: 3 }, "white");
        block.appendChild(block.Strich[i + 3]);
        block.Strich[i + 5] = new BlockN({ x: block.s.breite - 3, y: i * block.s.hoehe / 2 + 4 }, { hoehe: block.s.hoehe / 2 - 5, breite: 3 }, "white");
        block.appendChild(block.Strich[i + 5]);
    }

//Mit Hilfe des Arrays werden die angezeigten Striche grün und die restlichen weiß, insgesamt 10 Anzeigen für 0 - 9

var On=new Array(
      [0, 2, 3, 4, 5, 6],
      [3, 4],
      [0, 5, 1, 4, 2],
      [0, 5, 1, 2, 6],
      [1, 3, 5, 6],
      [0, 1, 2, 3, 6],
      [1, 2, 3, 4, 6],
      [0, 5, 6],
      [0, 1, 2, 3, 4, 5, 6],
      [0, 1, 3, 5, 6]);
    block.setValue = function(value) {
        this.value = value;

        for (i = 0; i < 7; i++) {
            this.Strich[i].style.backgroundColor = "green";
        }
        for (i in On[value]) {
            this.Strich[On[value][i]].style.backgroundColor = "white";
        }

    }

    return block;
};

//bei einem Treffer geht der Ball zurück auf die Startposition

NeueRunde = function() {

    Ball.p = { x: 8, y: 6};
    Ball.v = { x: 8, y: 6};
    Timer = new TimerN(20, update);
}

</script>
</head>
 <body>
   <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

   <TABLE BORDER=5 bgcolor=green>
     <TR align=center>
       <TD><font color=white>Steuerung</TD>
       <TD><font color=white>Spieler 1</TD>  
       <TD><font color=white>Spieler 2</TD>
     </TR>
     <TR align=center>
       <TD><font color=white>Nach oben</TD>
       <TD><font color=white>W</TD>
       <TD><font color=white>K</TD>
     </TR>
     <TR align=center>
       <TD><font color=white>Nach unten</TD>
       <TD><font color=white>S</TD>
       <TD><font color=white>M</TD>
     </TR>
   </TABLE>
 </body>
</html>