// ==UserScript==
// @name         ServiceNow helper
// @namespace    http://www.example.com/
// @version      0.5
// @description  Helper for ServiceNow: Replace "example" with your intended domain name
// @author       Michael P.
// @match        https://serviceportal1.example.com/*
// @match        https://serviceportal2.example.com/*
// @match        https://serviceportal3.example.com/*
// @grant        none
// ==/UserScript==

var tagOpen = false;
var openPos = null;
var closePos = null;

window.onkeydown = function(event) {
    var active = document.activeElement;

    var tag = null;
    var colour = '';
    if (event.altKey) {

        switch(event.which) {
            case 66:
                tag = 'b';
                break;
            case 67:
                tag = 'pre';
                colour = 'green';
                break;
            case 73:
                tag = 'i';
                break;
            case 81:
                tag = 'blockquote';
                colour = 'blue';
                break;
            case 85:
                tag = 'u';
                break;
        }

        if (tag === null) {
            return;
        }

        var selection = window.getSelection().toString();
        var startPos = active.selectionStart;
        var endPos = active.selectionEnd;

        if (selection) {
            var escaped = selection.replace(/&/g, '&');
            escaped = escaped.replace(/</g, '<');
            escaped = escaped.replace(/>/g, '>');
            var wrapped = escaped.replace(/\n/g, "<br>\n");

            var colourOpen;
            var colourClose;

            if (colour) {
                colourOpen = '<font color="' + colour + '">';
                colourClose = '</font>';
            } else {
                colourOpen = '';
                colourClose = '';
            }

            wrapped = '[code]<' + tag + '>' + colourOpen + wrapped + colourClose + '</' + tag + '>[/code]';
            active.value = active.value.substring(0, startPos) + wrapped + active.value.substring(endPos);
        } else {
            if (tagOpen === true) {
                if (colour) {
                    colour = '</font>';
                }
                tag = colour + '</' + tag + '>[/code]';
                tagOpen = false;
                closePos = startPos;
            } else {
                if (colour) {
                    colour = '<font color="' + colour + '">';
                }
                tag = '[code]<' + tag + '>' + colour;
                tagOpen = true;
                openPos = startPos + tag.length;
            }

            // insert tag
            active.value = active.value.substring(0, startPos) + tag + active.value.substring(endPos, active.value.length);

            if (openPos !== null && closePos !== null) {
                var replaced = active.value.substring(openPos, endPos).replace(/&/g, '&');
                replaced = replaced.replace(/</g, '<');
                replaced = replaced.replace(/>/g, '>');
                replaced = replaced.replace(/\n/g, "<br>\n");
                active.value = active.value.substring(0, openPos) + replaced + active.value.substring(closePos);
                openPos = null;
                closePos = null;
            }
        }
    }
};
