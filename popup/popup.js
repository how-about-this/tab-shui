async function getCurrentWindowId(){
  let window = await browser.windows.getCurrent();
  return window.id.toString();
}


async function saveOptions(){
    let maxTabsKey = "maxTabs_" + await getCurrentWindowId();
    let maxTabs = document.querySelector("#max-tabs").value;
    let maxWindows = document.querySelector("#max-windows").value;
    
    if(parseInt(maxTabs) !== NaN && parseInt(maxWindows) !== NaN){
        let updateObj = {};
        updateObj["maxWindows"] = maxWindows;
        updateObj[maxTabsKey] = maxTabs;
        browser.storage.local.set(updateObj);
    }
  }

  
async function restoreOptions() {
  // Load saved options from storage or provide default value
  let maxTabsKey = "maxTabs_" + await getCurrentWindowId();
    function setCurrentChoice(result) {
      document.querySelector("#max-tabs").value = result[maxTabsKey] || "5";
      document.querySelector("#max-windows").value = result.maxWindows || "3";
    }
  
    function onError(error) {
      console.log(`Error: ${error}`);
    }
    
    let getting = browser.storage.local.get([maxTabsKey,"maxWindows"]); 
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