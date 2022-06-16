let updateText = document.getElementById("updateText");

updateText.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: boldText,
    });
});

const boldText = () => {

    let parsedText = document.body.outerHTML.split(/\<[^\>]*\>/);
    let parsedElements = document.body.outerHTML.split(/\>[^<]*\</);

    let newHTML = "";

    for (let j = 0; j < parsedText.length; j++) {
        let newWords = "";
        let words = parsedText[j].split(/ |-/);
        for (let k = 0; k < words.length; k++) {
            let word = words[k];
            if (word.length == 1) {
                newWords += `<b>${word}</b> `;
            } else {
                newWords += `<b>${word.substring(0, word.length / 2)}</b>${word.substring(word.length / 2)} `;
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
    }
    document.body.outerHTML = newHTML;
}