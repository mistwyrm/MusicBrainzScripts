// ==UserScript==
// @name         MusicBrainz: Import releases from Wolfgang's
// @namespace    https://github.com/lazybookwyrm/MusicBrainzScripts
// @version      2024-04-28
// @description  Seeds MusicBrainz releases from Wolfgang's
// @author       lazybookwyrm
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @downloadURL  https://raw.githubusercontent.com/lazybookwyrm/MusicBrainzScripts/main/wolfgangs_mb_import.user.js
// @updateURL    https://raw.githubusercontent.com/lazybookwyrm/MusicBrainzScripts/main/wolfgangs_mb_import.user.js
// @match        *://www.wolfgangs.com/music/*
// @grant        none
// ==/UserScript==

var releaseForm;   // Release data
var editNote = ""; // Release Edit Note

// Add release data to form
function add_field (name, value) {
    var field = document.createElement("input");
    field.type  = "hidden";
    field.name  = name;
    field.value = value;
    releaseForm.appendChild(field);
}

(function() {
    'use strict';

    // Create form to store release data
    releaseForm = document.createElement("form");
    releaseForm.method        = "post";
    releaseForm.action        = "//musicbrainz.org/release/add";
    releaseForm.acceptCharset = "UTF-8";
    releaseForm.target        = "_blank";

    // Add the generic release data that does not change
    add_field("type",             "album");
    add_field("status",           "bootleg");
    add_field("language",         "eng");
    add_field("script",           "latn");
    add_field("events.0.country", "XW");
    add_field("labels.0.mbid",    "559944af-0bc7-4f1b-abfd-0b5d6c24b6f8");
    add_field("packaging",        "none");
    add_field("barcode",          "none");
    add_field("mediums.0.format", "Digital Media");

    // Get the name of the release hidden in the HTML and parses the artist's name out of it. Also sets the release type on live releases
    var givenName = JSON.parse(document.getElementsByClassName("concert")[0].getAttribute("data-iteminfo")).name;
    if (givenName.indexOf("ive at") == -1) {
         add_field("name", givenName);
    }
    else {
         add_field("name", "L" + givenName.substring(givenName.indexOf("ive at")));
         add_field("type", "Live");
    }

    // Get release URL, dropping the query string
    var releaseURL = document.location.href.substring(0, document.location.href.indexOf("?"));
    // Add liner note disclaimer to edit note for releases that contain them
    if (document.getElementById("concert-detail-description") != null) {
        editNote = "Additional liner notes are available on the release's web page at " + releaseURL + " ";
    }

    // Add default comment
    editNote += "Imported using lazybookwyrm's Wolfgang's import script (https://github.com/lazybookwyrm/MusicBrainzScripts/blob/main/wolfgangs_mb_import.user.js). Please report any issues with the import script here: https://github.com/lazybookwyrm/MusicBrainzScripts/issues/new";
    add_field("edit_note", editNote);

    // Add the release URL and URL type
    add_field("urls.0.url",       releaseURL);
    add_field("urls.0.link_type", "980");
   
    // Get the artist's name
    add_field("artist_credit.names.0.name", document.getElementsByClassName("title")[0].innerText);

    // Loop through tracks, adding them to the form
    var trackCount = document.getElementsByClassName("tracks")[0].childElementCount;
    for (var i = 0; i < trackCount; i++) {
        var trackNumber = document.getElementsByClassName("tracks")[0].children[i].getElementsByClassName("number")[0].innerText;
        add_field("mediums.0.track." + (trackNumber - 1) + ".name",   document.getElementsByClassName("tracks")[0].children[i].getElementsByClassName("name")[0].innerText);
        add_field("mediums.0.track." + (trackNumber - 1) + ".number", trackNumber);
        add_field("mediums.0.track." + (trackNumber - 1) + ".length", document.getElementsByClassName("tracks")[0].children[i].getElementsByClassName("time")[0].innerText);
    }

    // Append the form to the page so it can be accessed by buttons on the page
    document.body.appendChild(releaseForm);

    // Create Import Release Button. Added as function to allow it to be added to both large and small versions of the page
    function createButton () {
        var newReleaseButton = document.createElement("a");
        newReleaseButton.classList.add("share-links");
        newReleaseButton.style.backgroundColor = "#f0f0f0cc";
        newReleaseButton.style.border          = "2px solid #ba478f";
        newReleaseButton.style.margin          = "0";

        // Add MusicBrainz Icon to Button
        var img = document.createElement("img");
        img.src         = "https://raw.githubusercontent.com/metabrainz/design-system/master/brand/logos/MusicBrainz/SVG/MusicBrainz_logo_icon.svg";
        img.style.width = "18px";
        newReleaseButton.appendChild(img);

        // Add an event listener to submit the form when the button is clicked
        newReleaseButton.addEventListener("click", function(event) {
            event.preventDefault(); // Prevent the default form submission behavior
            releaseForm.submit(); // Submit the form
        });
        return newReleaseButton;
    }

    // Append the button to page
    document.getElementsByClassName("only-view-large")[0].appendChild(createButton());
    document.getElementsByClassName("only-view-small")[0].appendChild(createButton());
})();