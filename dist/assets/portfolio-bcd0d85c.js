import"./modulepreload-polyfill-3cfb730f.js";const s=[{title:"Die letzte Zuflucht",category:"Redaktionelle Reportage · Video",summary:"Eine Reportage über Menschen, die im digitalen Raum Halt suchen und deren Geschichten oft übersehen werden. Mit Interviews, Bildsprache und klarer Dramaturgie.",role:"Recherche, Interviews, Dramaturgie und Schnittkonzept",tags:["Reportage","Video","Storytelling"],image:"https://images.pexels.com/photos/8774464/pexels-photo-8774464.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",alt:"Dunkler Schnittplatz mit mehreren Monitoren"},{title:"TikTok-Kanal",category:"Social Media · Short-Form-Video",summary:"Ein eigener Kanal für Geschichten im Hochformat: von Konzept und Einstieg bis zur Community-Interaktion und Auswertung der Reichweite.",role:"Konzept, Content-Produktion und Community-Management",tags:["TikTok","Strategie","Live-Formate","Community"],image:"https://images.pexels.com/photos/6953836/pexels-photo-6953836.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",alt:"Smartphone auf Stativ beim Aufnehmen eines Videos"},{title:"Fullstack-Websites",category:"Webentwicklung · UX/UI · Design",summary:"Websites von der ersten Skizze bis zum fertigen Auftritt, mit klarer Struktur, sauberem Design und responsiven Layouts.",role:"Konzeption, Frontend-Entwicklung und Umsetzung",tags:["Frontend","UX/UI","Responsive Design"],image:"https://images.pexels.com/photos/574069/pexels-photo-574069.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",alt:"Person programmiert auf einem Laptop"},{title:"metamagix",category:"Softwareentwicklung · Produktdesign",summary:"Ein Softwareprojekt, in dem Gestaltung und Technik eng zusammenarbeiten: von der Oberfläche bis zur Struktur der Anwendung.",role:"Frontend und Produktdesign im Team",tags:["Software","Design","Agile Entwicklung"],image:"https://images.pexels.com/photos/7172650/pexels-photo-7172650.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",alt:"Schreibtisch mit zwei Monitoren, Tastatur und Maus"},{title:"Die Presse – Interviews & Social Media",category:"Journalismus · Interviews · Social Media",summary:"Interviews und Berichte für die Redaktion sowie die Aufbereitung der Beiträge für Social-Media-Kanäle.",role:"Recherche, Interviewführung und Social-Media-Aufbereitung",tags:["Journalismus","Interviews","Social Media"],videos:["DdvblPmIz26","Dd6qUFyhkcM"],image:"https://images.pexels.com/photos/10464787/pexels-photo-10464787.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",alt:"Reporterin mit Mikrofon neben einem Übertragungswagen"}],l=document.querySelector("[data-spotlight-slides]"),n=document.querySelector("[data-spotlight-dots]"),c=document.querySelector("[data-spotlight-counter]"),u=document.querySelector("[data-spotlight-prev]"),d=document.querySelector("[data-spotlight-next]"),p=document.querySelector("[data-project-list]"),m=document.querySelector("[data-project-count]"),a=e=>String(e).padStart(2,"0");l.innerHTML=s.map((e,t)=>`
      <article class="spotlight__slide" aria-roledescription="Folie" aria-label="${t+1} von ${s.length}">
        <div class="spotlight__media">
          <img src="${e.image}" alt="${e.alt}" />
          <span class="spotlight__badge">Featured</span>
        </div>
        <div class="spotlight__body">
          <p class="spotlight__meta">${e.category}</p>
          <h3 class="spotlight__title">${e.title}</h3>
          <p class="spotlight__summary">${e.summary}</p>
          <a href="#projekt-${t+1}" class="spotlight__link">Zum Projekt <span aria-hidden="true">&rarr;</span></a>
        </div>
      </article>`).join("");n.innerHTML=s.map((e,t)=>`<button type="button" class="spotlight__dot" data-dot="${t}" aria-label="Projekt ${t+1}: ${e.title}"></button>`).join("");p.innerHTML=s.map((e,t)=>`
      <li class="project" id="projekt-${t+1}">
        <span class="project__number">${a(t+1)}</span>
        <div class="project__body">
          <p class="project__meta">${e.category}</p>
          <h3 class="project__title">${e.title}</h3>
          <p class="project__summary">${e.summary}</p>
          <p class="project__role"><span>Meine Rolle:</span> ${e.role}</p>
          <ul class="project__tags">${e.tags.map(o=>`<li>${o}</li>`).join("")}</ul>
          <div class="project__videos">${(e.videos??[]).map(o=>`
            <div class="project__video">
              <iframe src="https://www.instagram.com/reel/${o}/embed" title="Instagram Reel" loading="lazy" allowtransparency="true" allowfullscreen></iframe>
            </div>`).join("")}</div>
        </div>
      </li>`).join("");m.textContent=`${s.length} Projekte`;const g=l.querySelectorAll(".spotlight__slide"),h=n.querySelectorAll(".spotlight__dot");let i=0;function r(e){i=(e+s.length)%s.length,g.forEach((t,o)=>{t.hidden=o!==i}),h.forEach((t,o)=>{t.classList.toggle("is-active",o===i),t.setAttribute("aria-current",o===i?"true":"false")}),c.textContent=`${a(i+1)} / ${a(s.length)}`}u.addEventListener("click",()=>r(i-1));d.addEventListener("click",()=>r(i+1));n.addEventListener("click",e=>{const t=e.target.closest("[data-dot]");t&&r(Number(t.dataset.dot))});r(0);
