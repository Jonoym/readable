chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    function: boldText
  });
});

const boldText = () => {

    if (document.getElementById("ReadableCheck") !== null) {
        chrome.storage.local.get( "outerHTML", ({ outerHTML }) => {
            document.body.outerHTML = outerHTML;
        })
    } else {
        let outerHTML = document.body.outerHTML;

        chrome.storage.local.set({ outerHTML });

        let parsedText = document.body.outerHTML.split(/\<[^\>]*\>/);
        let parsedElements = document.body.outerHTML.split(/\>[^<]*\</);
    
        let newHTML = "";
        let isParagraph = false;
        for (let j = 0; j < parsedText.length; j++) {
            let newWords = "";
            let words = parsedText[j].split(/ |-/);
            for (let k = 0; k < words.length; k++) {
                let word = words[k];
                if (isParagraph) {
                    newWords += `<b>${word.substring(0, word.length / 2 + 1)}</b>${word.substring(word.length / 2 + 1)} `;
                } else {
                    newWords += word + " ";
                }
            }
            newHTML += newWords;
            if (j === 0) {
                newHTML += `${parsedElements[j]}>`;
            } else if (j === parsedText.length - 2) {
                newHTML += `<${parsedElements[j]}`;
            } else if (j !== parsedText.length - 1) {
                newHTML += `<${parsedElements[j]}>`;
            }
            if (j !== parsedText.length - 1) {
                if (parsedElements[j].substring(0, 2) === "p ") {
                    isParagraph = true;
                }
                if (parsedElements[j].substring(0, 2) === "/p") {
                    isParagraph = false;
                }
            }
        }
    
        document.body.outerHTML = newHTML;
    
        var readableCheck = document.createElement('div');
        readableCheck.id = "ReadableCheck";
        document.body.appendChild(readableCheck);
    }
}