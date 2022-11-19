figma.showUI(__html__);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.



figma.ui.onmessage = msg => {
  
  if (msg.type === 'page-numbers') {

      pageNums(msg)

  }
  
};

async function pageNums(msg) {

  var frameIndex = 1;

  for (const selection of figma.currentPage.selection) {

    if (selection.type == 'FRAME') {

      var textObjects = selection.findAll(selection => selection.type === "TEXT").filter(selection => selection.characters === msg.identifier)

      textObjects.forEach(function (text) {

        var newText = ''+frameIndex+''
        
        figma.loadFontAsync(text.fontName).catch((err) => { if (err) {alert(err)} }).then(function () { text.characters = newText},function () {})

      })

      frameIndex++

      

  }}

  msg.postMessage('hello')

}