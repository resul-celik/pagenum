figma.showUI(__html__, { visible: true, width: 400, height: 700 });

figma.on("selectionchange", () => {
    var selectedFrames = '';
    for (const selections of figma.currentPage.selection) {
        if (selections.type == 'FRAME' || selections.type == 'SECTION') {
            selectedFrames = 'Frame(s) selected.';
        }
    }
    figma.ui.postMessage(selectedFrames, { origin: "*" });
});

figma.ui.onmessage = msg => {
    if (msg.type === 'page-numbers') {
        pageNums(msg);
    }
};

/* Functions (Start) */
// To roman

const toRoman = (num:any) => {
    let result = '';
    const romanNumerals = [
        { letter: 'M', value: 1000 },
        { letter: 'CM', value: 900 },
        { letter: 'D', value: 500 },
        { letter: 'CD', value: 400 },
        { letter: 'C', value: 100 },
        { letter: 'XC', value: 90 },
        { letter: 'L', value: 50 },
        { letter: 'XL', value: 40 },
        { letter: 'X', value: 10 },
        { letter: 'IX', value: 9 },
        { letter: 'V', value: 5 },
        { letter: 'IV', value: 4 },
        { letter: 'I', value: 1 },
    ];
    for (let i = 0; i < romanNumerals.length; i++) {
        const numeral = romanNumerals[i];
        const value = numeral.value;
        while (num >= value) {
            result += numeral.letter;
            num -= value;
        }
    }
    return result;
}

/* Functions (End) */
const pageNums = async (msg:any) => {
    
    var startNumber = 1;
    var detectedPatterns = 0;
    var pattern = '$p';
    var frames = false;
    var selectionIndex = [];

    if (msg.startNumber) {
        startNumber = msg.startNumber;
    }

    if (msg.pattern) {
        pattern = msg.pattern;
    }

    for (const selections of figma.currentPage.selection) {
        if (selections.type == 'FRAME' || selections.type == 'SECTION') {
            selectionIndex.push({
                index: figma.currentPage.children.indexOf(selections),
                id: selections.id
            });

            selectionIndex.sort(function(a, b) {
                return b.index - a.index;
            })
        }
    }
    for (const frameIndex of selectionIndex) {
        var frameNode:any = figma.getNodeById(frameIndex.id);
        var textObjects = frameNode?.findAll((frameNode: { type: string; }) => frameNode.type === "TEXT").filter((frameNode: { characters: string; }) => frameNode.characters === pattern);
        
        textObjects.forEach(function (text:any) {
            var newText = startNumber.toString()

            if (!msg.style) {
                var newText = toRoman(startNumber);
            }

            detectedPatterns++

            figma.loadFontAsync(text.fontName).then(() => { text.characters = newText })

            if (textObjects.length != 0) {
    
            if (msg.direction) {
    
                startNumber++
    
            } else {
    
                startNumber--
    
            }
    
            }
    
            
        }) 

        frames = true
    }
        
    // Feedbacks
    if (frames) {
        if (detectedPatterns == 0) {
            figma.notify(`There is no pattern to be matched.`);
        }
        else {
            figma.notify(`Pages were successfully paginated.`);
        }
    }
    else {
        figma.notify(`Please select at least one frame first. `);
    }
    
}