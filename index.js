'use strict';

import './app/theme.js';
import { db } from './app/db.js';

const $ = element => document.querySelector(element)
const $$ = elements => document.querySelectorAll(elements)

/*————— Sidebar Elements ————————————————————————————————————————*/

const $sidebar = $('[data-sidebar]')
const $sidebarNavbar = $('[data-sidebar-navbar]')
const $sidebarOverlay = $('[data-sidebar-overlay]')
const $mainOverlay = $('[data-main-overlay]')

const $BTN_Notebook_Add = $('[data-notebook-add]')
const $BTN_Note_Add = $('[data-note-add]')
/*————— Header Elements ————————————————————————————————————————*/

const $headerTitle = $('[data-header-title]')

/*————— Modal Elements ————————————————————————————————————————*/

const $modal = $('[data-modal]')

// Notebook
const $modalNotebook_Add = $('[data-modal-notebook]')
const $INP_modalNotebook_Title = $('[data-modal-notebook] [data-notebook-title]')
const $BTN_modalNotebook_Cancel = $('[data-modal-notebook] [data-notebook-cancel]')
const $BTN_modalNotebook_Confirm = $('[data-modal-notebook] [data-notebook-add-confirm]')
const $BTN_editNotebook_Title = $('[data-notebook-edit]')

const $modalNotebook_Delete = $('[data-modal-notebook-delete]')
const $modalNotebook_Title = $('[data-modal-notebook-delete] [data-notebook-title]')
const $BTN_modalNotebookDelete_Cancel = $('[data-modal-notebook-delete] [data-notebook-cancel]')
const $BTN_modalNotebookDelete_Confirm = $('[data-modal-notebook-delete] [data-notebook-delete-confirm]')

// Note
const $modalNote_Add = $('[data-modal-note]')
const $INP_modalNote_Title = $('[data-modal-note] [data-note-title]')
const $INP_modalNote_Content = $('[data-modal-note] [data-note-content]')
const $BTN_modalNote_Cancel = $('[data-modal-note] [data-note-cancel]')
const $BTN_modalNote_Confirm = $('[data-modal-note] [data-note-add-confirm]')

const $modalNote_Delete = $('[data-modal-note-delete]')
const $modalNote_Title = $('[data-modal-note-delete] [data-note-title]')
const $BTN_modalNoteDelete_Cancel = $('[data-modal-note-delete] [data-note-cancel]')
const $BTN_modalNoteDelete_Confirm = $('[data-modal-note-delete] [data-note-delete-confirm]')


/*————— Main Elements ————————————————————————————————————————*/

const $notesPanel = $('[data-notes-panel]')
const $emptyNotes = $('[data-empty-notes]')
const $addNewNote = $('.note--add__new')

/**
 * Utils ☼————————————————————————————————————————————————————————
 */

const $BTN_sidebarToggler = $$('[data-sidebar-toggler]')
const $BTN_sidebarToggle = $('[data-sidebar] [data-sidebar-toggler]')

function addEventOnElements(elements, eventType, callback) {
    elements.forEach(element => element.addEventListener(eventType, callback));
}

addEventOnElements($BTN_sidebarToggler, 'click', () => {
    $sidebar.classList.toggle('active');
    $sidebarOverlay.classList.toggle('active');

    const isActive = $sidebar.classList.contains('active');
    
    if(!isActive)
        $BTN_sidebarToggle.setAttribute('disabled', true);
    else if (isActive)
        $BTN_sidebarToggle.removeAttribute('disabled');

    $sidebarOverlay.addEventListener('click', () => {
        HideSidebar();
    });
});

function SidebarActiveElement (item) {
    const $sidebarItems = $$('[data-item-notebook]');
    $sidebarItems.forEach((element) => {
        element.classList.remove('active');
    } );
    item.classList.add('active');
}

function HideSidebar () {
    $sidebar.classList.remove('active');
    $sidebarOverlay.classList.remove('active');
}

function TitleOfActiveElement (name) {
    $headerTitle.textContent = name
}

function DisableFeatures () {
    $BTN_editNotebook_Title.style.display = 'none';
    $BTN_Note_Add.style.display = 'none';
}

