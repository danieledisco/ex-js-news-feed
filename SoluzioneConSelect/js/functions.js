/**
 * dateUS2EU 
 * Funzione per trasformare la data dal formato anglosassone (yyy-mm-dd) in 
 * in quello europeo (dd/mm/yyyy)
 * 
 * @param {string} date in formato US (yyyy-mm-dd)
 * @returns {string} uscita in formato europeo (dd/mm/yyyy) 
 */
function dateUS2EU(date)
{
    // Separiamo i vari campi della data
    const dateUS = date.split("-");

    // Riordiniamo i precedenti campi nel formato europeo
    const dateEU = dateUS[2] + '/' + dateUS[1] + '/' + dateUS[0];

    return dateEU;
}

/**
 * displayPage
 * Questa funzione mostra le news in magina nella prima fase
 * iniziale, quando la pagina vieme aperta
 * @param {onjects} array 
 * @param {string} text 
 */
function displayPage(array, text)
{
    // Si cancella il DOM
    mainElement.innerHTML = "";

    // Caso in cui la select è 'all'
    if (text === 'all')
    {
        // Si crea il murkup della news e si aggancia all'elemento main
        for(let i = 0; i < news.length; i++)
        {
            const item = array[i];
    
            const markupNews = createMarkupNews(item)
            
            mainElement.innerHTML += markupNews;
    
            // Si cotruisce la sezione delle tags e si aggancia all'elemento main
            const tagsElement = generateTagsElement(item);
            mainElement.appendChild(tagsElement);
        }
    }
    else
    {
        // Caso tutte le altre voci presenti nelle options della select
        for(let i = 0; i < news.length; i++)
        {
            // Si seleziona l'elemento i-esimo dell'array delle news
            const obj = array[i];

            // Dall'oggetto se ne estraggono i tags (potrebbero essere più di uno)
            const tags = extractTags(obj);

            // Si cicla sui tags per verificare se la news ha un tag uguale a quello 
            // presente nella select
            for ( let j = 0; j < tags.length; j++ )
            {
                if ( tags[j] === text)
                {
                    // Uno dei tags nella news coincide con quello della select
                    // Si visualizza la news in pagina e si incrementa la variabile 
                    // displayed per indicare che non bisogna indicare che la 
                    // selezione ha restituito un insieme vuoto 
                    displayNewsInSelect(obj);
                    displayed++;
                }
                else
                {
                    // l'i-esimao tag non coincide con quello presente nella slect ed allora
                    // si passa agli altri tags presenti nella news
                    continue;
                }
            }
        }
    }
}


/**
 * createMarkupNews
 * A paretire dal markup che dovrebbe avere una news,
 * si genera l'elemento della DOM usando come parametri le varie proprietà
 * dell'oggetto (news) in ingresso.
 * La funzione restituisce il marlup valorizzato
 * @param {object} item 
 * @returns markupNews
 */
function createMarkupNews(item)
{
    const markupNews = 
    `<div class="news">
    <div class="titleNewsBox">
        <div class="titleNews">
            ${item.title}
       </div>
        <div class="bookmark">
            <i id='bookM' onclick=funcBook(this) data-id=${item.id} class="${item.bookmarked ? 'fa-solid' : 'fa-regular'}  fa-bookmark"></i>
        </div>
    </div>
    <div class="published">
            Pubblicato da ${item.author}
    </div>
    <div class="dated">
        in data ${dateUS2EU(item.published)}
    </div>
    <div class="content">
        ${item.content}
    </div>
    <img src=${item.photoLocation} alt=${item.altPhoto}>
    `;

    return markupNews;
}

/**
 * displayNewsInSelect
 * Funzione che accetta in ingresso 
 * un elemento dell'array news e 
 * ne costruiche prima il markup e poi la sezione tags
 * infine questi elementi sono agganciati ak main
 * @param {object} item 
 */
function displayNewsInSelect(item)
{

    const markupNews = createMarkupNews(item)
    mainElement.innerHTML += markupNews;

    const tagsElement = generateTagsElement(item);
    mainElement.appendChild(tagsElement);
}


