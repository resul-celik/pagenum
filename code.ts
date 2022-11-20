figma.showUI(__html__, { visible: true, width: 370, height: 560 });

figma.on("selectionchange", (event) => {

  var selectedFrames = '<div class="nothing">No frame(s) selected.</div>'
  
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
  var pattern = '$p';

  if (msg.startNumber) {

    startNumber = msg.startNumber

  }

  if (msg.pattern) {

    pattern = msg.pattern

  }

  for (const selection of figma.currentPage.selection) {

    if (selection.type == 'FRAME') {

      var textObjects = selection.findAll(selection => selection.type === "TEXT").filter(selection => selection.characters === pattern)
      var checkNewText

      textObjects.forEach(function (text) {

        var newText = startNumber.toString() 
        checkNewText = true
        figma.loadFontAsync(text.fontName).catch((err) => { if (err) {alert(err)} }).then(function () { text.characters = newText},function () {})
        

      })

      if (checkNewText !== true) {

        figma.ui.postMessage('There was no pattern detected.', { origin: "*" });

      } else {

        figma.ui.postMessage('Pages have been numbered.', { origin: "*" });

      }

      startNumber++

    } else {

      figma.ui.postMessage('No frame(s) selected', { origin: "*" });

    }

  }

}