function EnableFeatures () {
    $BTN_editNotebook_Title.style.display = 'flex';
    $BTN_Note_Add.style.display = 'flex';
}

function getRelativeTime(ms) {

    const currentTime = new Date().getTime();

    const minute = Math.floor((currentTime - ms) / 1000 / 60)
    const hour = Math.floor(minute / 60);
    const day = Math.floor(hour / 24);

    return minute < 1 ? 'Ahora' : minute === 1 
        ? `Hace un minuto` : minute < 60 
        ? `Hace ${minute} minutos` : hour === 1 
        ? `Hace una hora` : hour < 24 
        ? `Hace ${hour} horas` : day === 1 
        ? `Ayer` : `Hace ${day} días`;
        // Donde dice "Hace ${day} días" Agregar la fecha completa 
}

/**
 * Client ☼———————————————————————————————————————————————————————
 */

DisableFeatures()

const client = {

    notebook: {
        create(notebookData) {
            const $navItem = NavItem(notebookData.id, notebookData.name);
            $sidebarNavbar.appendChild($navItem);
            SidebarActiveElement($navItem);
        },

        read(notebookList) {
            notebookList.forEach((notebookData, index) => {
                const $navItem = NavItem(notebookData.id, notebookData.name);
                $sidebarNavbar.appendChild($navItem);

                if( index === 0) {
                    SidebarActiveElement($navItem);
                    $headerTitle.textContent = notebookData.name
                }
            })
        },

        delete(notebookId) {
            notebookId.remove();
        }
    },
    note: {
        create(noteData) {
            const $cardItem = CardItem(noteData)
            const $BTN_addNewNote = $('.note--add__new');

            $BTN_addNewNote.after($cardItem)
        },

        read(noteList) {
            if( noteList.length > 0 ){
                $notesPanel.innerHTML = '';
                $notesPanel.prepend($addNewNote);
                $emptyNotes.classList.remove('active');
                
                noteList.forEach((note) => {
                    const $cardItem = CardItem(note);
                    const $BTN_addNewNote = $('.note--add__new');
                    $notesPanel.append($cardItem)    // insertBefore($cardItem, $BTN_addNewNote)
                });
            } else {
                $notesPanel.innerHTML = '';
                $notesPanel.prepend($addNewNote);
                $emptyNotes.classList.add('active');
            }
            // Aplicar un evento al btn de eliminar nota
        },

        update(noteId, noteData) {
            const $oldCard = document.querySelector(`[data-item-note="${noteId}"]`);
            const $newCard = CardItem(noteData);            
            $notesPanel.replaceChild($newCard, $oldCard);
        }
    }
}

/**
 * NavItem ☼————————————————————————————————————————————————————————
 */

const NavItem = function (id, name) {
    const NavItem = document.createElement('div')
    NavItem.classList.add('navbar__item')
    NavItem.setAttribute('data-item-notebook', id)
    NavItem.innerHTML = /*HTML*/`
        <h3 class="navbar__item--title" data-notebook-title>${name}</h3>
        <nav class="navbar__item--btn">
            <button title="Eliminar" data-notebook-delete>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m19.5 5.5l-.62 10.025c-.158 2.561-.237 3.842-.88 4.763a4 4 0 0 1-1.2 1.128c-.957.584-2.24.584-4.806.584c-2.57 0-3.855 0-4.814-.585a4 4 0 0 1-1.2-1.13c-.642-.922-.72-2.205-.874-4.77L4.5 5.5M3 5.5h18m-4.944 0l-.683-1.408c-.453-.936-.68-1.403-1.071-1.695a2 2 0 0 0-.275-.172C13.594 2 13.074 2 12.035 2c-1.066 0-1.599 0-2.04.234a2 2 0 0 0-.278.18c-.395.303-.616.788-1.058 1.757L8.053 5.5m1.447 11v-6m5 6v-6" color="currentColor" />
                </svg>
            </button>
        </nav>
    `;
    
    EnableFeatures()

    NavItem.addEventListener('click', () => {
        SidebarActiveElement(NavItem);
        $headerTitle.textContent = NavItem.textContent
        $headerTitle.removeAttribute('contenteditable');
        HideSidebar();
        EnableFeatures()

        const noteList = db.get.note(id);
        client.note.read(noteList);
    });

    const $BTN_deleteNotebook = NavItem.querySelector('[data-notebook-delete]')

    $BTN_deleteNotebook.addEventListener('click', () => {
        // db.delete.notebook(id);
        modal.notebookDel.Activated()
        $modalNotebook_Title.textContent = name;
        NavItem.setAttribute('delete', '');
    });

    return NavItem;
}

