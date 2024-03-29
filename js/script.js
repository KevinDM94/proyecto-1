const URL =
  "https://gist.githubusercontent.com/bertez/2528edb2ab7857dae29c39d1fb669d31/raw/4891dde8eac038aa5719512adee4b4243a8063fd/quiz.json";

// Función asincrona, hace la petición y nos devuelve los datos en formato JSON.
async function fetchJSON() {
  try {
    const response = await fetch(URL);
    return await response.json();
  } catch (error) {
    console.error(error.message);
  }
}

// Se encarga de gestionar el orden en que se ejecuta el programa llamando a fetchJSON() y createElementsFromArray(jsonArray)
//Estas funciones son llamadas en un orden específico para asegurar que se obtengan los datos desde la URL y se creen los elementos en el DOM en el orden correcto.
async function main() {
  const jsonArray = await fetchJSON();
  createElementsFromArray(jsonArray);
}
main();

// Se encarga de crear los elementos del DOM a partir del array de datos.
function createElementsFromArray(jsonArray) {
  let currentQuestion = 0;
  let articles = [];
  let score = 0;
  if (jsonArray) {
    const value = jsonArray.map((entries, i) => {
      const question = entries.question;
      const answers = entries.answers;
      const correct = entries.correct;
      const indexQuestions = i;
      return { question, answers, correct, indexQuestions };
    });

    const section = document.querySelector("section");
    if (section) {
      value.forEach((element) => {
        const index = Object.keys(jsonArray).findIndex(
          (key) => jsonArray[key].question === element.question
        );

        if (element.indexQuestions === index) {
          const article = document.createElement("article");
          const header = document.createElement("header");
          const main = document.createElement("main");
          const questionTitleH2 = document.createElement("h2");
          const divQuestions = document.createElement("div");
          const figure = document.createElement("figure");
          const indexImage = index.toString().padStart(2, "0");
          const image = document.createElement("img");
          const scoreContainer = document.createElement("div");
          const textScore = document.createElement("h2");
          const imgScore = document.createElement("img");

          articles.push(article);

          textScore.textContent = `${score}/50`;

          section.appendChild(article);
          article.appendChild(header);
          article.appendChild(main);
          header.appendChild(questionTitleH2);
          header.appendChild(scoreContainer).classList.add("scoreContainer");
          scoreContainer.appendChild(textScore).classList.add("textScore");
          scoreContainer.appendChild(imgScore).classList.add("imgScore");
          main.appendChild(divQuestions).classList.add("questions");
          main.appendChild(figure);
          figure.appendChild(image);

          article.style.display = index === currentQuestion ? "block" : "none";
          questionTitleH2.textContent = `${index + 1}. ${element.question}`;
          image.src = `img/questions-images/question-${indexImage}.png`;
          image.alt = "caratula de pelicula";

          imgScore.src = "img/bomb.svg";
          imgScore.alt = "bomba puntuación";

          element.answers.forEach((answer) => {
            const buttonAnswers = document.createElement("button");
            buttonAnswers.textContent = answer;
            divQuestions.appendChild(buttonAnswers);

            buttonAnswers.addEventListener("click", () => {
              if (answer === element.correct) {
                score++;
                textScore.textContent = `${score}/50`;
                buttonAnswers.style.backgroundColor = "#0aaf0a"; //verde oscuro
                Array.from(divQuestions.children).forEach((btn) => {
                  if (btn !== buttonAnswers) {
                    btn.style.backgroundColor = "#ce1818";
                  } //rojo claro
                  btn.setAttribute("disabled", true);
                });
              } else {
                buttonAnswers.style.backgroundColor = "#880000"; // rojo oscuro
                Array.from(divQuestions.children).forEach((btn) => {
                  if (btn.textContent === element.correct) {
                    btn.style.backgroundColor = "#0aaf0a"; //verde oscuro
                  } else if (btn !== buttonAnswers) {
                    btn.style.backgroundColor = "#ce1818"; //rojo claro
                  }
                  btn.setAttribute("disabled", true);
                });
              }
              setTimeout(() => {
                if (currentQuestion < value.length - 1) {
                  currentQuestion++;
                  articles[currentQuestion].style.display = "block";
                  articles[currentQuestion - 1].style.display = "none";
                }
              }, 500);
            });
          });
        }
      });
    }
  }
}
