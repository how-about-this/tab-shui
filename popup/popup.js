
function saveOptions(){
    let max_tabs = parseInt(document.querySelector("#max_tabs").value);
    let max_windows = parseInt(document.querySelector("#max_windows").value);
    if(max_tabs !== NaN && max_windows !== NaN){
        browser.storage.sync.set({
            max_tabs: document.querySelector("#max_tabs").value,
            max_windows: document.querySelector("#max_windows").value
        });
    }
  }

  
  function restoreOptions() {
  
    function setCurrentChoice(result) {
      document.querySelector("#max_tabs").value = result.max_tabs || "5";
      document.querySelector("#max_windows").value = result.max_windows || "3";
    }
  
    function onError(error) {
      console.log(`Error: ${error}`);
    }
  
    let getting = browser.storage.sync.get(["max_tabs","max_windows"]); 
    getting.then(setCurrentChoice, onError);
  }
  
//Just for Debugging
function mockRestoreOptions(){
    document.querySelector("#max_tabs").value = "5";
    document.querySelector("#max_windows").value = "3";

}

  document.addEventListener("DOMContentLoaded", restoreOptions);
  document.querySelector("#max_tabs").addEventListener("change", saveOptions);
  document.querySelector("#max_windows").addEventListener("change", saveOptions);