/**
 * Header Title ☼————————————————————————————————————————————————————————
 */

$BTN_editNotebook_Title.addEventListener('click', () => {
    $headerTitle.setAttribute('contenteditable', '');
    $headerTitle.focus();
})

$headerTitle.addEventListener('keydown', (event) => {

    if( event.key === 'Enter') {
        $headerTitle.removeAttribute('contenteditable');
        
        let NavItemTitle = $('.active[data-item-notebook] > [data-notebook-title]');
        let NavItemId = $('.active[data-item-notebook]');
        
        let name = $headerTitle.textContent.toString().trim();
        let id = NavItemId.getAttribute('data-item-notebook');
        
        NavItemTitle.textContent = name
        const updateNotebookData = db.update.notebook(id, name);
    }
})

/**
 * CardItem ☼————————————————————————————————————————————————————————
 */

const CardItem = function (noteData) {

    let { id, title, text, postedOn, notebookId } = noteData;

    const CardItem = document.createElement('div')
    CardItem.classList.add('note');
    CardItem.setAttribute('data-item-note', id)
    CardItem.innerHTML = /*HTML*/`
        <header>
            <h3 data-note-title>${title}</h3>
        </header>
        <p>${text}</p>
        <footer>
            <span class="date">${getRelativeTime(postedOn)}</span>
            <nav class="note__item--btn">
                <button title="Eliminar" data-note-delete >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m19.5 5.5l-.62 10.025c-.158 2.561-.237 3.842-.88 4.763a4 4 0 0 1-1.2 1.128c-.957.584-2.24.584-4.806.584c-2.57 0-3.855 0-4.814-.585a4 4 0 0 1-1.2-1.13c-.642-.922-.72-2.205-.874-4.77L4.5 5.5M3 5.5h18m-4.944 0l-.683-1.408c-.453-.936-.68-1.403-1.071-1.695a2 2 0 0 0-.275-.172C13.594 2 13.074 2 12.035 2c-1.066 0-1.599 0-2.04.234a2 2 0 0 0-.278.18c-.395.303-.616.788-1.058 1.757L8.053 5.5m1.447 11v-6m5 6v-6" color="currentColor" />
                    </svg>
                </button>
            </nav>
        </footer>
    `;

    CardItem.addEventListener('click', () => {
        modal.noteAdd.Activated()
        $INP_modalNote_Title.value = title
        $INP_modalNote_Content.value = text

        CardItem.setAttribute('edit', '')
        $BTN_modalNote_Confirm.textContent = 'Editar'
        variableExterna = noteData
    })

    CardItem.querySelector('[data-note-delete]').addEventListener('click', (event) => {
        event.stopImmediatePropagation()

        modal.noteDel.Activated()
        $modalNote_Title.textContent = title
        CardItem.setAttribute('delete', '')
        variableExterna = noteData
    })

    return CardItem;
}

let variableExterna = {};

/**
 * DB Utils ☼—————————————————————————————————————————————————————
 */

function RenderExistedNotebook () {
    const/*:array*/ notebookList = db.get.notebook();
    client.notebook.read(notebookList);
    
}

RenderExistedNotebook();

function RenderExistedNote () {
    const $ActiveElement = $('[data-item-notebook].active');
    if ($ActiveElement) {
        const id = $ActiveElement.getAttribute('data-item-notebook');
        if (id) {
            const noteList = db.get.note(id);
            client.note.read(noteList);
        }
    }
};

RenderExistedNote ()

