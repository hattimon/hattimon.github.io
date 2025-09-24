const nodes = {
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
  stress: {
    icon: "fa-solid fa-bolt",
    question: "Jak często odczuwasz napięcie i trudności z rozluźnieniem?\n",
    choices: [
      { icon: "fa-regular fa-calendar", text: "Codziennie lub prawie codziennie", next: "stress_practice" },
      { icon: "fa-regular fa-calendar-days", text: "Sporadycznie", next: "stress_practice" },
      { icon: "fa-solid fa-heart", text: "Rzadko", next: "choose_depth" },
    ],
  },
  stress_practice: {
    icon: "fa-solid fa-wind",
    question: "Chcesz spróbować praktyki oddechu 9D (Deep Breath) lub krótkiej medytacji uważności?\nKażda praktyka uspokaja umysł, rozluźnia ciało.",
    choices: [
      { icon: "fa-solid fa-lungs", text: "Oddech 9D", next: "breath9D" },
      { icon: "fa-solid fa-brain", text: "Mindfulness / Vipassana", next: "mindfulness_intro" },
      { icon: "fa-solid fa-backward", text: "Nie, wracam do wyboru", next: "choose_depth" },
    ],
  },

  breath9D: {
    icon: "fa-solid fa-lungs",
    question: "Oddech 9D: wyobraź sobie 9 cykli bardzo głębokiego powolnego oddechu.\nPo każdym oddechu uwalniaj napięcie z dowolnej części ciała. Zauważ zmianę stanu.\nMożesz robić tę praktykę codziennie, nawet przez 1 minutę.",
    choices: [
      { icon: "fa-solid fa-check", text: "Tak, ukończyłem praktykę!", next: "choose_depth" },
      { icon: "fa-solid fa-brain", text: "Trudno mi się skupić", next: "mindfulness_intro" },
    ],
  },

  mindfulness_intro: {
    icon: "fa-solid fa-brain",
    question: "Mindfulness/Vipassana: skup się przez minutę na oddechu i odczuciach w ciele, obserwuj przepływ myśli bez ocen.\nChcesz pogłębić praktykę?",
    choices: [
      { icon: "fa-solid fa-arrow-up", text: "Chcę pogłębić praktykę", next: "mind_detail" },
      { icon: "fa-solid fa-backward", text: "Nie, wracam do wyboru", next: "choose_depth" }
    ]
  },

  mind_detail: {
    icon: "fa-solid fa-eye",
    question: "Vipassana: praktykuj nieosądzającą obserwację swojego stanu emocjonalnego przez 5 minut.\nPozwól emocjom być obecnymi.\nJak się czujesz?",
    choices: [
      { icon: "fa-solid fa-heart", text: "Uspokojony/a, akceptuję swój stan", next: "choose_depth" },
      { icon: "fa-solid fa-user-slash", text: "Nadal napięty/a, proszę o wsparcie", next: "selfcrit" }
    ]
  },

  selfcrit: {
    icon: "fa-solid fa-user-slash",
    question: "Czy zauważasz wewnętrznego krytyka lub negatywne myśli o sobie?\nTo zdrowe je zauważyć. Zastanów się:",
    choices: [
      { icon: "fa-solid fa-brain", text: "Często mnie to przytłacza", next: "role_obs" },
      { icon: "fa-regular fa-face-meh", text: "Sporadycznie, ale wiem kiedy się pojawia", next: "role_obs" },
      { icon: "fa-solid fa-heart", text: "Rzadko lub wcale", next: "gratitude" },
    ],
  },

  role_obs: {
    icon: "fa-solid fa-masks-theater",
    question: "Obserwacja ról:\nW jakich rolach najczęściej siebie krytykujesz?\nPAMIĘTAJ:\nNie jesteś swoimi rolami! Rozpoznaj własne role, obserwuj jak na nie reagujesz i akceptuj je.\nKtóre role są Twoje, a które narzucone przez innych? Ucz się je rozróżniać i stopniowo uwalniać.",
    showRolesEdu: true,
    choices: [
      { icon: "fa-solid fa-list-check", text: "Potrafię nazwać swoje role", next: "role_prac" },
      { icon: "fa-solid fa-wand-magic-sparkles", text: "Nie, chcę się tego nauczyć", next: "role_prac" }
    ]
  },

  role_prac: {
    icon: "fa-solid fa-table-list",
    question: "Zapisz mentalnie 2-3 role, w których masz najsilniejsze oczekiwania wobec siebie (np. pracownik, rodzic, przyjaciel).\nKtóre z nich czujesz jako swoje, a które narzucone?\nRozpoznanie to klucz do uwolnienia.",
    choices: [
      { icon: "fa-solid fa-check", text: "Zidentyfikowałem/am moje role", next: "acceptance" },
      { icon: "fa-solid fa-wand-magic-sparkles", text: "Nie wiem, proszę o wzór", next: "role_wzor" }
    ]
  },

  role_wzor: {
    icon: "fa-regular fa-lightbulb",
    question: "Wzór:\n- Pracownik: boję się oceny\n- Partner: mam oczekiwanie doskonałości\n- Dziecko: ukrywam emocje\nNadaj własne określenia swoim rolom i powiedz, które są autentyczne.",
    choices: [
      { icon: "fa-solid fa-circle-check", text: "Jestem gotowy/-a kontynuować", next: "acceptance" },
      { icon: "fa-solid fa-backward", text: "Wracam do ról ogólnie", next: "roles" }
    ]
  },

  acceptance: {
    icon: "fa-solid fa-face-smile",
    question: "Zaakceptuj to, co wyłoniło się w obserwacji.\nNie musisz spełniać cudzych oczekiwań, by być wartościowy/-a.\nAkceptuję siebie w roli/autentyczności.",
    choices: [
      { icon: "fa-solid fa-hands-praying", text: "Praktyka wdzięczności", next: "gratitude" },
      { icon: "fa-solid fa-route", text: "Obserwacja obfitości", next: "abundance" }
    ]
  },

  past: {
    icon: "fa-solid fa-clock-rotate-left",
    question: "Czy często wracasz myślami do przeszłości, traumy, trudnych doświadczeń?\nSpróbuj złapać dystans mentalny.",
    choices: [
      { icon: "fa-solid fa-face-sad-tear", text: "Tak, to częste", next: "past_accept" },
      { icon: "fa-solid fa-face-smile", text: "Nie, raczej skupiam się na teraźniejszości", next: "acceptance" }
    ]
  },

  past_accept: {
    icon: "fa-solid fa-unlock",
    question: "Zaakceptuj przeszłość:\nNapisz mentalnie co chciałbyś uwolnić, zaakceptować.\nJesteś kimś więcej niż swoją przeszłością.",
    choices: [
      { icon: "fa-solid fa-forward", text: "Przechodzę dalej", next: "inspiration" },
      { icon: "fa-solid fa-hands-praying", text: "Potrzebuję wdzięczności", next: "gratitude" }
    ]
  },

  abundance: {
    icon: "fa-solid fa-seedling",
    question: "Co lubisz w swoim życiu, co chciałbyś rozwinąć?\nCo Cię ogranicza?\nObserwacja poczucia obfitości to praktyka otwartości.",
    choices: [
      { icon: "fa-solid fa-arrow-up", text: "Chcę podzielić się tym co rozwinąć", next: "gratitude" },
      { icon: "fa-solid fa-hands-praying", text: "Najpierw praktyka wdzięczności", next: "gratitude" }
    ]
  },

  gratitude: {
    icon: "fa-solid fa-hands-praying",
    question: "Praktyka wdzięczności:\nWymień mentalnie 3 rzeczy, za które jesteś wdzięczny/-a.\nJak się czujesz po tej praktyce?",
    choices: [
      { icon: "fa-regular fa-face-smile", text: "Czuję lekkość, radość", next: "inspiration" },
      { icon: "fa-regular fa-face-frown", text: "Czuję opór, trudno mi", next: "choose_depth" }
    ]
  },

  roles: {
    icon: "fa-solid fa-masks-theater",
    showRolesEdu: true,
    question: "Jaką ważną rolę obecnie pełnisz i jakie masz z nią trudności lub co chciałbyś w niej rozwinąć?\nRozpoznanie roli to pierwszy krok do autentyczności.",
    choices: [
      { icon: "fa-solid fa-magnifying-glass", text: "Widzę trudności, chcę lepiej siebie rozumieć", next: "role_obs" },
      { icon: "fa-solid fa-lightbulb", text: "Chcę inspiracji i rozwoju", next: "inspiration" }
    ]
  },

  inspiration: {
    icon: "fa-solid fa-star",
    question: "Wyobraź sobie siebie przyszłego/przyszłą z pełnym poczuciem obfitości, lekkości i inspiracji.\nCo jest Twoim największym potencjałem?\nPrzejść do raportu?",
    choices: [
      { icon: "fa-solid fa-file-pdf", text: "Tak, zakończ i wygeneruj raport", next: "summary" },
      { icon: "fa-solid fa-arrow-rotate-left", text: "Od nowa", next: "start" }
    ]
  },

  choose_depth: {
    icon: "fa-solid fa-shuffle",
    question: "Chcesz przejść przez kolejną rundę praktyk?\nAlbo zakończyć z indywidualnym raportem?",
    choices: [
      { icon: "fa-solid fa-arrow-rotate-left", text: "Kolejna runda", next: "start" },
      { icon: "fa-solid fa-file-pdf", text: "Zakończ i wygeneruj raport", next: "summary" }
    ]
  },

  summary: {
    icon: "fa-solid fa-file-pdf",
    question: "To koniec ścieżki!\nPoniżej zobaczysz Twój indywidualny raport i rekomendacje praktyk.\nMożesz pobrać go jako PDF.",
    choices: [
      { icon: "fa-solid fa-arrow-rotate-left", text: "Rozpocznij od początku", next: "start" }
    ]
  }
};

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

downloadBtn.onclick = function() {
  const element = document.getElementById("summary");
  element.style.display = "block"; // upewniamy się, że jest widoczny

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
