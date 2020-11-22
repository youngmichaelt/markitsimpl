function OpenTab(link) {
    // var url = document.getElementById('linkName')
    if (!link.includes('http')){
        link = 'https://' + link
    }
    window.open(
        link, "_blank");
}

function OpenAllTabs(bookmarks){

    console.log(bookmarks)
    var links = bookmarks.split(',')
    console.log(links.length)
    for (i=1; i < links.length; i++){
        if (!links[i].includes('http')){
            links[i] = 'https://' + links[i]
        }
        console.log(links[i])
        n = window.open(
            links[i], "_blank");

        if (n==null){
            console.log('blocked');
            window.alert('Disable pop up blocker for our site so we can open all tabs at once!')
            break
        } else {
            console.log('allowed');
        }
    }
}

function startMove(value){
    console.log(value)
    value = value.split(',')

    // var html = `<button id=${i} onclick="up(this)" class="btn  btn-user btn-block ${value[2]} " style="" >
    //             <i class="fas fa-arrow-up"></i>
    //          </button>
    //         <button id="${i}" onclick="down(this)" class="btn  btn-user btn-block ${value[2]}" style="" >
    //         <i class="fas fa-arrow-down"></i>
    //          </button>`
    // var div = document.getElementById('moveId')
    var div = document.getElementsByClassName('movementId')
    var buttons = document.getElementsByClassName('moveBtn')
    var savebuttons = document.getElementsByClassName('savemoveBtn')

    for (i=0; i<buttons.length;i++){
        buttons[i].style.display = "block";
    }
    savebuttons[0].style.display = "block";

    // console.log(value[2])

    var bookmark = document.getElementsByClassName(value[2])

    var namesarray = []
    var linksarray = []

    var nameInput = document.getElementById('nameInput')
    var linkInput = document.getElementById('linkInput')

    var names = document.getElementsByClassName('name')
    var links = document.getElementsByClassName('link')

    // console.log(names[0].innerHTML, links)

    for (i=0;i<names.length;i++){
        namesarray.push(names[i].innerHTML)
        linksarray.push(links[i].innerHTML)
    }
    nameInput.value = namesarray
    linkInput.value = linksarray

    var nameInput = document.getElementById('nameInput')
    var linkInput = document.getElementById('linkInput')
    // console.log(nameInput, linkInput)
    var folder = document.URL.split('=')[1]

    var form = document.getElementsByClassName('moveForm');
    // console.log(form)
    for (i=0;i<form.length;i++){
        form[i].action = '/saveMovement?folder='+ folder + '&names=' + namesarray + '&links=' + linksarray
    }
    console.log(form)
    // console.log(bookmark[1], 'tttt')
    // bookmark[1].innerHTML += html
    //
    // for (i=0; i<bookmark.length; i++){
    //     bookmark[i].innerHTML += html
    // }
    // for(i=0; i<div.length;i++){
    //     var html = `<button id=${i} onclick="up(this)" class="btn  btn-user btn-block ${value[2]} " style="" >
    //             <i class="fas fa-arrow-up"></i>
    //          </button>
    //         <button id="${i}" onclick="down(this)" class="btn  btn-user btn-block ${value[2]}" style="" >
    //         <i class="fas fa-arrow-down"></i>
    //          </button>`
    //     div[i].innerHTML += html;
    // }
    // div.innerHTML = html;

}
function up(value) {
    //if it is not the first bookmark
    if (value != 0) {
        console.log(value)
        var html = document.getElementsByClassName(value);
        var html2 = document.getElementsByClassName(value - 1);
        var bookmark = html[0]
        var bookmarkAbove = html2[0]

        var buttons = document.getElementsByName(value)
        var buttonsAbove = document.getElementsByName(value - 1)

        // console.log(buttonsAbove[1])
        var value2 = value - 1
        // console.log(bookmark,bookmarkAbove)

        // console.log(bookmark.parentElement, bookmark)

        // bookmarkAbove.parentElement.removeChild(bookmarkAbove)
        bookmark.parentNode.insertBefore(bookmark, bookmarkAbove)

        var divider = document.getElementsByClassName(value)
        var divider2 = document.getElementsByClassName(value - 1)
        for (i = 0; i < divider.length; i++) {
            // console.log(divider[i])
        }
        divider[1].parentNode.insertBefore(divider[1], bookmarkAbove)
        //change ids

        divider[1].className = 'sidebar-divider d-none d-md-block ' + value2

        divider2[2].className = 'sidebar-divider d-none d-md-block ' + value

        // console.log(divider[1], divider2[2])

        var bmid = bookmark.id
        var bmid2 = bookmarkAbove.id

        bookmark.id = bmid2
        bookmarkAbove.id = bmid
        bookmark.className = 'card shadow border-left-info py-2 bookmark align-content-center movementId ' + bmid2
        bookmarkAbove.className = 'card shadow border-left-info py-2 bookmark align-content-center movementId ' + bmid


        var up = document.getElementsByName(value)
        console.log(up)
        // console.log(up)
        up[0].name = value - 1
        up[0].name = value - 1

        var up2 = document.getElementsByName(value - 1)
        console.log(up2)
        // console.log(up2)
        up2[2].name = value
        up2[2].name = value

        //every time movement happens save bms to input for saving
        var nameInput = document.getElementById('nameInput')
        var linkInput = document.getElementById('linkInput')

        var names = document.getElementsByClassName('name')
        var links = document.getElementsByClassName('link')
        var namesarray = []
        var linksarray = []

        // console.log(names[0].innerHTML, links)

        for (i=0;i<names.length;i++){
            namesarray.push(names[i].innerHTML)
            linksarray.push(links[i].innerHTML)
        }
        nameInput.value = namesarray
        linkInput.value = linksarray


        // console.log(namesarray, linksarray)
        var nameInput = document.getElementById('nameInput')
        var linkInput = document.getElementById('linkInput')
        // console.log(nameInput, linkInput)
        var folder = document.URL.split('=')[1]

        var form = document.getElementsByClassName('moveForm');
        // console.log(form)
        for (i=0;i<form.length;i++){
            form[i].action = '/saveMovement?folder='+ folder + '&names=' + namesarray + '&links=' + linksarray
        }
        // console.log(document.URL.split('=')[1])

        // form.action += '&names=' + namesarray + '&links=' + linksarray


    }

    // up.name = buttonsAbove[0].name
    // down.name = buttonsAbove[1].name
    //
    // up2.name = buttons[0].name
    // down2.name = buttons[1].name

    // console.log(value.parentNode.id)
    // var bookmark = document.getElementsByClassName(value.parentNode.id)
    // var ref = document.getElementsByClassName(value.parentNode.id - 1 )
    // console.log(bookmark[0].id)
    // console.log(ref.length, ref[0], ref[1])
    // // $("#"+value.parentNode.id).insertBefore("#"+value.parentNode.id - 1);
    // // bookmark[0].insertbe
    // // console.log($("#"+value.parentNode.id))
    // bookmark[0].parentElement.insertBefore(bookmark[0], ref[0])
    // var r = ref[0].id
    // var b = bookmark[0].id
    // var up = bookmark[2].id
    // var down = bookmark[3].id
    // var up2 = ref[2].id
    // var down2 = ref[3].id
    // bookmark[0].id = r
    // ref[0].id = b
    // bookmark[2].id = down2
    // bookmark[3].id = up2
    // ref[2].id = down
    // ref[3].id = up
    // console.log(bookmark[2].id)
    // console.log(bookmark[3])
    // console.log('ref '+ref[0])
}
function down(value1) {

    var bookmarks = document.getElementsByClassName('bookmark');


    if (value1 != bookmarks.length) {
        value = parseInt(value1)
        console.log(value)
        var html = document.getElementsByClassName(value);
        var html2 = document.getElementsByClassName(value + 1);
        var bookmark = html[0]
        var bookmarkBelow = html2[0]
        console.log(bookmark, bookmarkBelow)

        var buttons = document.getElementsByName(value)
        var buttonsAbove = document.getElementsByName(value + 1)

        // console.log(buttonsAbove[1])
        var value2 = parseInt(value) + 1
        // console.log(bookmark,bookmarkAbove)

        // console.log(bookmark.parentElement, bookmark)

        // bookmarkAbove.parentElement.removeChild(bookmarkAbove)
        bookmarkBelow.parentNode.insertBefore(bookmarkBelow, bookmark)

        // bookmark.parentNode.insertAfter(bookmark, bookmarkBelow)
        console.log(bookmark, bookmarkBelow)
        var divider = document.getElementsByClassName(value)
        var divider2 = document.getElementsByClassName(parseInt(value) + 1)
        for (i = 0; i < divider.length; i++) {
            // console.log(divider[i])
        }
        divider[1].parentNode.insertBefore(divider[1], bookmark)
        //change ids
        // console.log(divider[0], divider[1])
        divider[1].className = 'sidebar-divider d-none d-md-block ' + value2

        // divider2[2].className = 'sidebar-divider d-none d-md-block ' + value

        var bmid = bookmark.id
        var bmid2 = bookmarkBelow.id

        bookmark.id = bmid2
        bookmarkBelow.id = bmid
        bookmark.className = 'card shadow border-left-info py-2 bookmark align-content-center movementId ' + bmid2
        bookmarkBelow.className = 'card shadow border-left-info py-2 bookmark align-content-center movementId ' + bmid


        var up = document.getElementsByName(value)
        // console.log(up)
        // console.log(up[1].name)
        up[1].name = value + 1
        up[0].name = value + 1
        console.log(up[0])
        // up[1].name = value + 1



        var up2 = document.getElementsByName(value + 1)
        // console.log(up2[2])
        // console.log(up2[1])

        up2[1].name = value
        up2[0].name = value
        console.log(up2[0])
        // up2[1].name = value


        //every time movement happens save bms to input for saving
        var nameInput = document.getElementById('nameInput')
        var linkInput = document.getElementById('linkInput')

        var names = document.getElementsByClassName('name')
        var links = document.getElementsByClassName('link')
        var namesarray = []
        var linksarray = []

        // console.log(names[0].innerHTML, links)

        for (i=0;i<names.length;i++){
            namesarray.push(names[i].innerHTML)
            linksarray.push(links[i].innerHTML)
        }
        nameInput.value = namesarray
        linkInput.value = linksarray


        // console.log(namesarray, linksarray)
        var nameInput = document.getElementById('nameInput')
        var linkInput = document.getElementById('linkInput')
        // console.log(nameInput, linkInput)
        var folder = document.URL.split('=')[1]

        var form = document.getElementsByClassName('moveForm');
        // console.log(form)
        for (i=0;i<form.length;i++){
            form[i].action = '/saveMovement?folder='+ folder + '&names=' + namesarray + '&links=' + linksarray
        }
        // console.log(document.URL.split('=')[1])

        // form.action += '&names=' + namesarray + '&links=' + linksarray


    }



}
var bookmarks = [];

