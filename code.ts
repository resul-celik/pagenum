figma.showUI(__html__, { visible: true, width: 370, height: 650 });

figma.on("selectionchange", (event) => {

  var selectedFrames = '<div class="nothing">There are no frames selected.</div>'
  
  for (const selections of figma.currentPage.selection) {

    if (selections.type == 'FRAME') {

      selectedFrames = 'Frames are selected.';

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
  var detectedPatterns = 0;
  var pattern = '$p';
  var frames = false;

  if (msg.startNumber) {

    startNumber = msg.startNumber

  }

  if (msg.pattern) {

    pattern = msg.pattern

  }

  for (const selection of figma.currentPage.selection) {

    if (selection.type == 'FRAME') {

      var textObjects = selection.findAll(selection => selection.type === "TEXT").filter(selection => selection.characters === pattern)

      textObjects.forEach(function (text) {

        var newText = startNumber.toString()
        
        detectedPatterns++

        figma.loadFontAsync(text.fontName).then(() => { text.characters = newText })

      })

      if (textObjects.length != 0) {

        if (msg.direction) {

          startNumber++

        } else {

          startNumber--

        }

      }

      frames = true

    }

  }

  // Feedbacks

  if (frames) {

    if (detectedPatterns == 0) {

      figma.notify(`There are no pattern detected.`);

    } else {

      figma.notify(`Pages successfully numbered.`);

    }

  } else {

    figma.notify(`There are no frames selected. `);

  }

}