/**
 * generateTagsElement
 * Questa funzione creal l'ultima sezione delle news ossia la 
 * parte relativa ai tags
 * Accetta in ingresso la news e sulla base dei suoi tags li inserisce in pagina 
 * @param {object} item è uno degli elementi di news
 * @returns {object} elemento tagsElement da agganciare successivamente dopo le news al main
 */
function generateTagsElement(item)
{

    // Creato l'elemento tagsELement a cui si aggiunge la
    // classe 'tags'
    const tagsElement = document.createElement('div');
    tagsElement.className = 'tags';

    // Per tutti i tags si crea un tagElement che viene valorizzato
    // sia della parte css sia del nome e del background color
    for(let i = 0; i < item.tags.length; i++)
    {
        const tagElement = document.createElement('div');
        tagElement.innerHTML += item.tags[i];
        tagElement.className = 'tag';
        tagElement.style.backgroundColor = item.tagsColor[i];
        tagsElement.appendChild(tagElement);
    }

    return tagsElement;
}


/**
 * extractTags
 * Data una news (item), ne estrae tutti i suoi tags e li restituisce
 * in un array di stringhe outARray
 * @param {object} item 
 * @returns outArray: strings array
 */
function extractTags(item)
{
    let outArray = [];
    for ( let i=0; i<item.tags.length; i++)
    {
        outArray.push(item.tags[i]);
    }
    return outArray;
}

/**
 * eliminateArrayDuplicate
 * Questa funzione processa l'array di stringhe in ingresso e ne elimina
 * i duplicati. L'array restituito contiene gli elementi in ingresso ma con 
 * una sola occorrenza.
 * @param {array} inArray is an array with element present more time
 * @returns {array} outArray 
 */
function eliminateArrayDuplicate(inArray)
{
    let outArray=[];
    for(let i = 0; i < inArray.length; i++)
    {
        if(!outArray.includes(inArray[i]))
          outArray.push(inArray[i]);
    }

    return outArray;
}

/**
 * funcBook
 * Funzione invocata quando si fa click con il mouse
 * sull'icona del bookmark della news per renderla la news
 * salvata
 * Tramite la funzionalità del data-attribute, è possibile risalire
 * all'id della news che rispetto all'indice dell'array delle news 
 * ha un'unità in più.
 * In questo modo è possibile risalire alla news di interesse per attribuiore
 * alla proprietà bookmarked il valore true
 * @param {element} bookNews 
 */
function funcBook(bookNews)
{
    // Selezioniamo l'id della news su di cui si è cliccato il bookmark
    let idNews = bookNews.getAttribute("data-id");

    // Recuperiamo il valore della slect per definire quali elementi visualizzare
    text = selectEl.options[selectEl.selectedIndex].text;

    // Rendiamo true la proprietà bookmarked
    news[idNews-1].bookmarked = true;
    
    // Ridisegnamo la pagina per cabiare aspetto alle icone bookmark
    displayPage(news,text);

    // Rininizializziamo l'array newsBookmarked[] con gli indici degli array salvati 
    collectNewsBookmarked();
}

/**
 * collectNewsBookmarked
 * Funzione che ogni volta cancella e rinizializza
 * l'array contenente gli indici delle news salvate ()
 */
function collectNewsBookmarked()
{
    // Inizializzazione dell'array newsBookmarked
    newsBookmarked = [];

    // Ciclo per inseire nell'array gli indici degli elementi salbati
    for (let i=0; i<news.length; i++)
    {
        if (news[i].bookmarked)
            newsBookmarked.push(i);
    }
}

/**
 * generateSelect
 * Funzione che crea la select.
 * Prima si costruise la label 'Filtra per tags:'
 * poi la select a cui si da un id e poi si agganciano tutte le options
 * con i vari nomi estratti dalle news (più la vece all ed alcune tags non presenti)
 */
