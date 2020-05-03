
function onRemoved(){
    console.log("Tab removed");
}
function onError(error) {
    console.log(`Error from Tab removing: ${error}`);
  }

async function handleCreated(tab){

    console.log("Tab created with ID: " + tab.id+ " and index " + tab.index);
    if(tab.index > 4 && !tab.id !== browser.tabs.TAB_ID_NONE ){
        browser.tabs.remove(tab.id).then(onRemoved, onError);
    }
/*     browser.tabs.query({currentWindow: true}).then((tabs) =>{
        let length = tabs.length;
        if(length>5){
            
            let rem = browser.tabs.remove(tabId.id);
            rem.then(onRemoved, onError)
        }
    }) */
};

function handleUpdated(tabId, changeInfo, tab){

}


browser.tabs.onCreated.addListener(handleCreated);
