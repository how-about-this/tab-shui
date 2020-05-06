
function onRemoved(){
    console.log("Tab removed");
}
function onUpdated(tab){
    console.log(`Tab ${tab.id} redirected`);
    setTimeout(()=>browser.tabs.remove(tab.id), 1000);
}

function onError(error) {
    console.log(`Error from Tab removing: ${error}`);
}
function onErrorUpdate(error) {
console.log(`Error from Tab redirecting: ${error}`);
}

async function handleCreated(tab){

    console.log("Tab created with ID: " + tab.id+ " and index " + tab.index);
/*     if(tab.index > 5 && !tab.id !== browser.tabs.TAB_ID_NONE ){
        browser.tabs.remove(tab.id).then(onRemoved, onError);
    }
    if(tab.index == 5 && !tab.id !== browser.tabs.TAB_ID_NONE ){
        browser.tabs.update(
            tab.id,
            {url: "substitute-page/page.html"})
            .then(onUpdated, onErrorUpdate);
    } */
/*     browser.tabs.query({currentWindow: true}).then((tabs) =>{
        let length = tabs.length;
        if(length>5){
            
            let rem = browser.tabs.remove(tabId.id);
            rem.then(onRemoved, onError)
        }
    }) */
    let tabs = await browser.tabs.query({currentWindow: true})
    if(tabs.length > 5 && !tab.id !== browser.tabs.TAB_ID_NONE ){
        browser.tabs.remove(tab.id).then(onRemoved, onError);
    }
    if(tabs.length == 5 && !tab.id !== browser.tabs.TAB_ID_NONE ){
        browser.tabs.update(
            tab.id,
            {url: "substitute-page/page.html"})
            .then(onUpdated, onErrorUpdate);
    }
};

function handleUpdated(tabId, changeInfo, tab){

}


browser.tabs.onCreated.addListener(handleCreated);
