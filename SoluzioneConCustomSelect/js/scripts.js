/**
 * Step 1: struttura dei dati
 * Partendo dai dati forniti crea le strutture dati necessarie sfruttando 
 * array e oggetti facendo attenzione agli attributi 
 * che caratterizzano ciascuna news.
 *
 *
 * Step 2 - Stampa dei dati in pagina
 * Prendendo come riferimento il layout di esempio presente nell'HTML 
 * stampa in pagina le news del nostro feed utilizzando JavaScript.
 * Alcune note:
 *  o è molto utile partire dalla creazione dei componenti html/css prima di utilizzarli come template; 
 *    in questo modo ci si concentra solo sulla struttura e consistenza della UI
 *  o ricorda che i template literal sono delle stringhe e come tali puoi effettuare task su di loro come 
 *    concatenarli fra di loro e comporre componenti più complessi
 *  o all’interno di un template literal è anche possibile inserire logiche e invocare funzioni; 
 *    ad es. sfruttando un operatore ternario per stampare pezzi di codice:
 *    ${image ? imageTpl(image) : '' }
 *  o la data è in formato americano yyyy-mm-dd e va formattata in formato dd-mm-yyyy
 * 
 * Step 3: filtri
 * Crea l’interfaccia dei filtri utilizzando tag di input appropriati. 
 * Recupera in JavaScript i valori selezionati dall’utente da utilizzare 
 * nel codice per le logiche di filtraggio degli elementi.
 * I filtri richiesti sono:
 * filtro per singolo tag
 * filtro per news salvate
 * Alcune note:
 * ogni volta che viene applicato un filtro dovresti aggiornare 
 * l’intera lista delle news in pagina
 * ci sono due criteri di filtraggio e devono coesistere; 
 * ma questo non significa che non puoi isolare le singole logiche 
 * dei filtri in piccole funzioni… 
 * considera la possibilità di popolare le opzioni della select dei tag 
 * dinamicamente ovvero tramite JavaScript
 * rivedi la documentazione sui campi di input e sui loro attributi
 * è sempre importante restituire all’utente un feedback 
 * su una azione: restituisci un messaggio nel caso in cui i filtri 
 * applicati ritornino un set di dati vuoto 
 * (in gergo viene chiamato “empty state”)
 *
 * Step 4: bookmark
 * Crea su ogni componente News un pulsante per il salvataggio della News.
 * Se clicchiamo l’icona bookmark, cambiamo l’aspetto dell’icona (es. da vuota a piena) e aggiungiamo 
 * l’id della News nell’array degli id delle news salvate.
 * L’id della news è un dato “nascosto” che vorrai inserire in pagina per recuperarlo in seguito al click dell’icona bookmark. 
 * Per farlo dovresti utilizzare un data-attribute.
 * In fase di stampa dell’elenco di news dovrai controllare se la news è salvata o meno per poter dare 
 * il giusto aspetto all’icona bookmark.
 * Alcune note:
 *  o potresti voler creare un secondo array in cui conservare la lista degli elementi salvati
 *  o per l’icona di salvataggio potresti utilizzare FontAwesome o un semplice file svg
 *  o ragiona su come potresti agganciare l’evento al tasto bookmark
 *  o ogni volta che elimini un elemento dal DOM tutti gli eventi ad esso associati vengono rimossi; 
 *    dovrai quindi trovare un modo per riagganciarli
 *  o per semplificarci le cose, una volta salvata una news non è più possibile rimuoverla o cliccare nuovamente sull’icona
 * 
 */

const news = 
[
    {
        id: 1,
        title: 'Scoperta di una nuova specie di papera di gomma',
        content: 'Scoperta di una nuova specie di papera di gomma.',
        tags: ['geo', 'tech'],
        tagsColor: ['#008001', '#000080'],
        author: 'Diana Rossi',
        photoLocation: './img/rubber-duck.jpg',
        altPhoto: 'Nuovo tipo di papera di gomma',
        published: '2023-02-11',
        bookmarked: false
    }
    ,
    {
        id: 2,
        title: 'Esplorando le profondità marine: il mistero degli abissi',
        content: 'Esplorando le profondità marine: il mistero degli abissi.',
        tags: ['viaggi', 'geo'],
        tagsColor: ['#f3a360', '#008001'],
        author: 'Fabio Mari',
        photoLocation: './img/deep-sea.jpg',
        altPhoto: 'Le acque blu di un fondare da scoprire carico di mistero',
        published: '2023-03-14',
        bookmarked: false
    }
    ,
    {
        id: 3,
        title: 'Viaggio culinario: alla ricerca dei sapori perduti',
        content: 'Esplorazione di tradizioni culinarie dimenticate e la ricerca di sapori autentici.',
        tags: ['cucina'],
        tagsColor: ['#800080'],
        author: 'Marta Bianchi',
        photoLocation: './img/kitchen-food.jpg',
        altPhoto: 'I piatti delle tradizioni culinarie dimenticate',
        published: '2023-04-20',
        bookmarked: false
    }
    ,
    {
        id: 4,
        title: 'Arte moderna: oltre i confini convenzionali',
        content: "Un'analisi delle tendenze e delle sfide nell'arte contemporanea, con interviste a artisti emergenti.",
        tags: ['arte', 'tech'],
        tagsColor: ['#ffd601', '#000080'],
        photoLocation: './img/modern-art.jpg',
        altPhoto: "Esempi di arte di strada: le tendenze nell'arte contemporanea",
        author: 'Gabriele Neri',
        published: '2023-05-29',
        bookmarked: false
    }
];