// var bookmarkList = '<% bookmarkList%>';
//
// console.log(bookmarkList);

function createFolder(){

}


var bookmarkHTML = '<div id="myModal" class="modal modal-content">' +
    '<div class="bookmarkAdd">'+'<hr class="sidebar-divider d-none d-md-block" style="width: 70vw;">' +
    '<div class="card shadow border-left-info py-2" style="width: 70vw;">\n' +
    '              <div class="card-body">\n' +
    '                <div class="row no-gutters align-items-center">\n' +
    '                  <div class="col mr-2">\n' +
    '                    <div class="text-uppercase text-info font-weight-bold text-xs">\n' +
    '                      <div class="form-group">\n' +
    '                      <input type="name" name="name" class="form-control form-control-user" aria-describedby="emailHelp" placeholder="Enter Bookmark Name..."' +
    '>\n' +

    '                      </div>\n' +

    '                       <div class="form-group">\n' +
    '                      <input type="URL" name="URL" class="form-control form-control-user" placeholder="URL">\n' +
    '                    </div>\n' +
    '                    </div>\n' +
    '                    <div class="row no-gutters align-items-center">\n' +

    '                      <div class="col-auto">\n' +

    '                      </div>\n' +

    '                    </div>\n' +
    '                  </div>\n' +

    '<n>                </n><div class="col-auto align-items-center form-group" >\n' +


     // '                  <form action="/save" method="post">\n' +
    '                     <button type="submit" onclick="SaveBookmark()" class="btn btn-primary btn-user btn-block form-control form-control-user" >SAVE</button>\n' +
     // '                   </form>\n' +
