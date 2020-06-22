
document.querySelector('#titleAZ').onclick = mySort;

function mySort() {
    let nav = document.querySelector('#nav');
    for (let i = 0; i < nav.children.length; i++) {
        for (let j = i; j < nav.children.length; j++) {
            if (+nav.children[i].getAttribute('year-sort') > +nav.children[j].getAttribute('year-sort')) {
                replacedNode = nav.replaceChild(nav.children[j], nav.children[i]);
                insertAfter(replacedNode, nav.children[i]);
            }
        }
    }
}
function insertAfter(elem, refElem) {
    return refElem.parentNode.insertBefore(elem, refElem.nextSibling);
}


if (elem.innerText.search(val) == -1)  {
    elem.classList.add('hide');
} else {
    elem.classList.remove('hide');
}
}
} else {
elasticItems.forEach(function(elem) {
elem.classList.remove('hide');
});
}
}