// Numero di news mostrate in pagina
let numNewsDisplayed;

// La voce selezionata della selelct
let text;

// Indice tag selezionato
let indexTagSelected = 0;

// Indice tag su cui si sta muovendo il mouse
let indextagsMouseOver;

// Contenitore della custom select
let containerTagsBoxEl;

// Elemento  main
const mainElement = document.getElementById('mainSite');

// Array che conterrà gli indici delle news "bookmarked"
let newsBookmarked = [];

// Elemento selectBox che conterrà tutta la cutmo select (elemento selezionato visibile in pagina e tutto il dropdown menu)
const selectBoxEl = document.getElementById('selectBox')

// Contenitore per la sola fionestrella visibile in pagina della custo mselect
const cSelectedEl = document.createElement('div');
cSelectedEl.id = 'containerSelected';
cSelectedEl.style.border = '2px solid black';

// Contenitore dell'intero dropdown menu della custom select
let containerTagsEl;

// Container dell'elemento selezionato nel dropdown menu
let containerSelectEl;

// Elemento che contiene la selezione della custom select ed è mostrata in pagina
let selectedEl;

// ELemento checkBoxEl che conterrà checkbox e label
const checkBoxEl = document.getElementById('checkBox')

// Elemento checkbox
let checkEl;


// Visualizziamo in pagina l'array news ed inizializziamo a
// news.length numNewsDisplayed 
displayPage(news, 'all');
numNewsDisplayed = news.length;

// Definiamo un array vuoto per accoglere i tags delle news
let newsTags = [];

// Inseriamo in newsTags _TUTTE_ le tags (anche i duplicati)
for (let i = 0; i < news.length; i++) 
{
    const item = news[i];
    let out;
    out = extractTags(item);
    for (let j = 0; j < out.length; j++)
        newsTags.push(out[j]);
}

// Rendiamo le tags delle news uniche
newsTags = eliminateArrayDuplicate(newsTags);

// Aggiungiamo alle tags, degli argomenti non presenti
newsTags.push('borsa');
newsTags.push('politica');
newsTags.push('biologia')

// Aggiungiamo in testa all
newsTags.unshift('all');


// creiamo l'elemento select
generateCustomSelect();


// Creiamo l'elemento checkbox
generateCheckBox()

/**
 * Event Listener per la custom select
 */
cSelectedEl.addEventListener('click', function()
{
    containerTagsEl.style.visibility = 'visible';
    icon = document.getElementById('ic'+indexTagSelected)
    icon.style.visibility = 'visible';
    for(let i=0; i<newsTags.length; i++)
    {
        const elem = document.getElementById('id'+i)
        elem.style.visibility = 'visible';
        if( i == indexTagSelected)
        {
            elem.style.backgroundColor = 'orange';
            elem.style.color = 'white';
            icon.style.color = 'white';
        }
    }
})

/**
 * Event Listener per la checkbox
 */
checkEl.addEventListener('change', function () 
{
    // Cancelliamo il DOM
    mainElement.innerHTML = "";

    // Selezioniamo l'attuale voce del select
    const text = newsTags[indexTagSelected];

    // Inizializziamo numNewsDisplayed a 0
    numNewsDisplayed = 0;

    // Se la checkbox è selzionata ...
    if (this.checked) 
    {
        // ... si cicla sulla lista degli elementi salvatoi
        for (let i = 0; i < newsBookmarked.length; i++) 
        {
            // si estrae la news salvata
            const obj = news[newsBookmarked[i]];

            // Se la selct è all si mostra in pagina e si incrementa numNewsDisplayed
            if (text === 'all') 
            {
                displayNewsInSelect(obj);
                numNewsDisplayed++;
            }
            else 
            {
                // La select è una delle tante tags

                // Si estraggono le tags nalla news
                const tags = extractTags(obj);

                // Si cicla sulle tags per confrontarle con la select
                for (let j = 0; j < tags.length; j++) 
                {
                    // se la j-esima tag coincide con la select,
                    // si mostra in pagina e si incrementa numNewsDisplayed
                    if (tags[j] === text) 
                    {
                        displayNewsInSelect(obj);
                        numNewsDisplayed++;
                    }
                    // Altrimenti si passa alla tag seguente
                    else 
                    {
                        continue;
                    }
                }
            }

        }
    }
    else 
    // Se la checkbox non è selezionata, si fa agire selectForloop che agirà sulla base
    // della selct e della checkbox
    {
        selectForLoop(text);
    }

    // Solito controllo se in pagina ci sono o meno news
    if (numNewsDisplayed == 0) 
    {
        generateNoNewsAvailable();
    }
}
)