const nodes = {
  // ... (bez zmian, ta sama zawartość co wcześniej, zachowaj w całości ten obszar)
  // Pełne drzewo pytań i wyborów jak wcześniej
  start: {
    icon: "fa-solid fa-comment-dots",
    question: "Z jakim obszarem psychologicznym masz obecnie największe wyzwanie?\n\nWybierz najbardziej aktualny dla Ciebie temat:",
    choices: [
      { icon: "fa-solid fa-bolt", text: "Stres i lęk", next: "stress" },
      { icon: "fa-solid fa-user-slash", text: "Niska samoocena / krytyka siebie", next: "selfcrit" },
      { icon: "fa-solid fa-clock-rotate-left", text: "Chaos emocjonalny / przeszłość", next: "past" },
      { icon: "fa-solid fa-seedling", text: "Brak poczucia obfitości / radości", next: "abundance" },
      { icon: "fa-solid fa-masks-theater", text: "Relacje z ludźmi / role społeczne", next: "roles" },
    ],
  },
  // ... dalsze węzły dokładnie takie same jak we wcześniejszym main.js
  // Pełną zawartość drzewka proszę zostawić bez zmian
};

// Referencje do elementów DOM
const questionEl = document.getElementById("question");
const choicesEl = document.querySelector(".choices");
const summaryEl = document.getElementById("summary");
const downloadBtn = document.getElementById("download-btn");
const restartBtn = document.getElementById("restart-btn");
const modeToggle = document.getElementById("modeToggle");
const rolesEdu = document.getElementById("rolesEdu");

let currentNodeKey = "start";
let userPath = [];
let userNotes = [];

// Funkcja renderująca obecny węzeł gry
function renderNode(key) {
  const node = nodes[key];
  let iconHTML = node.icon ? `<span class="questionIcon"><i class="${node.icon}"></i></span>` : '';
  questionEl.innerHTML = iconHTML + node.question.replace(/\n/g, '<br>');
  choicesEl.innerHTML = "";
  summaryEl.hidden = true;
  downloadBtn.hidden = true;
  restartBtn.hidden = true;
  rolesEdu.hidden = !node.showRolesEdu;

  if (key !== "summary") {
    node.choices.forEach(choice => {
      const btn = document.createElement("button");
      btn.classList.add("choice-btn");
      btn.innerHTML = `<i class="choiceIcon ${choice.icon}"></i>${choice.text}`;
      btn.addEventListener("click", () => {
        userPath.push({ step: node.question, choice: choice.text });
        if (["role_prac", "past_accept", "abundance", "gratitude", "inspiration"].includes(key)) {
          const inputVal = prompt("Chcesz coś dodać / zapisać swoją odpowiedź do raportu? (opcjonalnie):");
          if (inputVal) userNotes.push({ step: node.question, note: inputVal });
        }
        if (choice.next === "start") restartGame();
        else renderNode(choice.next);
      });
      choicesEl.appendChild(btn);
    });
    questionEl.hidden = false;
    choicesEl.hidden = false;
  }

  if (key === "summary") {
    summaryEl.hidden = false;
    let summaryHtml =
      `<b><i class="fa-solid fa-user-pen"></i> Twój Raport Rozwoju:</b><br><br>` +
      userPath.map((p, i) =>
        `<div style="margin:0.3em 0;"><b>Krok ${i + 1}:</b> <span>${p.step.split('\n')[0]}</span><br><span style="color:#4266bb;">Twój wybór:</span> <b>${p.choice}</b></div>`
      ).join("") +
      (userNotes.length
        ? `<br><b>Uwagi i Twoje przemyślenia:</b><br>` +
          userNotes.map(
            n =>
              `<div style="margin-bottom:0.5em;"><span style="color:#42519e;"><b>${n.step.split('\n')[0]}:</b></span> <i>${n.note}</i></div>`
          ).join("")
        : "") +
      `<br><br><b><i class="fa-solid fa-magic"></i> Rekomendowane praktyki i porady:</b>
      <ul>
        <li><i class="fa-solid fa-lungs"></i> Praktyka oddechu 9D – głębokie, świadome oddychanie i rozluźnienie ciała</li>
        <li><i class="fa-solid fa-brain"></i> Codziennie 3 minuty uważności (mindfulness), vipassana 5+ minut</li>
        <li><i class="fa-solid fa-masks-theater"></i> Obserwuj własne role i przekonania. Rozpoznawaj, które są Twoje, a które narzucone. Uwalniaj się od nie swoich ról!</li>
        <li><i class="fa-solid fa-hands-praying"></i> Ćwicz wdzięczność: zapisuj codziennie 3 rzeczy, które doceniasz i 3, które chcesz rozwinąć</li>
        <li><i class="fa-solid fa-bahai"></i> Opuść nierealistyczne oczekiwania, powtarzaj sobie: "Akceptuję siebie w pełni, niezależnie od przeszłości"</li>
        <li><i class="fa-solid fa-star"></i> Twórz wizję inspirującej przyszłości, z obfitością i świadomymi wyborami</li>
      </ul>
      <br><b>Twoja zmiana zachodzi poprzez codzienne wybory i praktyki!</b>`;
    summaryEl.innerHTML = summaryHtml;
    downloadBtn.hidden = false;
    restartBtn.hidden = false;
    questionEl.hidden = true;
    choicesEl.hidden = true;
    rolesEdu.hidden = true;
  }
}

function restartGame() {
  currentNodeKey = "start";
  userPath = [];
  userNotes = [];
  renderNode(currentNodeKey);
}

restartBtn.addEventListener("click", restartGame);

window.addEventListener('load', () => {
  downloadBtn.onclick = function() {
    const element = document.getElementById("summary");
    element.style.display = "block"; // wymuś widoczność
    const opt = {
      margin:       0.5,
      filename:     'Raport-Rozwoj-Psychologiczny.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save().catch(err => {
      alert("Błąd podczas generowania PDF: " + err);
    });
  };

  modeToggle.onclick = () => {
    document.body.classList.toggle("dark");
    modeToggle.innerHTML = document.body.classList.contains("dark")
      ? '<i class="fas fa-sun"></i>'
      : '<i class="fas fa-moon"></i>';
  };

  renderNode(currentNodeKey);
});
