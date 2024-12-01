// ==UserScript==
// @name         MusicBrainz Image Helper
// @namespace    https://github.com/lazybookwyrm/MusicBrainzScripts
// @version      2024-12-01.2
// @description  Quickly add archived image links to an artist's profile.
// @author       lazybookwyrm
// @icon         https://www.google.com/s2/favicons?sz=64&domain=musicbrainz.org
// @downloadURL  https://raw.githubusercontent.com/lazybookwyrm/MusicBrainzScripts/main/mb_image_helper.user.js
// @updateURL    https://raw.githubusercontent.com/lazybookwyrm/MusicBrainzScripts/main/mb_image_helper.user.js
// @match        *://lioncat6.github.io/SAMBL/artist/*
// @grant        none
// ==/UserScript==

(function() {
    var imageElementsAvailable = function(callback) {
        if (document.getElementById("mbURL") && document.getElementById("artistImageContainer").querySelector("a")) {
            callback();
        } else {
            setTimeout(function() {
                imageElementsAvailable(callback);
            }, 100);
        }
    };

    imageElementsAvailable(function() {
        var imageElement = document.getElementById("artistImageContainer").querySelector("a");
        var imageURL = imageElement.href;
        var mbId = document.getElementById("mbURL").href;
        imageElement.href = mbId + "/edit?edit-artist.url.0.text=https://web.archive.org/web/0/" + imageURL + "&edit-artist.url.0.link_type_id=173&edit-artist.edit_note=Image URL imported from Spotify/SAMBL using lazybookwyrm's Artist Image Helper userscript https://github.com/lazybookwyrm/MusicBrainzScripts";
    });
})();