const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

var ballRadius = 50;
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;

$("#addStudent").on("click", () => {
  const studentName = $("#studentName").val();
  circles.add(studentName);
});

function drawCircle(c) {
  ctx.beginPath();
  ctx.arc(c.x, c.y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = c.color;
  ctx.fill();

  ctx.fillStyle = c.textColor;
  ctx.font = "30px Comic Sans MS";
  ctx.fillText(c.studentName, c.x, c.y);
  ctx.textAlign = "center";
}

const circles = {
  items: [], // array of circles
  add(studentName) {
    var circle;
    var circleColor = getRandomColor();
    const velocidad = 5;
    circles.items.push(
      (circle = {
        x: getRandomStartValue(),
        y: 100,
        ballRadius,
        studentName,
        textColor: invertColor(circleColor),
        color: circleColor,
        velocidad,
        dx: 2, // delta x and y (movement per frame
        dy: -2,
      })
    );
    $("#studentsList").append(
      `<div class="studentItem">
        <span>${studentName}</span>
        <span class="item-color" style="background-color: ${circleColor};"></span>
    </div>`
    );
    return circle;
  },
  update() {
    console.log(this);
    var c;
    for (let i = 0; i < circles.items.length; i++) {
      c = circles.items[i]; // get the circle

      if (c.x + c.dx > canvas.width - ballRadius || c.x + c.dx < ballRadius) {
        c.dx = -c.dx;
      }
      if (c.y + c.dy > canvas.height - ballRadius || c.y + c.dy < ballRadius) {
        c.dy = -c.dy;
      }

      c.x += c.dx;
      c.y += c.dy;
      // Verificar y manejar colisiones con otros círculos
      for (let otherCircle of circles.items) {
        if (otherCircle !== c) {
          detectarColision(c, otherCircle);
        }
      }
    }

    return circles;
  },
  draw() {
    var c;
    for (let i = 0; i < circles.items.length; i++) {
      c = circles.items[i]; // get the circle
      drawCircle(c);
    }
    return circles;
  },
};
function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getRandomStartValue() {
  const min = Math.ceil(ballRadius);
  const max = Math.floor(canvas.width - ballRadius);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

function invertColor(hex, bw) {
  if (hex.indexOf("#") === 0) {
    hex = hex.slice(1);
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error("Invalid HEX color.");
  }
  var r = parseInt(hex.slice(0, 2), 16),
    g = parseInt(hex.slice(2, 4), 16),
    b = parseInt(hex.slice(4, 6), 16);
  if (bw) {
    // https://stackoverflow.com/a/3943023/112731
    return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? "#000000" : "#FFFFFF";
  }
  // invert color components
  r = (255 - r).toString(16);
  g = (255 - g).toString(16);
  b = (255 - b).toString(16);
  // pad each with zeros and return
  return "#" + padZero(r) + padZero(g) + padZero(b);
}

function padZero(str, len) {
  len = len || 2;
  var zeros = new Array(len).join("0");
  return (zeros + str).slice(-len);
}

// Función para verificar colisión y hacer que los círculos reboten
function detectarColision(circulo1, circulo2) {
  // Calcula la distancia entre los círculos
  const distancia = Math.sqrt(
    Math.pow(circulo2.x - circulo1.x, 2) + Math.pow(circulo2.y - circulo1.y, 2)
  );

  // Si los círculos se sobreponen
  if (distancia < 2 * circulo1.ballRadius) {
    // Calcula el ángulo de colisión
    const angulo = Math.atan2(circulo2.y - circulo1.y, circulo2.x - circulo1.x);

    // Calcula la cantidad de corrección necesaria
    const correccion = (2 * circulo1.ballRadius - distancia) / 2;

    // Calcula las correcciones en las coordenadas x e y
    const correccionX = Math.cos(angulo) * correccion;
    const correccionY = Math.sin(angulo) * correccion;

    // Actualiza la posición de los círculos para evitar la superposición y separarlos
    circulo1.x -= correccionX;
    circulo1.y -= correccionY;
    circulo2.x += correccionX;
    circulo2.y += correccionY;

    // Invierte las direcciones de movimiento
    const tempDx = circulo1.dx;
    const tempDy = circulo1.dy;
    circulo1.dx = circulo2.dx;
    circulo1.dy = circulo2.dy;
    circulo2.dx = tempDx;
    circulo2.dy = tempDy;
  }
}

function mainLoop(time) {
  if (canvas.width !== innerWidth || canvas.height !== innerHeight) {
    // resize canvas if window size has changed
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0); // set default transform
  ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas
  circles.update().draw();
  requestAnimationFrame(mainLoop);
}
requestAnimationFrame(mainLoop);