'                    <button onclick="Delete()" class="btn btn-primary btn-user btn-block form-control form-control-user" >DELETE</button>\n' +

    '                  </div>\n' +

    '  <!--                <button>REMOVE</button>-->\n' +
    '                </div>\n' +
    '              </div>\n' +
    '            </div>' +
    '</div>'
    '</div>'


// var bookmarkLayout = '<div class="card shadow border-left-info py-2" style="width: 70vw;">\n' +
//     '    <div class="card-body">\n' +
//     '        <div class="row align-items-center no-gutters">\n' +
//     '            <div class="col mr-2">\n' +
//     '                <div class="text-uppercase text-info font-weight-bold text-xs mb-1">\n' +
//     '                    <span>${name}</span>\n' +
//     '                </div>\n' +
//     '                <div class="row no-gutters align-items-center">\n' +
//     '                    <div class="col-auto">\n' +
//     '                        <div class="text-dark font-weight-bold h5 mb-0 mr-3">\n' +
//     '                            <span id="link">${url}</span>\n' +
//     '                        </div>\n' +
//     '                    </div>\n' +
//     '                    <div class="col">\n' +
//     '\n' +
//     '                    </div>\n' +
//     '                </div>\n' +
//     '            </div>\n' +
//     '            <div class="col-auto">\n' +
//     '                <button onclick="OpenTab()" class="btn btn-primary btn-user btn-block" >LINK</button>\n' +
//     '            </div>\n' +
//     '            <!--                <button>REMOVE</button>-->\n' +
//     '        </div>\n' +
//     '    </div>\n' +
//     '</div>'
var bookmarkForm = '<form class="user" action="/login" method="post">\n' +
    '                    <div class="form-group">\n' +
    '                      <input type="email" name="email" class="form-control form-control-user" id="exampleInputEmail" aria-describedby="emailHelp" placeholder="Enter Email Address...">\n' +
    '                    </div>\n' +
    '                    <div class="form-group">\n' +
    '                      <input type="password" name="password" class="form-control form-control-user" id="exampleInputPassword" placeholder="Password">\n' +
    '                    </div>\n' +
    '                    <div class="form-group">\n' +
    '                      <input type="submit" value="Login" class="btn btn-primary btn-user btn-block"/>\n' +
    '                    </div>\n' +
    '\n' +
    '                  </form>'


