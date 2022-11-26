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

        figma.loadFontAsync(text.fontName).then(() => { text.characters = newText })

      })

      if (checkNewText !== true) {

        figma.notify(`No pattern detected.`);

      } else {

        figma.notify(`Pages successfully numbered.`);

      }

      startNumber++

    } else {

      figma.notify(`No frame(s) selected.`);

    }

  }

}