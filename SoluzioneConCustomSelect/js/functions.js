/**
 * dateUS2EU(date) 
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
 * displayPage(array, text)
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
                    // numNewsDisplayed per indicare che non bisogna indicare che la 
                    // selezione ha restituito un insieme vuoto 
                    displayNewsInSelect(obj);
                    numNewsDisplayed++;
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
 * createMarkupNews(item)
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
 * displayNewsInSelect(item)
 * Funzione che accetta in ingresso 
 * un elemento dell'array news e 
 * ne costruisce prima il markup e poi la sezione tags
 * infine questi elementi sono agganciati al main
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
 * generateTagsElement(item)
 * Questa funzione crea l'ultima sezione delle news ossia la 
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
 * extractTags(item)
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
 * eliminateArrayDuplicate(inArray)
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
 * funcBook(bookNews)
 * Funzione invocata quando si fa click con il mouse
 * sull'icona del bookmark della news per renderla la news salvata.
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

    console.log('cliccato ' + idNews);

    // Recuperiamo il valore della slect per definire quali elementi visualizzare
    text = newsTags[indexTagSelected];
    // Rendiamo true la proprietà bookmarked
    news[idNews-1].bookmarked = true;
    
    // Ridisegnamo la pagina per cabiare aspetto alle icone bookmark
    displayPage(news,text);

    // Rininizializziamo l'array newsBookmarked[] con gli indici degli array salvati 
    collectNewsBookmarked();
}

/**
 * collectNewsBookmarked()
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
 * generateCheckBox()
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
 * generateNoNewsAvailable()
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
 * selectForLoop(text)
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
        // Si visualizza in pagina e si incrementa numNewsDisplayed
        if (text === 'all' && checkEl.checked && obj.bookmarked) 
        {
            displayNewsInSelect(obj);
            numNewsDisplayed++;
        }
        // Se
        // select       -> all
        // checkbox     -> not selected
        // Si visualizza in pagina e si incrementa numNewsDisplayed
        else if (text === 'all' && !checkEl.checked) 
        {
            displayNewsInSelect(obj);
            numNewsDisplayed++;
        }
        else 
        {
            // Siamo nel caso in cui la select ha una tag diversa da all
    
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
                    // In questo caso si visualizza la news ed incrementa numNewsDisplayed
                    if (checkEl.checked && obj.bookmarked) 
                    {
                        displayNewsInSelect(obj);
                        numNewsDisplayed++;
                    }
                    // Se la checkbox non è selezionata si visualizza la news ed incrementa numNewsDisplayed
                    else if  (!checkEl.checked) 
                    {
                        displayNewsInSelect(obj);
                        numNewsDisplayed++;                        
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

/**
 * generateCustomSelect()
 * Funzione che crea la custom select.
 */
function generateCustomSelect()
{
    /**
     * Si crea l'elemento label e si valorizza e lo si appende a selectBoxEl
     */
    const labelElement = document.createElement('div');
    labelElement.className = "labelSelect";
    labelElement.innerHTML += "Filtra per Tags:";
    selectBoxEl.append(labelElement); 
    
    /** 
     * - Nel file scripts.js si costruisce il container per la finestrella della select che conterrà la voce selezionata e
     *      l'icona della freccia in giù (cSelectedEl)
     * - Si costruisce il container dell'intera custom select: containerSelectEl
     * - Quindi si crea l'elemento che visualizza la selezione in pagina: slectedEl e lo si valorizza con il valore "all"
     *      quando l'applicazione parte la custom select avrà come selezione "all"
     * - Si crea l'icona della freccia in giù tipica delle select selectedElIcon
     * - Si agganciano selectedEl e selectedIconEl al loro container cSelectedEl e questo ultimo si aggancia a l'intero
     *      container della select containerSelectEl. Questo ultimo di aggancia a selectBox presente nell'html
     */
    containerSelectEl = document.createElement('div');
   
    const selectedEl = document.createElement('div');
    selectedEl.id = 'idSelected';
    selectedEl.innerHTML += 'all';

    const selectedElIcon = document.createElement('i');
    selectedElIcon.classList.add('fa-solid')
    selectedElIcon.classList.add('fa-chevron-down')
    selectedElIcon.style.paddingRight = '0.5rem';
    selectedElIcon.style.width = '30px';
    cSelectedEl.appendChild(selectedEl);
    cSelectedEl.appendChild(selectedElIcon);
    containerSelectEl.appendChild(cSelectedEl);
    selectBoxEl.appendChild(containerSelectEl);

    /**
     * - Si crea il container del dropdowm menu e gli si aggiunge un id
     * - Per tutti i tags presenti in newsTags si creano dei container
     *      per contenere il tag stesso ed una eventuale icona di spunta
     *      per indixare la selezione attuale nel dropdouw menu
     * - Per ognuno di questi container si attribuisce un identifier costruito come:
     *      'id'+i in questo modo + facilmente richiamabile per cambiare il suo background
     * - Si crea poi l'elemento che conterrà la spunta
     * - Quindi si costruise l'icona di spunta. Anche a questa di attribuise un identifier simile
     *      al precedente dei container 'ic'+i per poterli individuare e renderli visibili o invisibili
     * - La selezione degli elementi allora è:
     * 
     *          containerTagsBoxEl 
     *                  tagsBoxEl 
     *                  tagsBoxCheckEl 
     *                          iconEl
     * - Si attacca tutto a containerTagsBoxEl
     */
    containerTagsEl = document.createElement('div');
    containerTagsEl.id = 'containerTags';

    for(let i=0; i<newsTags.length; i++)
    {
        const containerTagsBoxEl = document.createElement('div');
        containerTagsBoxEl.className ='containerTagsBox';
        containerTagsBoxEl.id = 'id' + i;
        const tagsBoxEl = document.createElement('div');
        tagsBoxEl.className = 'tagsBox';
        tagsBoxEl.innerText = newsTags[i];
        containerTagsBoxEl.appendChild(tagsBoxEl);

        const tagsBoxCheckEl = document.createElement('div');
        tagsBoxCheckEl.className = 'tagsBoxCheck';

        const iconEl = document.createElement('i');
        iconEl.classList.add('fa-solid');
        iconEl.classList.add('fa-check');
        iconEl.id = 'ic' + i;
        tagsBoxCheckEl.appendChild(iconEl);
        containerTagsBoxEl.appendChild(tagsBoxCheckEl);
        containerTagsEl.appendChild(containerTagsBoxEl)

        /**
         * A questo punto agli elementi tagsBoxEl si aggiungono gli eventi
         *      click       ==> quando si effettua una selezione
         *      mouseover   ==> quando si scorre con il mouse nel dropwoun menu
         * Nel primo caso si valorizza indexTagSelected con la i del for, 
         *      si cambia aspetto al corrispondente container del tag
         *      fondo arancione e scritte bianche e si nasconde tutto
         * 
         * Nel secondo caso si cambia aspetto al corrispondente tags su
         *      cui ci si trova
         */
        tagsBoxEl.addEventListener('click',function()
        {
            indexTagSelected = i;
            changeCSS_tagsBoxOnMouseClic(indexTagSelected)
        }); 
        tagsBoxEl.addEventListener('mouseover',function()
        {
            indextagsMouseOver = i;
            changeCSS_tagsBoxOnMouseOver(indextagsMouseOver);
        });
    }
    /**
     * Finito il loop si aggancia containerTagsEl a selectBoxEl
     */
    selectBoxEl.appendChild(containerTagsEl);
}


