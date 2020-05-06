
const CONFIGURATION = {
    max_tabs: 5,
    max_windows: 3
}

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

// Functions to get user defined values from stoarge
async function get_options(){
    result = await browser.storage.sync.get(["max_tabs","max_windows"]);
    result.max_tabs = result.max_tabs ? parseInt(result.max_tabs) : 5;
    result.max_windows = result.max_windows ? parseInt(result.max_windows) : 5;
    return result
}


async function handleCreated(tab){

    console.log("Tab created with ID: " + tab.id+ " and index " + tab.index);
    let tabs = await browser.tabs.query({currentWindow: true})
    let options = await get_options()
    if(tabs.length > options.max_tabs && !tab.id !== browser.tabs.TAB_ID_NONE ){
        browser.tabs.remove(tab.id).then(onRemoved, onError('removing'));
    }
    if(tabs.length == options.max_tabs && !tab.id !== browser.tabs.TAB_ID_NONE ){
        browser.tabs.update(
            tab.id,
            {url: "substitute-page/page.html"})
            .then(onUpdated, onError('redirecting'));
    }
};

function handleUpdated(tabId, changeInfo, tab){

}


browser.tabs.onCreated.addListener(handleCreated);
