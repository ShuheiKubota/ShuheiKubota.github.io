function replaceSince(spanElem) {
    var v = spanElem.firstChild.data;
    spanElem.title = v;
    
    var now = new Date(Date.now());
    var mod = new Date(v);

    var d = now.getTime() - mod.getTime();
    if (d < 60 * 60 * 1000) {
        spanElem.firstChild.data = Math.floor(d / (60 * 1000)) + " minutes ago";
        return
    } else if (d < 24 * 60 * 60 * 1000) {
        spanElem.firstChild.data = Math.floor(d / (60 * 60 * 1000)) + " hours ago";
        return
    } else if (d < 28 * 24 * 60 * 60 * 1000) {
        spanElem.firstChild.data = Math.floor(d / (24 * 60 * 60 * 1000)) + " days ago";
        return
    }

    var dym = (now.getFullYear() * 12 + now.getMonth() + 1) - (mod.getFullYear() * 12 + mod.getMonth() + 1);
    if (dym < 12)  {
        spanElem.firstChild.data = dym + " months ago";
        return
    } else if (dym > 0) {
        spanElem.firstChild.data = Math.trunc(dym / 12) + " years ago";
        return
    }

    spanElem.firstChild.data = "now";
}