/**
 * changeCSS_tagsBoxOnMouseOver(index)
 * Funzione che cambia aspetto agli elementi presenti nel dropdown menu
 * L'elemento in questione è individuato del parametro di ingresso index.
 * Quando il mouse ci passa sopra il fondo diventa arancione e le scritte bianche
 * Tutte le altre sono fondo quello del dropdown menu e scritte nere
 * Nel loop quando si capita sulla tag selezionata la spunta è visibile altrimenti è nascosta
 * @param {number} index 
 */
function changeCSS_tagsBoxOnMouseOver(index)
{
    for (let i=0; i<newsTags.length; i++)
    {
        const elem = document.getElementById('id'+i);
        const icon = document.getElementById('ic'+i)
        if (index == i)
        {
            elem.style.color = 'white';
            elem.style.backgroundColor = 'orange';
            icon.style.color = 'white';    
        }
        else
        {
            elem.style.color = 'black';
            elem.style.backgroundColor = 'lightgray'; 
            icon.style.color = 'black';    
        }

        if(i == indexTagSelected)
           icon.style.visibility = 'visible'
        else
            icon.style.visibility = 'hidden'
    }
}

/**
 * changeCSS_tagsBoxOnMouseClic(index)
 * QUesta funzione agisce nel momento che si effettua una selezione di un tag nel
 * dropdown menu.
 * Agisce sia a livello di dropdown menu si a livello complessivo di pagina.
 * Il parametro di ingresso inndex rappresenta l'indice vel vettore dei tags selezionato
 * @param {number} index 
 */
function changeCSS_tagsBoxOnMouseClic(index)
{
    /**
     * Prima parte che agisce nel dropdown menu
     * - Vengono individuati i container delle tags e le icone di spunta
     * - Sulla base di index si cambia colore al fondo ed al testo
     * - Si nasconde tutto
     * - Si cambia nella finestrella della select in pagina il testo con la nuova selezione
     */
    for (let i=0; i<newsTags.length; i++)
    {
        const elem = document.getElementById('id'+i);
        const icon = document.getElementById('ic'+i)
        if (index == i)
        {
            elem.style.color = 'white';
            elem.style.backgroundColor = 'orange';    
        }
        else
        {
            elem.style.color = 'black';
            elem.style.backgroundColor = 'lightgray';    
        }
        icon.style.visibility = 'hidden';
        elem.style.visibility = 'hidden';
        containerTagsEl.style.visibility = 'hidden';
        const selectedElement = document.getElementById('idSelected')
        selectedElement.innerHTML = '';
        selectedElement.innerHTML += newsTags[index];
    }

    /**
     * Seconda parte che agisce a livello di pagina complessiva
     * - Si cancella la pagina
     * - Si inizializza il numero di new mostrate a 0
     * - Si seleziona l'attaule tags (indextagSelected coincide con index ma rende meglio l'idea) 
     * - Sulla base della selct e della checkbox la funzione selectForLoop mostra le news in pagina
     * - Se non ci sono news lo si comunica all'utente
     */
    mainElement.innerHTML = "";
    numNewsDisplayed = 0;   
    text = newsTags[indexTagSelected];       
    selectForLoop(text);
    if (numNewsDisplayed == 0) 
    {
        generateNoNewsAvailable();
    }
}
