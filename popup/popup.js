
function saveOptions(){
    let maxTabs = parseInt(document.querySelector("#max-tabs").value);
    let maxWindows = parseInt(document.querySelector("#max-windows").value);
    if(maxTabs !== NaN && maxWindows !== NaN){
        browser.storage.local.set({
            maxTabs: document.querySelector("#max-tabs").value,
            maxWindows: document.querySelector("#max-windows").value
        });
    }
  }

  
  function restoreOptions() {
  
    function setCurrentChoice(result) {
      document.querySelector("#max-tabs").value = result.maxTabs || "5";
      document.querySelector("#max-windows").value = result.maxWindows || "3";
    }
  
    function onError(error) {
      console.log(`Error: ${error}`);
    }
  
    let getting = browser.storage.local.get(["maxTabs","maxWindows"]); 
    getting.then(setCurrentChoice, onError);
  }
  
//Just for Debugging
function mockRestoreOptions(){
    document.querySelector("#max-tabs").value = "5";
    document.querySelector("#max-windows").value = "3";

}

  document.addEventListener("DOMContentLoaded", restoreOptions);
  document.querySelector("#max-tabs").addEventListener("change", saveOptions);
  document.querySelector("#max-windows").addEventListener("change", saveOptions);