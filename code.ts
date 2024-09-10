// Set up UI
figma.showUI(__html__, { visible: true, width: 400, height: 550 });

// Handle selection change event
figma.on("selectionchange", () => {
  const frameCount = figma.currentPage.selection.filter(
    (node) =>
      node.type === "FRAME" ||
      node.type === "SECTION" ||
      node.type === "INSTANCE"
  ).length;

  figma.ui.postMessage(`${frameCount}`, { origin: "*" });
});

// Listen for messages from UI
figma.ui.onmessage = (message) => {
  if (message.type === "page-numbers") {
    paginateFrames(message);
  }
};

/* Functions */

// Convert number to Roman numeral
const toRoman = (num: number): string => {
  const romanNumerals = [
    { letter: "M", value: 1000 },
    { letter: "CM", value: 900 },
    { letter: "D", value: 500 },
    { letter: "CD", value: 400 },
    { letter: "C", value: 100 },
    { letter: "XC", value: 90 },
    { letter: "L", value: 50 },
    { letter: "XL", value: 40 },
    { letter: "X", value: 10 },
    { letter: "IX", value: 9 },
    { letter: "V", value: 5 },
    { letter: "IV", value: 4 },
    { letter: "I", value: 1 },
  ];

  let result = "";
  for (const numeral of romanNumerals) {
    while (num >= numeral.value) {
      result += numeral.letter;
      num -= numeral.value;
    }
  }
  return result;
};

// Paginate frames
const paginateFrames = async (message: any) => {
  let {
    startNumber = 1,
    pattern = "$p",
    direction = true,
    style = true,
  } = message;

  startNumber = Number(startNumber);

  let progress = 0;
  let notification = figma.notify("Paginating layers, please wait...");

  const selectedFrames = figma.currentPage.selection
    .filter(
      (node) =>
        node.type === "FRAME" ||
        node.type === "SECTION" ||
        node.type === "INSTANCE"
    )
    .map((frame) => ({
      index: figma.currentPage.children.indexOf(frame),
      id: frame.id,
    }))
    .sort((a, b) => (direction ? a.index - b.index : b.index - a.index));

  // Adjust starting number for reverse direction
  if (!direction) {
    startNumber = selectedFrames.length + 1 - startNumber;
  }

  for (const frameIndex of selectedFrames) {
    const frameNode = figma.getNodeById(frameIndex.id) as FrameNode;
    const matchingTextNodes = frameNode
      ?.findAll((node) => node.type === "TEXT")
      .filter((node: any) => node.characters === pattern) as TextNode[];

    if (matchingTextNodes) {
      for (const textNode of matchingTextNodes) {
        if (progress % 5 === 0) {
          notification.cancel();
          notification = figma.notify(
            `Paginating layers [${progress}/${selectedFrames.length}]`,
            {
              timeout: 60000,
            }
          );
        }
        const newText = style ? String(startNumber) : toRoman(startNumber); // Corrected number format
        await figma.loadFontAsync(textNode.fontName as FontName);
        textNode.characters = newText;
        startNumber += direction ? 1 : -1; // Properly increment or decrement
        progress++;
      }
    }
  }

  // User feedback
  notification.cancel();
  if (progress > 0) {
    figma.notify("Success! Page numbers have been applied.", {
      timeout: 4000,
    });
  } else {
    figma.notify("No matching patterns found in the selected frames.", {
      timeout: 4000,
    });
  }
};