function createBookmark(){
    console.log('bookmark creating');
    var doc = document.getElementById('bookmarkContainer');
    console.log(doc);
    //get current bookmarks
    var marks = document.getElementsByClassName('bookmark')
    for (i = 0; i < marks.length; i++) {
        bookmarks.push(marks[i])
    }
    console.log(bookmarks[0]);
    doc.innerHTML += bookmarkHTML;

    // doc.insertAdjacentHTML('beforeend', bookmarkHTML);
    // $('bookmarkContainer').append(bookmarkHTML);

}

function SaveBookmark(){
    var html = '';
    var name = document.getElementsByName('name')[0].value;
    var url = document.getElementsByName('URL')[0].value;
    var bookmarkLayout = `<hr class="sidebar-divider d-none d-md-block" style="width: 70vw;">
<div class="card shadow border-left-info py-2 bookmark" style="width: 70vw;">
            <div class="card-body">
                <div class="row align-items-center no-gutters">
                    <div class="col mr-2">
                        <div class="text-uppercase text-info font-weight-bold text-xs mb-1">
                            <span>${name}</span>
                        </div>
                        <div class="row no-gutters align-items-center">
                            <div class="col-auto">
                                <div class="text-dark font-weight-bold h5 mb-0 mr-3">
                                    <span id="link">${url}</span>
                                </div>
                            </div>
                            <div class="col">
        
                            </div>
                        </div>
                    </div>
                    <div class="col-auto">
                        <button onclick="OpenTab()" class="btn btn-primary btn-user btn-block" >LINK</button>
                    </div>
                    <!--                <button>REMOVE</button>-->
                </div>
            </div>
        </div>`
    console.log(name, url, bookmarks)
    bookmarks.push(bookmarkLayout);
    for (i = 0; i < bookmarks.length; i++) {
        html += bookmarks[i];
    }

    var bAdd = document.getElementsByClassName('bookmarkAdd')

    var doc = document.getElementById('bookmarkContainer');

    for (i = 0; i < bAdd.length; i++) {
        bAdd[i].remove();
    }
    doc.innerHTML += bookmarkLayout;
    // var form = document.createElement('form');
    // form.setAttribute('method', 'post');
    // form.setAttribute('action', '/save');
    // form.style.display = 'hidden';
    // document.body.appendChild(form)
    // form.submit();
}
function Edit(value){
    console.log(value)
    value = value.split(',')
    var name = document.getElementById('editName');
    var link = document.getElementById('editLink');
    var id = document.getElementById('inputId');

    name.value = value[0]
    link.value = value[1]
    id.value = value[2]




}

