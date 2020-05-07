
function onRemoved(){
    console.log("Tab removed");
}
function onUpdatedTab(tab){
    console.log(`Tab ${tab.id} redirected`);
    setTimeout(()=>browser.tabs.remove(tab.id), 1000);
}
async function onUpdatedWindow(window){
    window = await browser.windows.get(window.id,{populate:true})
    console.log(`Window ${window.id}, first tab ${window.tabs[0].id} redirecting`);
    browser.tabs.update(
        window.tabs[0].id,
        {url: "substitute-page/windows_exceeded.html"})
    setTimeout(()=>browser.windows.remove(window.id), 1000);
}

function onError(message){
    return (error) => console.log(`Error from ${message}: ${error}`);
}

// Functions to get user defined values from stoarge
async function getOptions(){
    result = await browser.storage.sync.get(["max_tabs","max_windows"]);
    result.max_tabs = result.max_tabs ? parseInt(result.max_tabs) : 5;
    result.max_windows = result.max_windows ? parseInt(result.max_windows) : 3;
    return result;
}

// Close new tab if number of tabs exceed specified limit
async function handleCreatedTab(tab){
    console.log("Tab created with ID: " + tab.id+ " and index " + tab.index);
    if(tab.id === browser.tabs.TAB_ID_NONE){ return; }
    let tabs = await browser.tabs.query({currentWindow: true})
    let options = await getOptions()
    if(tabs.length > options.max_tabs+1){
        browser.tabs.remove(tab.id).then(onRemoved, onError('removing'));
    }
    if(tabs.length == options.max_tabs+1){
        browser.tabs.update(
            tab.id,
            {url: "substitute-page/tabs_exceeded.html"})
            .then(onUpdatedTab, onError('redirecting'));
    }
};

// Close new window if number of tabs exceed specified limit
async function handleCreatedWindow(window){
    console.log("Window created with ID: " + window.id);
    let windows = await browser.windows.getAll();
    console.log("Windows " + windows);
    let options = await getOptions();
    console.log(`max_windows: ${options.max_windows}`);
    if(windows.length > options.max_windows){
        console.log(`Window ${window.id} updating entered`);
        browser.windows.update(
            window.id,
            {focused: true})
            .then(onUpdatedWindow, onError('redirecting'));
    }
};

function handleUpdated(tabId, changeInfo, tab){

}


browser.tabs.onCreated.addListener(handleCreatedTab);
browser.windows.onCreated.addListener(handleCreatedWindow);
