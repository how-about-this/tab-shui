
function onRemoved(){
    console.log("Tab removed");
}

function onUpdatedTab(tab){
    console.log(`Tab ${tab.id} redirected`);
    setTimeout(()=>browser.tabs.remove(tab.id), 1000);
}

function onError(message){
    return (error) => console.log(`Error from ${message}: ${error}`);
}

 // Redirect the active tab to 
    // an info page and close the window shortly after 
async function onUpdatedWindow(window){
    window = await browser.windows.get(window.id,{populate:true})
    console.log(`Window ${window.id}, first tab ${window.tabs[0].id} redirecting`);
    browser.tabs.update(
        window.tabs[0].id,
        {url: "substitute-page/windows_exceeded.html"})
    setTimeout(()=>browser.windows.remove(window.id), 1000);
}



// Function to get user defined values from stoarge
async function getOptions(windowId){
    let maxTabsKey = "maxTabs_"+ windowId.toString();
    let result = await browser.storage.local.get([maxTabsKey,"maxWindows"]); 
    result.maxTabs = result[maxTabsKey] ? parseInt(result[maxTabsKey]) : 5;
    result.maxWindows = result.maxWindows ? parseInt(result.maxWindows) : 3;
    return result;
}

// Close new tab if number of tabs exceed specified limit
async function handleCreatedTab(tab){
    console.log("Tab created with ID: " + tab.id+ " and index " + tab.index);
    if(tab.id === browser.tabs.TAB_ID_NONE){ return; }
    let tabs = await browser.tabs.query({currentWindow: true})
    let options = await getOptions(tab.windowId);
    // First Tab that exeeds limit will redirect to an 
    // info page and close shortly afterwards
    if(tabs.length == options.maxTabs + 1){
        browser.tabs.update(
            tab.id,
            {url: "substitute-page/tabs_exceeded.html"})
            .then(onUpdatedTab, onError('redirecting'));
    }
    // Every Tab after the first exceeding tab will be closed without feedback
    if(tabs.length > options.maxTabs + 1){
        browser.tabs.remove(tab.id).then(onRemoved, onError('removing'));
    }

};

// Close new window if number of tabs exceed specified limit
async function handleCreatedWindow(window){
    let windows = await browser.windows.getAll();
    let options = await getOptions();
   // Windows exceeding the limit will trigger closing pipeline
    if(windows.length > options.maxWindows){
        browser.windows.update(
            window.id,
            {focused: true})
            .then(onUpdatedWindow, onError('redirecting'));
    }
};

function handleClosedWindow(window){
    let maxTabsKey = "maxTabs_" + window.id;
    browser.storage.local.remove(maxTabsKey).then(console.log(maxTabsKey + "removed from storage", onError("storageRemove")))
}

// Add handlers to Events
browser.tabs.onCreated.addListener(handleCreatedTab);
browser.windows.onCreated.addListener(handleCreatedWindow);
browser.windows.onCreated.addRemoved(handleClosedWindow);