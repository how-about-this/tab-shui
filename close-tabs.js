
function onRemoved(){
    console.log("Tab removed");
}
function onUpdated(tab){
    console.log(`Tab ${tab.id} redirected`);
    setTimeout(()=>browser.tabs.remove(tab.id), 1000);
}

function onError(message){
    return (error) => console.log(`Error from ${message}: ${error}`);
}

async function handleCreated(tab){

    console.log("Tab created with ID: " + tab.id+ " and index " + tab.index);
    let tabs = await browser.tabs.query({currentWindow: true})
    if(tabs.length > 5 && !tab.id !== browser.tabs.TAB_ID_NONE ){
        browser.tabs.remove(tab.id).then(onRemoved, onError('removing'));
    }
    if(tabs.length == 5 && !tab.id !== browser.tabs.TAB_ID_NONE ){
        browser.tabs.update(
            tab.id,
            {url: "substitute-page/page.html"})
            .then(onUpdated, onError('redirecting'));
    }
};

function handleUpdated(tabId, changeInfo, tab){

}


browser.tabs.onCreated.addListener(handleCreated);