export function findNotebook (db, notebookId) {
    return db.notebooks.find(notebook => notebook.id === notebookId);
}

export function findNotebookIndex(db, notebookId) {
    return db.notebooks.findIndex(item => item.id === notebookId);
}

export function findNote(db, noteId) {
    let note;
    for (const notebook of db.notebooks) {
        note = notebook.notes.find(note => note.id === noteId);
        if (note) break;
    }
    return note;
}

export function findNoteIndex(notebook, noteId) {
    return notebook.notes.findIndex(note => note.id === noteId);
}

/**
 * Modal ☼——————————————————————————————————————————————————————
 */

const modal = {

    notebookAdd: {
        Activated() {
            $mainOverlay.classList.add('active');
            $modal.classList.add('open');
            $modalNotebook_Add.classList.add('visible');
        },
        Deactivated() {
            $mainOverlay.classList.remove('active');
            $modal.classList.remove('open');
            $modalNotebook_Add.classList.remove('visible');
            $INP_modalNotebook_Title.value = ''
        }
    },

    notebookDel: {
        Activated() {
            $mainOverlay.classList.add('active');
            $modal.classList.add('open');
            $modalNotebook_Delete.classList.add('visible');
        },
        Deactivated() {
            $mainOverlay.classList.remove('active');
            $modal.classList.remove('open');
            $modalNotebook_Delete.classList.remove('visible');
        }
    },

    noteAdd: {
        Activated() {
            $mainOverlay.classList.add('active');
            $modal.classList.add('open');
            $modalNote_Add.classList.add('visible');
        },
        Deactivated() {
            $mainOverlay.classList.remove('active');
            $modal.classList.remove('open');
            $modalNote_Add.classList.remove('visible');
            $INP_modalNote_Title.value = ''
            $INP_modalNote_Content.value = ''
        }
    },

    noteDel: {
        Activated() {
            $mainOverlay.classList.add('active');
            $modal.classList.add('open');
            $modalNote_Delete.classList.add('visible');
        },
        Deactivated() {
            $mainOverlay.classList.remove('active');
            $modal.classList.remove('open');
            $modalNote_Delete.classList.remove('visible');
        }
    }
};

/**
 * Modal > Create Notebook ☼——————————————————————————————————————————————————————
 */

$BTN_Notebook_Add.addEventListener('click', () => {
    modal.notebookAdd.Activated();
    $INP_modalNotebook_Title.focus();
    $INP_modalNotebook_Title.addEventListener('keydown', PushEnterNotebook);
    $INP_modalNotebook_Title.addEventListener('keydown', PushEscapeNotebook);
});

$BTN_modalNotebook_Confirm.addEventListener('click', () => {
    const NameNewNotebook = $INP_modalNotebook_Title.value
    CreateNewNotebook(NameNewNotebook);
    modal.notebookAdd.Deactivated();
    
    $notesPanel.innerHTML = '';
    $notesPanel.appendChild($addNewNote);
    $emptyNotes.classList.add('active');
});

$BTN_modalNotebook_Cancel.addEventListener('click', () => {
    modal.notebookAdd.Deactivated();
});

function CreateNewNotebook (name) {
    if( name.length === 0 ){
        name = 'Sin título'
    }
    const notebookData = db.post.notebook(name);
    client.notebook.create(notebookData);
    TitleOfActiveElement(name);
}

function PushEnterNotebook (event) {
    if (event.key === 'Enter') {
        const NameNewNotebook = $INP_modalNotebook_Title.value
        CreateNewNotebook(NameNewNotebook);
        modal.notebookAdd.Deactivated();
        
        $notesPanel.innerHTML = '';
        $notesPanel.appendChild($addNewNote);
        $emptyNotes.classList.add('active');
    }
}

function PushEscapeNotebook (event) {
    if (event.key === 'Escape') {
        modal.notebookAdd.Deactivated();
    }
}

/**
 * Modal > Drop Notebook ☼——————————————————————————————————————————————————————
 */

