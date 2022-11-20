figma.showUI(__html__, { visible: true, width: 370, height: 560 });

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.


var errors = ''

figma.on("selectionchange", (event) => {

  var selectedFrames = '<div class="nothing">No frame(s) selected. </div>'
  
  for (const selections of figma.currentPage.selection) {

    if (selections.type == 'FRAME') {

      selectedFrames = 'Frame(s) selected';

    } 

  }

  
  figma.ui.postMessage(selectedFrames, { origin: "*" });

});

figma.ui.onmessage = msg => {
  
  if (msg.type === 'page-numbers') {

      pageNums(msg)

  }
  
};

async function pageNums(msg) {

  var startNumber = 1;

  if (msg.startNumber) {

    startNumber = msg.startNumber

  }

  for (const selection of figma.currentPage.selection) {

    if (selection.type == 'FRAME') {

      var textObjects = selection.findAll(selection => selection.type === "TEXT").filter(selection => selection.characters === msg.identifier)

      var istx

      textObjects.forEach(function (text) {

        var newText = ''+startNumber+''

        istx = true
        
        figma.loadFontAsync(text.fontName).catch((err) => { if (err) {alert(err)} }).then(function () { text.characters = newText},function () {})

      })

      if (istx !== true) {

        figma.ui.postMessage('No pattern detected', { origin: "*" });

      } else {

        figma.ui.postMessage('Numarated', { origin: "*" });

      }

      startNumber++

    } else {

      figma.ui.postMessage('No frame(s) selected', { origin: "*" });

    }

  } 

  

}