function generateSelect()
{
    // Sezione label
    const labelElement = document.createElement('div');
    labelElement.className = "labelSelect";
    labelElement.innerHTML += "Filtra per Tags:";
    selectBoxEl.append(labelElement); 
    
    // Sezione select
    selectEl = document.createElement('select');
    selectEl.id = 'selectType';
    
    // Creazione ed aggancio all'elemento select delle options corrispondenti alla lista delle tags
    for(let i=0; i<newsTags.length; i++)
    {
       	// Creiamo option della select
	    const opt = document.createElement("option");
	    // Valorizziamo value con l'indice i del for
	    opt.value = i;
	    // Inseriamo l'elemento della select
	    opt.innerHTML = newsTags[i];

	    // Agganciamo la option alla select creata
	    selectEl.appendChild(opt); 
    }
    selectBoxEl.appendChild(selectEl);
}

/**
 * generateCheckBox
 * Funzione che genera la checkbox.
 * Prima si genera la checkbox a cui si aggiunge un id
 * ed un valore di inizializzazione poi 
 * la label 'Solo news salvate'
 */
function generateCheckBox()
{
    checkEl = document.createElement('input');
    checkEl.type = 'checkbox';
    checkEl.id = 'checkType';
    checkEl.checked = false;
    checkEl.style.accentColor = ('orange');
    checkBoxEl.appendChild(checkEl); 

    // Sezione label
    const labelElement = document.createElement('div');
    labelElement.className = "labelSelect";
    labelElement.innerHTML += "Solo news salvate";
    checkBoxEl.append(labelElement); 
}

/**
 * generateNoNewsAvailable
 * Se a causa delle selezioni fatte non vi siano news da visualizzare, 
 * questa funzione avvisa l'utente tramita la dicitura:
 * 'Nessuna news per la selezione effettuata' 
 */
function generateNoNewsAvailable()
{
    const warningEl = document.createElement('div');
    warningEl.className = 'warning';
    warningEl.innerHTML += "Nessuna news per la selezione effettuata";
    mainElement.append(warningEl);
}

/**
 * selectForLoop
 * Funzione che considerando il valore selezionato dalla select 
 * (passato in input) e se la checkbox è selezionata oppure no,
 * decide se visualizzare o meno un elemento in pagina sulla
 * base delle sue caratteristiche
 * @param {string} text 
 */
function selectForLoop(text) 
{
    // Ciclo su tutte le news
    for (let i = 0; i < news.length; i++) 
    {
        // estrazione dell'i-esimo elemento
        const obj = news[i];

        // Se
        // select       -> all
        // checkbox     -> selected
        // news salvata 
        // Si visualizza in pagina e si incrementa displayed
        if (text === 'all' && checkEl.checked && obj.bookmarked) 
        {
            displayNewsInSelect(obj);
            displayed++;
        }
        // Se
        // select       -> all
        // checkbox     -> not selectef
        // Si visualizza in pagina e si incrementa displayed
        else if (text === 'all' && !checkEl.checked) 
        {
            displayNewsInSelect(obj);
            displayed++;
        }
        else 
        {
            // Siamo nel caso in cui la select ha una tag singola
    
            // Si estraggono tutte le tag dalla news
            const tags = extractTags(obj);
            // Si cicla sulle tags estratte per verificare se c'è corrispondenza con la select
            for (let j = 0; j < tags.length; j++) 
            {
                // Se la j-esima tag coincide con la select....
                if (tags[j] === text) 
                {
                    // ... bisogna verificare se la checkbox è selezionata
                    // e se la corrispondente news è salvata.
                    // In questo caso si visualizza la news ed incrementa displayed
                    if (checkEl.checked && obj.bookmarked) 
                    {
                        displayNewsInSelect(obj);
                        displayed++;
                    }
                    // Se la checkbox non è selezionata si visualizza la news ed incrementa displayed
                    else if  (!checkEl.checked) 
                    {
                        displayNewsInSelect(obj);
                        displayed++;                        
                    }
                    // Altrimenti si passa alla tags seguente
                    else
                    {
                        continue
                    }
                }
                // se la j-esima tags non coincide con la select si passa alla tag seguente
                else 
                {
                    continue;
                }
            }
        }
    }
}