$BTN_modalNotebookDelete_Cancel.addEventListener('click', () => {
    const $sidebarNavbar_items = $$('[data-sidebar-navbar] [data-item-notebook]');
    $sidebarNavbar_items.forEach((item)=> {
        item.removeAttribute('delete');
    })
    modal.notebookDel.Deactivated();
});

$BTN_modalNotebookDelete_Confirm.addEventListener('click', () => {
    const $itemToDelete = $('[data-sidebar-navbar] [data-item-notebook][delete]');
    const id = $itemToDelete.getAttribute('data-item-notebook');
    
    db.delete.notebook(id);
    client.notebook.delete($itemToDelete)
    
    $headerTitle.textContent = "Notebook app"
    modal.notebookDel.Deactivated();
    DisableFeatures()
    $notesPanel.innerHTML = '';
    $emptyNotes.classList.remove('active');
})

/**
 * Modal > Create Notes ☼————————————————————————————————————————————————————————
 */

$BTN_Note_Add.addEventListener('click', () => {
    modal.noteAdd.Activated()
    $INP_modalNote_Title.addEventListener('keydown', PushEnterNote);
    $modalNote_Add.addEventListener('keydown', PushEscapeNote);
});

$BTN_modalNote_Cancel.addEventListener('click', () => {
    modal.noteAdd.Deactivated()
    $BTN_modalNote_Confirm.textContent = 'Guardar'
    const $Notes_items = $$('[data-item-note][edit]');
    $Notes_items.forEach((item) => {
        item.removeAttribute('edit');
    })
});

$BTN_modalNote_Confirm.addEventListener('click', () => {

    const $itemToEdit = $('[data-item-note][edit]');
    $emptyNotes.classList.remove('active');

    if($itemToEdit) {

        let { id, title, text, postedOn, notebookId } = variableExterna;

        variableExterna.title = $INP_modalNote_Title.value
        variableExterna.text = $INP_modalNote_Content.value
        variableExterna.postedOn = new Date().getTime();

        if(variableExterna.title === 'Sin título' || variableExterna.title.length === 0) {
            variableExterna.title = 'Sin título'
        }

        const updatedData = db.update.note(id, variableExterna);
        client.note.update(id, updatedData);
        
        modal.noteAdd.Deactivated()
        $itemToEdit.removeAttribute('edit')
        $BTN_modalNote_Confirm.textContent = 'Guardar'

        return
    }
    
    CreateNewNote()
    modal.noteAdd.Deactivated()
})

function CreateNewNote () {
    
    const $ActiveElement = $('[data-item-notebook].active');
    const id = $ActiveElement.getAttribute('data-item-notebook');
    
    let NoteTitle = $INP_modalNote_Title.value;
    let NoteContent = $INP_modalNote_Content.value;
    
    if( NoteTitle.length === 0 ){
        NoteTitle = 'Sin título'
    }

    if( NoteContent.length === 0 ){
        NoteContent = ''
    }

    const noteObj = {
        title: NoteTitle,
        text: NoteContent
    }

    const noteData = db.post.note(id, noteObj);
    client.note.create(noteData);
}

function PushEnterNote (event) {
    if (event.key === 'Enter') {
        CreateNewNote();
        modal.noteAdd.Deactivated()
    }
}

function PushEscapeNote (event) {
    if (event.key === 'Escape') {
        modal.noteAdd.Deactivated()
    }
}

/**
 * Modal > Drop Note
 */

$BTN_modalNoteDelete_Cancel.addEventListener('click', () => {
    const $itemToDelete = $('[data-notes-panel] [data-item-note][delete]');
    $itemToDelete.removeAttribute('delete')

    modal.noteDel.Deactivated();
});

$BTN_modalNoteDelete_Confirm.addEventListener('click', () => {
    let { id, title, text, postedOn, notebookId } = variableExterna;
    const $itemToDelete = $('[data-notes-panel] [data-item-note][delete]');
    
    db.delete.note(notebookId, id);
    $itemToDelete.remove();
    
    modal.noteDel.Deactivated();
    const $Notes_items = $$('[data-notes-panel] [data-item-note]');
    if($Notes_items.length === 1) {
        $emptyNotes.classList.add('active');
    }
})