function editFolder(value){
    console.log(value)
    var input = document.getElementById('editFolderName')
    input.value = value
}

function Delete(btnID){
    //add some

    var bookmark = document.getElementById(btnID);

    // var doc = document.getElementById('bookmarkContainer');
    console.log(bookmark);
    bookmark.remove();

    // var form = document.getElementById('deleteForm');
    // form.submit();
}
function modal(){
    var modal = document.getElementById("myModal");
    console.log(modal.style.display)

    var btn = document.getElementById("modalbtn");
    if (modal.style.display == "none"){
        modal.style.display = "block";
    } else {
        modal.style.display = "none";

    }

}

// <div class="card shadow border-left-info py-2" style="width: 70vw;">
//     <div class="card-body">
//         <div class="row align-items-center no-gutters">
//             <div class="col mr-2">
//                 <div class="text-uppercase text-info font-weight-bold text-xs mb-1">
//                     <span>Google</span>
//                 </div>
//                 <div class="row no-gutters align-items-center">
//                     <div class="col-auto">
//                         <div class="text-dark font-weight-bold h5 mb-0 mr-3">
//                             <span id="link">www.google.com</span>
//                         </div>
//                     </div>
//                     <div class="col">
//
//                     </div>
//                 </div>
//             </div>
//             <div class="col-auto">
//                 <button onclick="OpenTab()" class="btn btn-primary btn-user btn-block" >LINK</button>
//             </div>
//             <!--                <button>REMOVE</button>-->
//         </div>
//     </div>
// </div>

// <form class="user" action="/login" method="post">
//     <div class="form-group">
//         <input type="email" name="email" class="form-control form-control-user" id="exampleInputEmail" aria-describedby="emailHelp" placeholder="Enter Email Address...">
//     </div>
//     <div class="form-group">
//         <input type="password" name="password" class="form-control form-control-user" id="exampleInputPassword" placeholder="Password">
//     </div>
//     <div class="form-group">
//         <input type="submit" value="Login" class="btn btn-primary btn-user btn-block"/>
//     </div>
//
// </form>